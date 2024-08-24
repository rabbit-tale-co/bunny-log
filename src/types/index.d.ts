import chalk from "chalk";

/**
 * Represents a valid JSON value, which can be a string, number, boolean, null, object, or array.
 * This type is useful for ensuring that only valid JSON-compatible values are used.
 */
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;

/**
 * Represents a JSON object, where each key is a string and the value is a valid JSON value.
 */
interface JsonObject {
	[key: string]: JsonValue;
}

/**
 * Represents a JSON array, which is an array of valid JSON values.
 */
type JsonArray = JsonValue[];

/**
 * Represents the different categories of logs that can be used with the `bunnyLog` function.
 * These categories help to differentiate the types of logs and apply specific formatting or colors.
 */
type LogCategory =
	| "server"
	| "database"
	| "api"
	| "error"
	| "info"
	| "success"
	| "warn";

/**
 * Represents the structure of the logging function for a single category.
 */
type LogFunction = (...args: (string | JsonObject | Error | object)[]) => void;

/**
 * Logs a message to the console for a specific category.
 *
 * Each category method (e.g., bunnyLog.server, bunnyLog.error) accepts multiple arguments,
 * which can be strings, objects, or errors, and logs them with appropriate formatting.
 */
interface BunnyLog {
	server: (...args: (string | JsonObject | Error | object)[]) => void;
	database: (...args: (string | JsonObject | Error | object)[]) => void;
	api: (...args: (string | JsonObject | Error | object)[]) => void;
	error: (...args: (string | JsonObject | Error | object)[]) => void;
	info: (...args: (string | JsonObject | Error | object)[]) => void;
	success: (...args: (string | JsonObject | Error | object)[]) => void;
	warn: (...args: (string | JsonObject | Error | object)[]) => void;

	// Method to add a new category dynamically
	addCategory: (category: string, color: ReturnType<typeof chalk>) => void;

	// Dynamic categories
	[key: string]:
		| LogFunction
		| ((category: string, color: ReturnType<typeof chalk>) => void);
}

export declare const bunnyLog: BunnyLog;
