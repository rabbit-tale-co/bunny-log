type JsonValue = string | number | boolean | null | JsonObject | JsonArray
interface JsonObject {
	[key: string]: JsonValue
}
type JsonArray = JsonValue[]

type LogCategory =
	| 'server'
	| 'database'
	| 'api'
	| 'error'
	| 'info'
	| 'success'
	| 'warning'
	| 'object'

export type { LogCategory, JsonValue, JsonObject, JsonArray }
