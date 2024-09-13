import chalk from 'chalk'
import { colorize, colorizeJson } from './colorizeJson'
import stripAnsi from 'strip-ansi'

/**
 * Pads a cell content to the specified width, accounting for ANSI color codes.
 *
 * @param {string} content - The content to pad.
 * @param {number} width - The target width for the cell.
 * @returns {string} - The padded content.
 */
const padCell = (content, width) => {
	const visibleLength = stripAnsi(content).length
	const padding = ' '.repeat(width - visibleLength)
	return content + padding
}

/**
 * Custom table logging function with type-based coloring.
 *
 * @param {Array} data - The data to be logged in table format.
 * @param {Object} [options] - Optional configuration for the table.
 * @param {boolean} [options.header=true] - Indicates if the table should have a header.
 * @param {Array} [options.columns] - Specifies the columns to include in the table.
 */
const bunnyTable = (data, options = {}) => {
	const defaultOptions = {
		header: true,
		columns: Object.keys(data[0]),
	}
	const mergedOptions = { ...defaultOptions, ...options }

	const TOP_LEFT = '┌'
	const TOP_RIGHT = '┐'
	const BOTTOM_LEFT = '└'
	const BOTTOM_RIGHT = '┘'
	const HORIZONTAL = '─'
	const VERTICAL = '│'
	const T_JUNCTION_DOWN = '┬'
	const T_JUNCTION_UP = '┴'
	const T_JUNCTION_LEFT = '├'
	const T_JUNCTION_RIGHT = '┤'
	const CROSS = '┼'

	// Calculate column widths accounting for color codes
	const widths = mergedOptions.columns.map((col) =>
		Math.max(
			stripAnsi(chalk.bold(col)).length,
			...data.map((row) => {
				const cell = row[col]
				let cellContent = ''
				if (typeof cell === 'object' && cell !== null) {
					cellContent = colorizeJson(cell, 0)
				} else if (cell === null) {
					cellContent = colorize('null', 'null')
				} else if (cell === undefined) {
					cellContent = colorize('undefined', 'undefined')
				} else {
					cellContent = colorize(typeof cell, cell)
				}
				return stripAnsi(cellContent).length
			})
		)
	)

	// Build top border
	const topBorder = `${TOP_LEFT}${widths
		.map(
			(w, i) =>
				`${HORIZONTAL.repeat(w + 2)}${i < widths.length - 1 ? T_JUNCTION_DOWN : ''}`
		)
		.join('')}${TOP_RIGHT}`

	// Build header
	let header = ''
	if (mergedOptions.header) {
		const headerContent = `${VERTICAL}${mergedOptions.columns
			.map((col, i) => {
				const paddedHeader = padCell(chalk.bold(col), widths[i])
				return ` ${paddedHeader} ${VERTICAL}`
			})
			.join('')}`

		const headerSeparator = `${T_JUNCTION_LEFT}${widths
			.map(
				(w, i) =>
					`${HORIZONTAL.repeat(w + 2)}${i < widths.length - 1 ? CROSS : ''}`
			)
			.join('')}${T_JUNCTION_RIGHT}`

		header = `${headerContent}\n${headerSeparator}`
	}

	// Build rows with colorized cell content
	const rows = data
		.map((row) => {
			return `${VERTICAL}${mergedOptions.columns
				.map((col, i) => {
					const cell = row[col]
					let cellContent = ''
					if (typeof cell === 'object' && cell !== null) {
						cellContent = colorizeJson(cell, 0)
					} else if (cell === null) {
						cellContent = colorize('null', 'null')
					} else if (cell === undefined) {
						cellContent = colorize('undefined', 'undefined')
					} else {
						cellContent = colorize(typeof cell, cell)
					}
					const paddedCell = padCell(cellContent, widths[i])
					return ` ${paddedCell} ${VERTICAL}`
				})
				.join('')}`
		})
		.join('\n')

	// Build bottom border
	const bottomBorder = `${BOTTOM_LEFT}${widths
		.map(
			(w, i) =>
				`${HORIZONTAL.repeat(w + 2)}${i < widths.length - 1 ? T_JUNCTION_UP : ''}`
		)
		.join('')}${BOTTOM_RIGHT}`

	// Combine all parts
	const tableString = `${topBorder}\n${header}\n${rows}\n${bottomBorder}`

	return tableString
}

export { bunnyTable }
