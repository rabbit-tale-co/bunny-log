import chalk from "chalk";
import { colorizeJson } from "./utils/colorizeJson";
import { categoryColors } from "./config/colors";

function log(category, ...args) {
	const color = categoryColors.get(category) || chalk.white;

	const now = new Date();
	const formattedTime = chalk.gray(
		`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`,
	);

	const formattedMessage = args
		.map((arg) => {
			if (arg instanceof Error) {
				// Extract the message and handle custom error properties if needed
				return arg.message;
			}
			if (typeof arg === "object" && arg !== null) {
				return colorizeJson(arg);
			}
			return String(arg);
		})
		.join(" ");

	const logMethod = category === "error" ? console.error : console.log;

	logMethod(
		`${formattedTime} | [${color(category.toUpperCase())}] - ${color(formattedMessage)}`,
	);
}

/**
 * Logger object that provides methods for each log category.
 */
export const bunnyLog = {
	server: (...args) => log("server", ...args),
	database: (...args) => log("database", ...args),
	error: (...args) => log("error", ...args),
	info: (...args) => log("info", ...args),
	success: (...args) => log("success", ...args),
	warning: (...args) => log("warning", ...args),
	api: (...args) => log("api", ...args),
	object: (...args) => log("object", ...args),
};
