import chalk from 'chalk'
import { colorizeJson } from './utils/colorizeJson.js'
import { categoryColors } from './config/colors.js'
import { bunnyTable } from './utils/table.js'

function log(category, ...args) {
	const color = categoryColors.get(category) || chalk.white

	const now = new Date()
	const formattedTime = chalk.gray(
		`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
	)

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

	const logMethod = category === 'error' ? console.error : console.log

	// Always start message on new line
	logMethod(
		`${formattedTime} | [${color(category.toUpperCase())}] -\n${color(formattedMessage)}`
	)
}

/**
 * Logger object that provides methods for each log category.
 */
export const bunnyLog = {
	server: (...args) => log('server', ...args),
	database: (...args) => log('database', ...args),
	error: (...args) => log('error', ...args),
	info: (...args) => log('info', ...args),
	success: (...args) => log('success', ...args),
	warn: (...args) => log('warn', ...args),
	api: (...args) => log('api', ...args),

	// Dynamic method to add new logging category
	addCategory: (category, color) => {
		categoryColors.set(category, color)
		bunnyLog[category] = (...args) => log(category, ...args)
	},

	// Method to log data in a table format
	table: (data, options = {}) => log('table', bunnyTable(data, options)),
}
