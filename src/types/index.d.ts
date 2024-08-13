type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
	[key: string]: JsonValue;
}
type JsonArray = JsonValue[];

type LogCategory =
	| "server"
	| "database"
	| "api"
	| "error"
	| "info"
	| "success"
	| "warning"
	| "object";

declare function bunnyLog(category: LogCategory, ...args: unknown[]): void;

export {
	bunnyLog,
	type LogCategory,
	type JsonValue,
	type JsonObject,
	type JsonArray,
};
