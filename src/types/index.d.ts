// index.ts – BunnyLog + Unicode‑table engine in one file
// ------------------------------------------------------
// External deps
import chalk, { ChalkInstance } from "chalk";
import * as os from "os";

/*************************************************
 *  Shared helpers
 *************************************************/

export const LINE_SEP = os.EOL;
const isPlainObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === "object" && !Array.isArray(val);

// Simple printable width for (most) UTF‑8 strings
const strWidth = (s: string) => Array.from(s).length;

/*************************************************
 *  Table subsystem (ported from Zig)
 *************************************************/

export enum Color {
  Black,
  Red,
  Green,
  Yellow,
  Blue,
  Magenta,
  Cyan,
  White,
  BrightBlack,
  BrightRed,
  BrightGreen,
  BrightYellow,
  BrightBlue,
  BrightMagenta,
  BrightCyan,
  BrightWhite,
}
export enum Alignment {
  Left = "left",
  Center = "center",
  Right = "right",
}
export enum LinePosition {
  Top,
  Title,
  Intern,
  Bottom,
}
export enum ColumnPosition {
  Left,
  Intern,
  Right,
}

function fgToAnsi(c: Color) {
  return c <= Color.White ? 30 + c : 90 + (c - Color.BrightBlack);
}
function bgToAnsi(c: Color) {
  return c <= Color.White ? 40 + c : 100 + (c - Color.BrightBlack);
}

export class Style {
  bold = false;
  italic = false;
  underline = false;
  fg?: Color;
  bg?: Color;

  constructor(init?: Partial<Style>) {
    if (init) Object.assign(this, init);
  }
  toAnsi(): string {
    const codes: number[] = [];
    if (typeof this.fg === "number") codes.push(fgToAnsi(this.fg));
    if (typeof this.bg === "number") codes.push(bgToAnsi(this.bg));
    if (this.bold) codes.push(1);
    if (this.italic) codes.push(3);
    if (this.underline) codes.push(4);
    return `\x1b[${codes.join(";") || "0"}m`;
  }
  static reset = "\x1b[0m";
}

interface CellOpts { align?: Alignment; style?: Style; hspan?: number }
export class Cell {
  readonly lines: string[];
  readonly width: number;
  align: Alignment;
  style: Style;
  hspan: number;
  constructor(text = "", opts: CellOpts = {}) {
    this.lines = String(text).split(LINE_SEP);
    this.width = this.lines.reduce((m, l) => Math.max(m, strWidth(l)), 0);
    this.align = opts.align ?? Alignment.Left;
    this.style = opts.style ?? new Style();
    this.hspan = Math.max(1, opts.hspan ?? 1);
  }
  height() { return this.lines.length; }
  private padLine(idx: number, total: number, fill = " ") {
    const raw = this.lines[idx] ?? "";
    const pad = Math.max(0, total - strWidth(raw));
    let left = 0;
    switch (this.align) {
      case Alignment.Right: left = pad; break;
      case Alignment.Center: left = Math.floor(pad / 2); break;
      default: left = 0;
    }
    const right = pad - left;
    return fill.repeat(left) + raw + fill.repeat(right);
  }
  renderLine(idx: number, w: number, colorize = false, skipRight = false) {
    const txt = this.padLine(idx, w);
    if (!colorize) return txt;
    return `${this.style.toAnsi()}${txt}${Style.reset}${skipRight ? "" : ""}`;
  }
}

export class LineSeparator {
  constructor(
    public line: string,
    public junc: string,
    public ljunc: string,
    public rjunc: string,
  ) {}
  print(cols: readonly number[], lp: number, rp: number, opts: { colSep?: boolean; lBorder?: boolean; rBorder?: boolean } = {}, indent = 0) {
    const { colSep = false, lBorder = false, rBorder = false } = opts;
    const out: string[] = [];
    if (indent) out.push(" ".repeat(indent));
    if (lBorder) out.push(this.ljunc);
    cols.forEach((w, i) => {
      out.push(this.line.repeat(w + lp + rp));
      if (colSep && i < cols.length - 1) out.push(this.junc);
    });
    if (rBorder) out.push(this.rjunc);
    return out.join("") + LINE_SEP;
  }
}

export class TableFormat {
  csep?: string; lborder?: string; rborder?: string;
  lsep?: LineSeparator; tsep?: LineSeparator; topSep?: LineSeparator; bottomSep?: LineSeparator;
  padLeft = 0; padRight = 0; indent = 0;
  // Chainable setters
  withPadding(l: number, r: number) { this.padLeft = l; this.padRight = r; return this; }
  withColumnSeparator(c: string) { this.csep = c; return this; }
  withBorders(b: string) { this.lborder = b; this.rborder = b; return this; }
  withLeftBorder(b: string) { this.lborder = b; return this; }
  withRightBorder(b: string) { this.rborder = b; return this; }
  withSeparator(pos: LinePosition, sep: LineSeparator) { switch (pos) {
    case LinePosition.Top: this.topSep = sep; break;
    case LinePosition.Bottom: this.bottomSep = sep; break;
    case LinePosition.Title: this.tsep = sep; break;
    case LinePosition.Intern: this.lsep = sep; break; } return this; }
  withIndent(spaces: number) { this.indent = spaces; return this; }
  columnSep(pos: ColumnPosition) { return pos === ColumnPosition.Left ? this.lborder : pos === ColumnPosition.Right ? this.rborder : this.csep; }
  lineSep(pos: LinePosition) { switch (pos) {
    case LinePosition.Top: return this.topSep; case LinePosition.Bottom: return this.bottomSep;
    case LinePosition.Title: return this.tsep ?? this.lsep; case LinePosition.Intern: return this.lsep; }}
  printLine(widths: readonly number[], pos: LinePosition) {
    const sep = this.lineSep(pos); if (!sep) return "";
    return sep.print(widths, this.padLeft, this.padRight, { colSep: !!this.csep, lBorder: !!this.lborder, rBorder: !!this.rborder }, this.indent);
  }
}

export class Row {
  constructor(public cells: Cell[]) {}
  len() { return this.cells.length; }
  height() { return this.cells.reduce((m, c) => Math.max(m, c.height()), 1); }
  columnCount() { return this.cells.reduce((s, c) => s + c.hspan, 0); }
  columnWidth(col: number, fmt: TableFormat) {
    let i = 0;
    for (const cell of this.cells) {
      if (i + cell.hspan > col) {
        if (cell.hspan === 1) return cell.width;
        const sepW = fmt.csep ? 1 : 0;
        const rem = fmt.padLeft + fmt.padRight + sepW;
        const wNoPad = Math.max(0, cell.width - rem);
        return Math.ceil(wNoPad / cell.hspan);
      }
      i += cell.hspan;
    }
    return 0;
  }
  render(fmt: TableFormat, widths: readonly number[], colorize = false) {
    const out: string[] = [];
    const h = this.height();
    const totalCols = widths.length;
    for (let rowLine = 0; rowLine < h; rowLine++) {
      const chunk: string[] = [];
      if (fmt.indent) chunk.push(" ".repeat(fmt.indent));
      if (fmt.columnSep(ColumnPosition.Left)) chunk.push(fmt.columnSep(ColumnPosition.Left)!);
      let gridCol = 0;
      for (const cell of this.cells) {
        const span = cell.hspan;
        const spanWidths = widths.slice(gridCol, gridCol + span);
        const cellWidth = spanWidths.reduce((s, w) => s + w, 0) + (span - 1) * (fmt.padLeft + fmt.padRight + (fmt.csep ? 1 : 0));
        // left pad
        chunk.push(" ".repeat(fmt.padLeft));
        const skipRight = gridCol + span === totalCols && !fmt.columnSep(ColumnPosition.Right);
        chunk.push(cell.renderLine(rowLine, cellWidth, colorize, skipRight));
        // right pad
        chunk.push(" ".repeat(fmt.padRight));
        gridCol += span;
        if (gridCol < totalCols) {
          const s = fmt.columnSep(ColumnPosition.Intern);
          if (s) chunk.push(s);
        }
      }
      // fill remaining empty cols
      while (gridCol < totalCols) {
        chunk.push(" ".repeat(fmt.padLeft));
        chunk.push(new Cell().renderLine(rowLine, widths[gridCol], colorize));
        chunk.push(" ".repeat(fmt.padRight));
        gridCol++;
        if (gridCol < totalCols && fmt.csep) chunk.push(fmt.csep);
      }
      if (fmt.columnSep(ColumnPosition.Right)) chunk.push(fmt.columnSep(ColumnPosition.Right)!);
      chunk.push(LINE_SEP);
      out.push(chunk.join(""));
    }
    return out.join("");
  }
}

export class Table {
  readonly rows: Row[] = [];
  titles?: Row;
  private fmt: TableFormat = FORMAT_DEFAULT;
  setFormat(f: TableFormat) { this.fmt = f; }
  getFormat() { return this.fmt; }
  async addRow(data: readonly (string | Cell)[]) { this.rows.push(new Row(data.map((d) => d instanceof Cell ? d : new Cell(String(d))))); }
  async addRows(rows: readonly (readonly (string | Cell)[])[]) { for (const r of rows) await this.addRow(r); }
  async setTitle(data: readonly (string | Cell)[]) { this.titles = new Row(data.map((d) => d instanceof Cell ? d : new Cell(String(d)))); }
  private colCount() { return Math.max(this.titles?.columnCount() ?? 0, ...this.rows.map((r) => r.columnCount())); }
  private collectWidths() { const n = this.colCount(); const w = new Array<number>(n).fill(0); const upd = (r: Row) => { for (let c = 0; c < n; c++) w[c] = Math.max(w[c], r.columnWidth(c, this.fmt)); }; if (this.titles) upd(this.titles); this.rows.forEach(upd); return w; }
  render(colorize = false) {
    const widths = this.collectWidths();
    const parts: string[] = [];
    parts.push(this.fmt.printLine(widths, LinePosition.Top));
    if (this.titles) { parts.push(this.titles.render(this.fmt, widths, colorize)); parts.push(this.fmt.printLine(widths, LinePosition.Title)); }
    this.rows.forEach((r, i) => { parts.push(r.render(this.fmt, widths, colorize)); if (i < this.rows.length - 1) parts.push(this.fmt.printLine(widths, LinePosition.Intern)); });
    parts.push(this.fmt.printLine(widths, LinePosition.Bottom));
    return parts.join("");
  }
}

// Predefined separators & formats
export const MINUS_PLUS_SEP = new LineSeparator("-", "+", "+", "+");
export const EQU_PLUS_SEP = new LineSeparator("=", "+", "+", "+");
export const FORMAT_DEFAULT = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Title, EQU_PLUS_SEP)
  .withSeparator(LinePosition.Intern, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withPadding(1, 1);
export const FORMAT_NO_TITLE = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Title, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Intern, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withPadding(1, 1);
export const FORMAT_NO_LINESEP_WITH_TITLE = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Title, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withPadding(1, 1);
export const FORMAT_NO_LINESEP = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withPadding(1, 1);
export const FORMAT_BOX_CHARS = new TableFormat()
  .withColumnSeparator("│")
  .withBorders("│")
  .withSeparator(LinePosition.Top, new LineSeparator("─", "┬", "┌", "┐"))
  .withSeparator(LinePosition.Intern, new LineSeparator("─", "┼", "├", "┤"))
  .withSeparator(LinePosition.Bottom, new LineSeparator("─", "┴", "└", "┘"))
  .withPadding(1, 1);
export const FORMAT_UNICODE = FORMAT_BOX_CHARS; // alias for nicer name
export const FORMAT_UNICODE_ROUND = new TableFormat()
  .withColumnSeparator("│")
  .withBorders("│")
  .withSeparator(LinePosition.Top, new LineSeparator("─", "┬", "╭", "╮"))
  .withSeparator(LinePosition.Intern, new LineSeparator("─", "┼", "├", "┤"))
  .withSeparator(LinePosition.Bottom, new LineSeparator("─", "┴", "╰", "╯"))
  .withPadding(1, 1);

/*************************************************
 *  BunnyLogger – colourful, auto‑extensible logger
 *************************************************/

/**
 * Represents a valid JSON value
 */
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray

/**
 * Represents a JSON object
 */
export interface JsonObject {
	[key: string]: JsonValue
}

/**
 * Represents a JSON array
 */
export type JsonArray = JsonValue[]

/**
 * Table options interface
 */
export interface TableOptions {
	header?: boolean
	columns?: string[]
}

/**
 * Clean and simple BunnyLogger class with auto-category creation and method chaining
 */
export declare class BunnyLogger {
	constructor(defaultCategories?: boolean)

	// Core methods
	/**
	 * Main logging method - creates categories automatically
	 * @param category - The category name (any string)
	 * @param message - The message to log (string, number, object, error, etc.)
	 * @param additionalArgs - Additional arguments to log
	 */
	log(category: string, message: string | number | boolean | object | Error | null | undefined, ...additionalArgs: any[]): BunnyLogger

	hex(category: string, hexColor: string): BunnyLogger
	rgb(category: string, r: number, g: number, b: number): BunnyLogger
	table(data: Array<JsonObject>, options?: TableOptions): BunnyLogger
	getCategories(): string[]
	setColor(category: string, color: any): BunnyLogger
	setHex(category: string, hexColor: string): BunnyLogger
	removeCategory(category: string): BunnyLogger
	setTimeFormat(format: '12h' | '24h'): BunnyLogger
	getTimeFormat(): '12h' | '24h'
	getTimestamp(): string
	setShowSeconds(show: boolean): BunnyLogger
	getShowSeconds(): boolean
	showSecondsInTime(): BunnyLogger
	hideSecondsInTime(): BunnyLogger
	setTextColor(enabled: boolean): BunnyLogger
	getTextColor(): boolean
	enableTextColor(): BunnyLogger
	disableTextColor(): BunnyLogger
	colorizeJson(obj: unknown, indent?: number): string
	static clean(): BunnyLogger
}

/**
 * Singleton instance with dynamic methods
 */
export declare const bunnyLog: BunnyLogger

// Convenience re‑exports
export { Style as TableStyle };
