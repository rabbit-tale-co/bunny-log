import chalk from "chalk";
import { colorizeJson } from "./utils/colorizeJson.js";
import { categoryColors } from "./config/colors.js";

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
