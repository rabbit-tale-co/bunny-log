import chalk from "chalk";
import { colorizeJson } from "./utils/colorizeJson.js";
import { categoryColors } from "./config/colors.js";

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
	const color = categoryColors.get(category) || chalk.white;

	const formattedMessage = args
		.map((arg) => {
			if (typeof arg === "object" && arg !== null) {
				return colorizeJson(arg);
			}
			return String(arg);
		})
		.join(" ");

	const actionMap = {
		server: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		database: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		error: () => console.error(new Error(formattedMessage)),
		info: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		success: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		warning: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		api: () =>
			console.log(
				`${chalk.bold(`[${category.toUpperCase()}]`)} - ${color(formattedMessage)}`,
			),
		object: () => console.log(formattedMessage),
	};

	const action = actionMap[category];
	if (!action)
		return console.log(
			`${chalk.bold("[UNKNOWN]")} - ${chalk.white(formattedMessage)}`,
		);
	action();
}
