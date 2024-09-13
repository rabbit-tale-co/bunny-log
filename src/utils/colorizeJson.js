import chalk from 'chalk'

/**
 * A map that associates JavaScript data types with corresponding chalk color functions for console output.
 *
 * @type {Map<string, Function>}
 */
const typeColors = new Map([
	['string', chalk.green],
	['number', chalk.yellow],
	['boolean', chalk.blue],
	['null', chalk.red],
	['undefined', chalk.red],
	['object', chalk.magenta],
	['array', chalk.cyan],
	['key', chalk.gray.bold],
	['brackets', chalk.white],
	['special', chalk.gray],
])

/**
 * Helper function to apply color based on the type.
 *
 * @param {string} type - The type of the value (e.g., "string", "number").
 * @param {any} value - The value to be colorized.
 * @returns {string} - The colorized string representation of the value.
 */
const colorize = (type, value) => {
	const colorFn = typeColors.get(type)
	if (colorFn) {
		return colorFn(String(value))
	}
	return String(value)
}

/**
 * Recursively colorizes a JSON object for console output, formatting strings, numbers, booleans, nulls,
 * objects, and arrays with specific colors.
 *
 * @param {any} json - The JSON data to be colorized. Can be of type string, number, boolean, null, array, or object.
 * @param {number} [indentLevel=0] - The current level of indentation, used for formatting nested objects and arrays.
 * @returns {string} - A colorized and formatted string representation of the input JSON.
 */
function colorizeJson(json, indentLevel = 0) {
	const indent = '  '.repeat(indentLevel) // Create indentation based on the current level

	/**
	 * Helper function to apply color based on the type.
	 *
	 * @param {string} type - The type of the value (e.g., "string", "number").
	 * @param {any} value - The value to be colorized.
	 * @returns {string} - The colorized string representation of the value.
	 */
	const colorize = (type, value) => {
		const colorFn = typeColors.get(type)
		if (colorFn) {
			return colorFn(String(value))
		}
		return String(value)
	}

	if (json === null) {
		return colorize('null', 'null')
	}

	if (json === undefined) {
		return colorize('undefined', 'undefined')
	}

	if (typeof json === 'string') {
		return colorize('string', `"${json}"`)
	}

	if (typeof json === 'number' || typeof json === 'bigint') {
		return colorize('number', json)
	}

	if (typeof json === 'boolean') {
		return colorize('boolean', json)
	}

	// Handle arrays
	if (Array.isArray(json)) {
		const color = typeColors.get('brackets')
		if (json.length === 0) {
			return color('[]')
		}

		// Decide whether to inline or expand the array based on its length
		const shouldInline = json.length <= 3
		if (shouldInline) {
			const items = json
				.map((item) => colorizeJson(item, 0))
				.join(`${color(', ')} `)
			return `${color('[')}${items}${color(']')}`
		}
		const items = json
			.map((item) => `${indent}  ${colorizeJson(item, indentLevel + 1)}`)
			.join(`${color(',\n')}`)
		return `${color('[\n')}${items}\n${indent}${color(']')}`
	}

	// Handle objects
	if (typeof json === 'object') {
		const color = typeColors.get('brackets')
		const keys = Object.keys(json)
		if (keys.length === 0) {
			return color('{}')
		}

		// Decide whether to inline or expand the object based on its property count
		const shouldInline = keys.length <= 3
		if (shouldInline) {
			const entries = keys
				.map((key) => {
					const value = json[key]
					const formattedKey = colorize('key', `"${key}"`)
					const formattedValue = colorizeJson(value, 0)
					return `${formattedKey}${color(':')} ${formattedValue}`
				})
				.join(`${color(', ')} `)
			return `${color('{')} ${entries} ${color('}')}`
		}
		const entries = keys
			.map((key) => {
				const value = json[key]
				const formattedKey = colorize('key', `"${key}"`)
				const formattedValue = colorizeJson(value, indentLevel + 1)
				return `${indent}  ${formattedKey}${color(':')} ${formattedValue}`
			})
			.join(`${color(',\n')}`)
		return `${color('{\n')}${entries}\n${indent}${color('}')}`
	}

	// For any other types (e.g., functions, symbols), return their string representation
	return colorize('special', String(json))
}

export { colorizeJson, colorize }
