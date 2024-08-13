import chalk from "chalk";

export const categoryColors = new Map([
	["server", chalk.green],
	["database", chalk.yellow],
	["error", chalk.red],
	["info", chalk.blue],
	["success", chalk.greenBright],
	["warning", chalk.yellowBright],
	["api", chalk.magenta],
]);
