import * as os from "os";

/** One-stop, battery‑included port of the Zig table example to JavaScript.
 *  The public surface API mirrors the original as closely as possible while leveraging
 *  JS conveniences (no manual allocators, native strings, etc.).
 *  All classes are exported so you can cherry‑pick what you need or
 *  simply import everything from this module.
 *
 *  Example
 *  -------
 *  ```js
 *  import { Table, FORMAT_DEFAULT } from "./table/index.js";
 *
 *  const table = new Table();
 *  table.setFormat(FORMAT_DEFAULT);
 *  await table.addRows([
 *    ["ABC", "DEFG", "HIJKLMN"],
 *    ["foobar", "foo", "bar"],
 *    ["1", "2", "3"],
 *  ]);
 *
 *  console.log(table.render());       // plain
 *  console.log(table.render(true));   // ANSI‑coloured (if styles are set)
 *  ```
 */

/*************************************************
 *  Low‑level helpers
 *************************************************/

/** Platform line separator ("\n" on POSIX, "\r\n" on Windows). */
export const LINE_SEP = os.EOL;

/** Coarse string width helper that correctly counts UTF‑8 code‑points and handles ANSI escapes. */
function stringWidth(str) {
  if (typeof str !== 'string') return 0;

  // Remove ANSI escape sequences
  const ansiRegex = /\u001b\[[0-9;]*m/g;
  const cleanStr = str.replace(ansiRegex, '');

  // Handle emoji and complex unicode - approximate width
  let width = 0;
  for (const char of cleanStr) {
    const code = char.codePointAt(0);
    if (code >= 0x1F600 && code <= 0x1F64F) width += 2; // Emoticons
    else if (code >= 0x1F300 && code <= 0x1F5FF) width += 2; // Misc symbols
    else if (code >= 0x1F680 && code <= 0x1F6FF) width += 2; // Transport
    else if (code >= 0x2600 && code <= 0x26FF) width += 2; // Misc symbols
    else if (code >= 0x2700 && code <= 0x27BF) width += 2; // Dingbats
    else width += 1;
  }

  return width;
}

/*************************************************
 *  Styling & ANSI helpers
 *************************************************/

export const Color = {
  Black: 0,
  Red: 1,
  Green: 2,
  Yellow: 3,
  Blue: 4,
  Magenta: 5,
  Cyan: 6,
  White: 7,
  BrightBlack: 8,
  BrightRed: 9,
  BrightGreen: 10,
  BrightYellow: 11,
  BrightBlue: 12,
  BrightMagenta: 13,
  BrightCyan: 14,
  BrightWhite: 15,
};

function fgToAnsi(c) {
  return c <= Color.White ? 30 + c : 90 + (c - Color.BrightBlack);
}

function bgToAnsi(c) {
  return c <= Color.White ? 40 + c : 100 + (c - Color.BrightBlack);
}

export class Style {
  constructor(init = {}) {
    this.bold = false;
    this.italic = false;
    this.underline = false;
    this.fg = undefined;
    this.bg = undefined;

    if (init) Object.assign(this, init);
  }

  /** Build ANSI escape prefix (without trailing reset). */
  toAnsi() {
    const codes = [];
    if (typeof this.fg === "number") codes.push(fgToAnsi(this.fg));
    if (typeof this.bg === "number") codes.push(bgToAnsi(this.bg));
    if (this.bold) codes.push(1);
    if (this.italic) codes.push(3);
    if (this.underline) codes.push(4);
    return `\x1b[${codes.join(";") || "0"}m`;
  }

  static reset = "\x1b[0m";
}

/*************************************************
 *  Table building blocks
 *************************************************/

export const Alignment = {
  Left: "left",
  Center: "center",
  Right: "right",
};

export class Cell {
  constructor(text = "", opts = {}) {
    this.lines = text.split(LINE_SEP);
    this.width = this.lines.reduce((m, l) => Math.max(m, stringWidth(l)), 0);
    this.align = opts.align ?? Alignment.Left;
    this.style = opts.style ?? new Style();
    this.hspan = Math.max(1, opts.hspan ?? 1);
  }

  height() {
    return this.lines.length;
  }

  /** Write `lineIdx`‑th visual line into `dst`, applying alignment/fill. */
  writeLine(lineIdx, colWidth, fill = " ") {
    const raw = this.lines[lineIdx] ?? "";
    const pad = Math.max(0, colWidth - stringWidth(raw));

    let left = 0;
    switch (this.align) {
      case Alignment.Right:
        left = pad;
        break;
      case Alignment.Center:
        left = Math.floor(pad / 2);
        break;
      default:
        left = 0;
    }
    const right = pad - left;
    return fill.repeat(left) + raw + fill.repeat(right);
  }

  /** Render the `idx`‑th visual line (with or without style). */
  renderLine(idx, width, colorize = false, skipRightFill = false) {
    const txt = this.writeLine(idx, width);
    if (!colorize || (this.style && this.style.toAnsi() === "\x1b[0m")) return txt;
    return `${this.style.toAnsi()}${txt}${Style.reset}${skipRightFill ? "" : ""}`;
  }
}

/*************************************************
 *  Separators & format glue
 *************************************************/

export const LinePosition = {
  Top: 0,
  Title: 1,
  Intern: 2,
  Bottom: 3,
};

export const ColumnPosition = {
  Left: 0,
  Intern: 1,
  Right: 2,
};

export class LineSeparator {
  constructor(line, junc, ljunc, rjunc) {
    this.line = line;
    this.junc = junc;
    this.ljunc = ljunc;
    this.rjunc = rjunc;
  }

  print(colWidths, padLeft, padRight, opts = {}, indent = 0) {
    const { colSep = false, lBorder = false, rBorder = false } = opts;
    const pieces = [];
    if (indent) pieces.push(" ".repeat(indent));
    if (lBorder) pieces.push(this.ljunc);

    colWidths.forEach((w, i) => {
      pieces.push(this.line.repeat(w + padLeft + padRight));
      if (colSep && i < colWidths.length - 1) pieces.push(this.junc);
    });

    if (rBorder) pieces.push(this.rjunc);
    return pieces.join("") + LINE_SEP;
  }
}

export class TableFormat {
  constructor() {
    this.csep = undefined;
    this.lborder = undefined;
    this.rborder = undefined;
    this.lsep = undefined;
    this.tsep = undefined;
    this.topSep = undefined;
    this.bottomSep = undefined;
    this.padLeft = 0;
    this.padRight = 0;
    this.indent = 0;
  }

  // ----- chainable setters -----
  withPadding(l, r) {
    this.padLeft = l;
    this.padRight = r;
    return this;
  }

  withColumnSeparator(c) {
    this.csep = c;
    return this;
  }

  withBorders(b) {
    this.lborder = b;
    this.rborder = b;
    return this;
  }

  withLeftBorder(b) {
    this.lborder = b;
    return this;
  }

  withRightBorder(b) {
    this.rborder = b;
    return this;
  }

  withSeparator(pos, sep) {
    switch (pos) {
      case LinePosition.Top:
        this.topSep = sep;
        break;
      case LinePosition.Bottom:
        this.bottomSep = sep;
        break;
      case LinePosition.Title:
        this.tsep = sep;
        break;
      case LinePosition.Intern:
        this.lsep = sep;
        break;
    }
    return this;
  }

  withIndent(spaces) {
    this.indent = spaces;
    return this;
  }

  // ----- helpers -----
  columnSep(pos) {
    switch (pos) {
      case ColumnPosition.Left:
        return this.lborder;
      case ColumnPosition.Intern:
        return this.csep;
      case ColumnPosition.Right:
        return this.rborder;
    }
  }

  lineSep(pos) {
    switch (pos) {
      case LinePosition.Top:
        return this.topSep;
      case LinePosition.Bottom:
        return this.bottomSep;
      case LinePosition.Title:
        return this.tsep ?? this.lsep;
      case LinePosition.Intern:
        return this.lsep;
    }
  }

  printLine(colWidths, pos) {
    const sep = this.lineSep(pos);
    if (!sep) return "";
    return sep.print(colWidths, this.padLeft, this.padRight, {
      colSep: !!this.csep,
      lBorder: !!this.lborder,
      rBorder: !!this.rborder,
    }, this.indent);
  }
}

/*************************************************
 *  Row
 *************************************************/

export class Row {
  constructor(cells) {
    this.cells = cells;
  }

  len() {
    return this.cells.length;
  }

  /** Height of tallest cell (in visual lines). */
  height() {
    return this.cells.reduce((m, c) => Math.max(m, c.height()), 1);
  }

  /** Number of grid columns this row spans (takes hspan into account). */
  columnCount() {
    return this.cells.reduce((s, c) => s + c.hspan, 0);
  }

  cell(idx) {
    return this.cells[idx];
  }

  /** Width of grid column `col`, taking spanning into account. */
  columnWidth(col, fmt) {
    let i = 0;
    for (const cell of this.cells) {
      if (i + cell.hspan > col) {
        if (cell.hspan === 1) return cell.width;
        // spread width across span like Zig version
        const sepW = fmt.csep ? 1 : 0;
        const rem = fmt.padLeft + fmt.padRight + sepW;
        const wNoPad = Math.max(0, cell.width - rem);
        return Math.ceil(wNoPad / cell.hspan);
      }
      i += cell.hspan;
    }
    return 0;
  }

  /******** Rendering ********/

  renderInternal(fmt, colWidths, colorize) {
    const lines = [];
    const totalCols = colWidths.length;
    const h = this.height();

    for (let rowLine = 0; rowLine < h; rowLine++) {
      const parts = [];
      if (fmt.indent) parts.push(" ".repeat(fmt.indent));
      if (fmt.columnSep(ColumnPosition.Left)) parts.push(fmt.columnSep(ColumnPosition.Left));

      let gridCol = 0;

      for (let logical = 0; logical < this.cells.length; logical++) {
        const cell = this.cells[logical];
        const span = cell.hspan;
        const spanCols = colWidths.slice(gridCol, gridCol + span);
        const cellWidth = spanCols.reduce((s, w) => s + w, 0) + (span - 1) * (fmt.padLeft + fmt.padRight + (fmt.csep ? 1 : 0));

        // left padding
        parts.push(" ".repeat(fmt.padLeft));

        const skipRightFill = gridCol + span === totalCols && !fmt.columnSep(ColumnPosition.Right);
        parts.push(cell.renderLine(rowLine, cellWidth, colorize, skipRightFill));

        // right padding
        parts.push(" ".repeat(fmt.padRight));

        gridCol += span;
        if (gridCol < totalCols) {
          const sep = fmt.columnSep(ColumnPosition.Intern);
          if (sep) parts.push(sep);
        }
      }

      // fill trailing empty columns (if row shorter than table)
      while (gridCol < totalCols) {
        // empty cell surrogate
        const empty = new Cell();
        parts.push(" ".repeat(fmt.padLeft));
        parts.push(empty.renderLine(rowLine, colWidths[gridCol], colorize));
        parts.push(" ".repeat(fmt.padRight));
        gridCol++;
        if (gridCol < totalCols) {
          const sep = fmt.columnSep(ColumnPosition.Intern);
          if (sep) parts.push(sep);
        }
      }

      if (fmt.columnSep(ColumnPosition.Right)) parts.push(fmt.columnSep(ColumnPosition.Right));
      parts.push(LINE_SEP);
      lines.push(parts.join(""));
    }

    return lines.join("");
  }

  render(fmt, colWidths, colorize = false) {
    return this.renderInternal(fmt, colWidths, colorize);
  }
}

/*************************************************
 *  Pre‑built formats (ports of Zig constants)
 *************************************************/

export const MINUS_PLUS_SEP = new LineSeparator("-", "+", "+", "+");
export const EQU_PLUS_SEP = new LineSeparator("=", "+", "+", "+");

export const FORMAT_DEFAULT = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Title, EQU_PLUS_SEP)
  .withSeparator(LinePosition.Intern, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withPadding(1, 1);

export const FORMAT_NO_TITLE = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Intern, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Title, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Bottom, MINUS_PLUS_SEP)
  .withSeparator(LinePosition.Top, MINUS_PLUS_SEP)
  .withPadding(1, 1);

export const FORMAT_NO_LINESEP_WITH_TITLE = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withSeparator(LinePosition.Title, MINUS_PLUS_SEP)
  .withPadding(1, 1);

export const FORMAT_NO_LINESEP = new TableFormat()
  .withColumnSeparator("|")
  .withBorders("|")
  .withPadding(1, 1);

export const FORMAT_UNICODE = new TableFormat()
  .withColumnSeparator("│")
  .withBorders("│")
  .withSeparator(LinePosition.Title, new LineSeparator("═", "╪", "╞", "╡"))
  .withSeparator(LinePosition.Intern, new LineSeparator("─", "┼", "├", "┤"))
  .withSeparator(LinePosition.Bottom, new LineSeparator("─", "┴", "└", "┘"))
  .withSeparator(LinePosition.Top, new LineSeparator("─", "┬", "┌", "┐"))
  .withPadding(1, 1);

export const FORMAT_UNICODE_ROUND = new TableFormat()
  .withColumnSeparator("│")
  .withBorders("│")
  .withSeparator(LinePosition.Title, new LineSeparator("═", "╪", "╞", "╡"))
  .withSeparator(LinePosition.Intern, new LineSeparator("─", "┼", "├", "┤"))
  .withSeparator(LinePosition.Bottom, new LineSeparator("─", "┴", "╰", "╯"))
  .withSeparator(LinePosition.Top, new LineSeparator("─", "┬", "╭", "╮"))
  .withPadding(1, 1);

/*************************************************
 *  Table
 *************************************************/

export class Table {
  constructor() {
    this.rows = [];
    this.titles = undefined;
    this.format = FORMAT_DEFAULT;
  }

  setFormat(fmt) {
    this.format = fmt;
  }

  getFormat() {
    return this.format;
  }

  async addRow(data) {
    const cells = data.map((c) => (c instanceof Cell ? c : new Cell(String(c))));
    this.rows.push(new Row(cells));
  }

  async addRows(rows) {
    for (const r of rows) await this.addRow(r);
  }

  async setTitle(data) {
    const cells = data.map((c) => (c instanceof Cell ? c : new Cell(String(c))));
    this.titles = new Row(cells);
  }

  /** Column count based on widest row (in grid columns). */
  columnCount() {
    let count = this.titles ? this.titles.columnCount() : 0;
    for (const r of this.rows) count = Math.max(count, r.columnCount());
    return count;
  }

  collectColWidths() {
    const count = this.columnCount();
    const widths = new Array(count).fill(0);
    const consider = (r) => {
      for (let col = 0; col < count; col++) {
        widths[col] = Math.max(widths[col], r.columnWidth(col, this.format));
      }
    };
    if (this.titles) consider(this.titles);
    this.rows.forEach(consider);
    return widths;
  }

  /******** public rendering ********/

  /**
   * Render the table as a string.
   * @param {boolean} colorize Output ANSI styles even if stdout is not a TTY (default: false)
   */
  render(colorize = false) {
    const colWidths = this.collectColWidths();
    const fmt = this.format;

    const outParts = [];
    outParts.push(fmt.printLine(colWidths, LinePosition.Top));

    if (this.titles) {
      outParts.push(this.titles.render(fmt, colWidths, colorize));
      outParts.push(fmt.printLine(colWidths, LinePosition.Title));
    }

    this.rows.forEach((row, idx) => {
      outParts.push(row.render(fmt, colWidths, colorize));
      const needLine = idx < this.rows.length - 1;
      if (needLine) outParts.push(fmt.printLine(colWidths, LinePosition.Intern));
    });

    outParts.push(fmt.printLine(colWidths, LinePosition.Bottom));
    return outParts.join("");
  }
}
