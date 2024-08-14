import chalk from "chalk";

/**
 * A map that associates logging categories with corresponding chalk color functions for console output.
 * This map is used to apply specific colors to log messages based on their category.
 *
 * @type {Map<string, Function>}
 *
 * @example
 * const color = categoryColors.get('error');
 * console.log(color('This is an error message.'));
 */
export const categoryColors = new Map([
	["server", chalk.green],
	["database", chalk.yellow],
	["error", chalk.red],
	["info", chalk.blue],
	["success", chalk.greenBright],
	["warning", chalk.hex("#F8A85E")],
	["api", chalk.magenta],
]);
