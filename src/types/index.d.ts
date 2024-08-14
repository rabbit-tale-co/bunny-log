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
	| 'warning'
	| 'object'

/**
 * Logs a message to the console with a specified category. The category determines the type and color of the log.
 *
 * @param {LogCategory} category - The category of the log message. Determines the log type and color.
 * @param {...unknown[]} args - The messages or objects to be logged. Multiple arguments are allowed.
 *                              Objects will be formatted as JSON if applicable.
 *
 * @example
 * bunnyLog('info', 'This is an informational message.');
 * bunnyLog('error', 'An error occurred:', new Error('Sample error'));
 * bunnyLog('object', { key: 'value', anotherKey: 42 });
 */
export declare function bunnyLog(
	category: LogCategory,
	...args: unknown[]
): void
