import type { ChalkInstance } from 'chalk';

/**
 * Represents a valid JSON value, which can be a string, number, boolean, null, object, or array.
 * This type is useful for ensuring that only valid JSON-compatible values are used.
 */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray

/**
 * Represents a JSON object, where each key is a string and the value is a valid JSON value.
 */
interface JsonObject {
	[key: string]: JsonValue
}

/**
 * Represents a JSON array, which is an array of valid JSON values.
 */
type JsonArray = JsonValue[]

/**
 * Represents the different categories of logs that can be used with the `bunnyLog` function.
 * These categories help to differentiate the types of logs and apply specific formatting or colors.
 */
type LogCategory =
	| 'server'
	| 'database'
	| 'api'
	| 'error'
	| 'info'
	| 'success'
	| 'warn'

/**
 * Represents the structure of the logging function for a single category.
 * Accepts multiple arguments of various types and logs them appropriately.
 */
type LogFunction = (
	...args: Array<
		string | number | boolean | null | undefined | JsonValue | Error
	>
) => void

/**
 * Represents the options that can be passed to the `table` method.
 */
interface TableOptions {
	header?: boolean
	columns?: string[]
}

/**
 * The BunnyLogger class provides colored logging methods for various categories,
 * with automatic category creation via Proxy and easy hex color support.
 */
export declare class BunnyLogger {
	// Default logging methods (strongly typed)
	server: LogFunction
	database: LogFunction
	api: LogFunction
	error: LogFunction
	info: LogFunction
	success: LogFunction
	warn: LogFunction

	/**
	 * Constructor to create a new BunnyLogger instance
	 * @param defaultCategories - Whether to include default categories (default: true)
	 */
	constructor(defaultCategories?: boolean)

	/**
	 * Main logging method with colors
	 *
	 * @param category - The log category
	 * @param args - Arguments to log
	 */
	log(category: string, ...args: Array<string | number | boolean | null | undefined | JsonValue | Error>): void

	/**
	 * Method to add a new logging category dynamically with color support.
	 *
	 * @param category - The name of the new category.
	 * @param color - A chalk color function to style the category label.
	 * @returns The BunnyLogger instance for chaining
	 */
	addCategory(category: string, color?: ChalkInstance): this

	/**
	 * Add category with hex color (easier syntax)
	 *
	 * @param category - The category name
	 * @param hexColor - Hex color string (e.g., "#FF0000")
	 * @returns The BunnyLogger instance for chaining
	 */
	hex(category: string, hexColor: string): this

	/**
	 * Add category with RGB color
	 *
	 * @param category - The category name
	 * @param r - Red component (0-255)
	 * @param g - Green component (0-255)
	 * @param b - Blue component (0-255)
	 * @returns The BunnyLogger instance for chaining
	 */
	rgb(category: string, r: number, g: number, b: number): this

	/**
	 * Method to log data in a table format using console.table with colors.
	 *
	 * @param data - An array of objects representing the table rows.
	 * @param options - Optional configuration for the table display.
	 */
	table(data: Array<JsonObject>, options?: TableOptions): void

	/**
	 * Get list of available log categories
	 *
	 * @returns Array of category names
	 */
	getCategories(): string[]

	/**
	 * Set color for an existing category
	 *
	 * @param category - The category name
	 * @param color - The chalk color function
	 * @returns The BunnyLogger instance for chaining
	 */
	setColor(category: string, color: ChalkInstance): this

	/**
	 * Set hex color for an existing category
	 *
	 * @param category - The category name
	 * @param hexColor - Hex color string (e.g., "#FF0000")
	 * @returns The BunnyLogger instance for chaining
	 */
	setHex(category: string, hexColor: string): this

	/**
	 * Remove a category
	 *
	 * @param category - The category name to remove
	 * @returns The BunnyLogger instance for chaining
	 */
	removeCategory(category: string): this

	/**
	 * Set time format for timestamps
	 * @param format - Either '12h' or '24h'
	 * @returns The BunnyLogger instance for chaining
	 */
	setTimeFormat(format: '12h' | '24h'): this

	/**
	 * Get current time format
	 * @returns Current time format ('12h' or '24h')
	 */
	getTimeFormat(): '12h' | '24h'

	/**
	 * Set to 12-hour format (convenience method)
	 * @returns The BunnyLogger instance for chaining
	 */
	use12HourFormat(): this

	/**
	 * Set to 24-hour format (convenience method)
	 * @returns The BunnyLogger instance for chaining
	 */
	use24HourFormat(): this

	/**
	 * Get formatted timestamp based on current time format setting
	 * @returns Formatted timestamp string with chalk styling
	 */
	getTimestamp(): string

	/**
	 * Set whether to show seconds in timestamps
	 * @param show - Whether to show seconds
	 * @returns The BunnyLogger instance for chaining
	 */
	setShowSeconds(show: boolean): this

	/**
	 * Get current seconds display setting
	 * @returns Whether seconds are currently shown
	 */
	getShowSeconds(): boolean

	/**
	 * Show seconds in timestamps (convenience method)
	 * @returns The BunnyLogger instance for chaining
	 */
	showSecondsInTime(): this

	/**
	 * Hide seconds in timestamps (convenience method)
	 * @returns The BunnyLogger instance for chaining
	 */
	hideSecondsInTime(): this

	/**
	 * Colorize JSON objects for pretty output
	 *
	 * @param obj - The object to colorize
	 * @param indent - Indentation level
	 * @returns Colorized string representation
	 */
	colorizeJson(obj: any, indent?: number): string

	/**
	 * Create a clean instance with no default categories
	 * @returns A new BunnyLogger instance without default categories
	 */
	static clean(): BunnyLogger

	/**
	 * Auto-created properties for any category (via Proxy).
	 * TypeScript will show suggestions for known categories, but any string property
	 * will automatically create a logging function.
	 */
	[key: string]: LogFunction | any
}

// Table types for the new table system

/**
 * Color enum for ANSI styling
 */
export declare enum Color {
	Black = 0,
	Red = 1,
	Green = 2,
	Yellow = 3,
	Blue = 4,
	Magenta = 5,
	Cyan = 6,
	White = 7,
	BrightBlack = 8,
	BrightRed = 9,
	BrightGreen = 10,
	BrightYellow = 11,
	BrightBlue = 12,
	BrightMagenta = 13,
	BrightCyan = 14,
	BrightWhite = 15,
}

/**
 * Alignment options for table cells
 */
export declare enum Alignment {
	Left = "left",
	Center = "center",
	Right = "right",
}

/**
 * Line position for table formatting
 */
export declare enum LinePosition {
	Top = 0,
	Title = 1,
	Intern = 2,
	Bottom = 3,
}

/**
 * Column position for table formatting
 */
export declare enum ColumnPosition {
	Left = 0,
	Intern = 1,
	Right = 2,
}

/**
 * Style configuration for table cells
 */
export declare class Style {
	bold: boolean
	italic: boolean
	underline: boolean
	fg?: Color
	bg?: Color

	constructor(init?: Partial<Style>)
	toAnsi(): string
	static reset: string
}

/**
 * Table cell configuration
 */
interface CellOptions {
	align?: Alignment
	style?: Style
	hspan?: number
}

/**
 * Table cell class
 */
export declare class Cell {
	readonly lines: string[]
	readonly width: number
	align: Alignment
	style: Style
	hspan: number

	constructor(text?: string, opts?: CellOptions)
	height(): number
	renderLine(idx: number, width: number, colorize?: boolean, skipRightFill?: boolean): string
}

/**
 * Line separator for table formatting
 */
export declare class LineSeparator {
	line: string
	junc: string
	ljunc: string
	rjunc: string

	constructor(line: string, junc: string, ljunc: string, rjunc: string)
	print(colWidths: readonly number[], padLeft: number, padRight: number, opts?: {
		colSep?: boolean
		lBorder?: boolean
		rBorder?: boolean
	}, indent?: number): string
}

/**
 * Table format configuration
 */
export declare class TableFormat {
	csep?: string
	lborder?: string
	rborder?: string
	lsep?: LineSeparator
	tsep?: LineSeparator
	topSep?: LineSeparator
	bottomSep?: LineSeparator
	padLeft: number
	padRight: number
	indent: number

	constructor()
	withPadding(l: number, r: number): TableFormat
	withColumnSeparator(c: string): TableFormat
	withBorders(b: string): TableFormat
	withLeftBorder(b: string): TableFormat
	withRightBorder(b: string): TableFormat
	withSeparator(pos: LinePosition, sep: LineSeparator): TableFormat
	withIndent(spaces: number): TableFormat
	columnSep(pos: ColumnPosition): string | undefined
	lineSep(pos: LinePosition): LineSeparator | undefined
	printLine(colWidths: readonly number[], pos: LinePosition): string
}

/**
 * Table row
 */
export declare class Row {
	cells: Cell[]

	constructor(cells: Cell[])
	len(): number
	height(): number
	columnCount(): number
	cell(idx: number): Cell | undefined
	columnWidth(col: number, fmt: TableFormat): number
	render(fmt: TableFormat, colWidths: readonly number[], colorize?: boolean): string
}

/**
 * Advanced table class for complex table rendering
 */
export declare class Table {
	readonly rows: Row[]
	titles?: Row

	constructor()
	setFormat(fmt: TableFormat): void
	getFormat(): TableFormat
	addRow(data: readonly (string | Cell)[]): Promise<void>
	addRows(rows: readonly (readonly (string | Cell)[])[]): Promise<void>
	setTitle(data: readonly (string | Cell)[]): Promise<void>
	render(colorize?: boolean): string
}

// Pre-built table formats
export declare const MINUS_PLUS_SEP: LineSeparator
export declare const EQU_PLUS_SEP: LineSeparator
export declare const FORMAT_DEFAULT: TableFormat
export declare const FORMAT_NO_TITLE: TableFormat
export declare const FORMAT_NO_LINESEP_WITH_TITLE: TableFormat
export declare const FORMAT_NO_LINESEP: TableFormat
export declare const FORMAT_UNICODE: TableFormat
export declare const FORMAT_UNICODE_ROUND: TableFormat

// Export the singleton instance AND the class
export declare const bunnyLog: BunnyLogger
