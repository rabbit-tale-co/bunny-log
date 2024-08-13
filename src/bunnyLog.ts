import chalk from 'chalk'
import type { JsonObject, LogCategory } from './types/bunnyLog'
import { colorizeJson } from './utils/colorizeJson'
import { categoryColors } from './config/colors'

// Define a custom log function for categorized logs
const bunnyLog = (category: LogCategory, ...args: unknown[]) => {
	const color = categoryColors.get(category) || chalk.white

	const formattedMessage = args
		.map((arg) => {
			if (typeof arg === 'object' && arg !== null) {
				return colorizeJson(arg as JsonObject)
			}
			return String(arg)
		})
		.join(' ')

	const actionMap: Record<LogCategory, () => void> = {
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
	}

	const action = actionMap[category]
	if (!action)
		return console.log(
			`${chalk.bold('[UNKNOWN]')} - ${chalk.white(formattedMessage)}`,
		)
	action()
}

export { bunnyLog }
