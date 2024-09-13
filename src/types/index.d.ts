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
 * The BunnyLog interface provides logging methods for various categories, a method to add new categories,
 * and a method to log data in a table format.
 */
interface BunnyLog {
	server: LogFunction
	database: LogFunction
	api: LogFunction
	error: LogFunction
	info: LogFunction
	success: LogFunction
	warn: LogFunction

	/**
	 * Method to add a new logging category dynamically.
	 *
	 * @param category - The name of the new category.
	 * @param color - A chalk color function to style the category label.
	 */
	addCategory: (category: string, color: chalk.Chalk) => void

	/**
	 * Method to log data in a table format.
	 *
	 * @param data - An array of objects representing the table rows.
	 * @param options - Optional configuration for the table display.
	 */
	table: (data: Array<JsonObject>, options?: TableOptions) => void

	/**
	 * Dynamic properties for additional categories added via `addCategory`.
	 */
	[key: string]: LogFunction | ((category: string, color: chalk.Chalk) => void)
}

export declare const bunnyLog: BunnyLog
