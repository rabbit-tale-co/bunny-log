import chalk from 'chalk'
import { colorizeJson } from './utils/colorizeJson'
import { categoryColors } from './config/colors'

/**
 * Logs a message to the console with a specified category and optional color formatting.
 *
 * @param {string} category - The category of the log message. Determines the log type and color.
 *                            Supported categories: 'server', 'database', 'error', 'info',
 *                            'success', 'warning', 'api', 'object'.
 * @param {...any} args - The messages or objects to be logged. Multiple arguments are allowed.
 *                        Objects will be formatted as JSON.
 *
 * @returns {void} This function does not return any value.
 *
 * @example
 * bunnyLog('info', 'This is an informational message.');
 * bunnyLog('error', 'An error occurred:', new Error('Sample error'));
 * bunnyLog('object', { key: 'value', anotherKey: 42 });
 */
export function bunnyLog(category, ...args) {
	const color = categoryColors.get(category) || chalk.white

	const formattedMessage = args
		.map((arg) => {
			if (arg instanceof Error) {
				return arg.message
			}
			if (typeof arg === 'object' && arg !== null) {
				return colorizeJson(arg)
			}
			return String(arg)
		})
		.join(' ')

	const logWithFormat = (label, message) =>
		console.log(`${`[${color(label.toUpperCase())}]`} - ${color(message)}`)

	const actionMap = {
		server: logWithFormat,
		database: logWithFormat,
		info: logWithFormat,
		success: logWithFormat,
		warning: logWithFormat,
		api: logWithFormat,
		object: (_, message) => console.log(message),
		error: (_, message) =>
			console.error(
				`${`[${color(category.toUpperCase())}]`} - ${color(message)}`,
			),
	}

	const action = actionMap[category] || logWithFormat
	action(category, formattedMessage)
}
