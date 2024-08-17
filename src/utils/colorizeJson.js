import chalk from 'chalk'
import { bunnyLog } from '../bunnyLog'

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
	['array', chalk.white],
	['key', chalk.gray],
	['brackets', chalk.white],
])

/**
 * Recursively colorizes a JSON object for console output, formatting strings, numbers, booleans, nulls,
 * objects, and arrays with specific colors.
 *
 * - Strings are green.
 * - Numbers are yellow.
 * - Booleans are blue.
 * - Null values are red.
 * - Objects are magenta.
 * - Arrays are white.
 *
 * Arrays with 3 or fewer elements are displayed in a single line. Longer arrays are displayed
 * across multiple lines with indentation.
 *
 * @param {any} json - The JSON data to be colorized. Can be of type string, number, boolean, null, array, or object.
 * @param {number} [indentLevel=0] - The current level of indentation, used for formatting nested objects and arrays.
 * @returns {string} - A colorized and formatted string representation of the input JSON.
 *
 * @example
 * const data = { name: "Alice", age: 30, isAdmin: true, preferences: { theme: "dark" } };
 * console.log(colorizeJson(data));
 */
export function colorizeJson(json, indentLevel = 0) {
	const indent = '  '.repeat(indentLevel) // Create indentation based on the current level

	/**
	 * Helper function to apply color based on the type.
	 *
	 * @param {string} type - The type of the value (e.g., "string", "number").
	 * @param {any} value - The value to be colorized.
	 * @returns {string} - The colorized string representation of the value.
	 */
	const colorize = (type, value) => {
		// Ensure value is not undefined or null before converting to string
		if (value === undefined || value === null) return String(value)

		const colorFn = typeColors.get(type)

		try {
			return colorFn ? colorFn(value.toString()) : value.toString()
		} catch {
			bunnyLog.error('Error colorizing value:', value)
			return String(value)
		}
	}

	if (json === undefined) {
		return colorize('undefined', 'undefined')
	}

	// Handle null values explicitly
	if (json === null) {
		return colorize('null', 'null')
	}

	// Handle arrays
	if (Array.isArray(json)) {
		const color = typeColors.get('array')
		if (json.length < 4) {
			// Display array in a single line if it has 3 or fewer elements
			const items = json.map((item) => colorizeJson(item, 0)).join(', ')
			return `${color(`[${items}]`)}`
		}
		// Display array with wrapping if it has 4 or more elements
		const items = json
			.map((item) => `${indent}  ${colorizeJson(item, indentLevel + 1)}`)
			.join(',\n')
		return `${color(`[\n${items}\n${indent}]`)}`
	}

	// Handle objects
	if (typeof json === 'object') {
		const keys = Object.keys(json)
		const color = typeColors.get('brackets')
		if (keys.length === 0) {
			// Handle empty objects to prevent wrapping
			return color('{}')
		}
		if (keys.length < 4) {
			// Display object in a single line if it has 3 or fewer properties
			const entries = keys
				.map((key) => {
					const value = json[key]
					const formattedValue =
						typeof value === 'string'
							? `"${colorize('string', value)}"`
							: colorizeJson(value, 0)
					return `${colorize('key', key)}: ${formattedValue}`
				})
				.join(', ')
			return color(`{ ${entries} }`)
		}
		// Display object with wrapping if it has 4 or more properties
		const entries = keys
			.map((key) => {
				const value = json[key]
				const formattedValue =
					typeof value === 'string'
						? `"${colorize('string', value)}"`
						: colorizeJson(value, indentLevel + 1)
				return `${indent}  ${colorize('key', key)}: ${formattedValue}`
			})
			.join(',\n')
		return color(`{\n${entries}\n${indent}}`)
	}

	// Handle primitive types (string, number, boolean)
	const type = typeof json
	return colorize(type, json) // Apply color to the primitive value
}
