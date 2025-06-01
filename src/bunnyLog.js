// BunnyLog - Class-based Console Logging Package with Colors

import chalk from "chalk";

/**
 * BunnyLogger - Class-based Console Logging Package with Auto-Categories
 */
export class BunnyLogger {
	constructor(defaultCategories = true) {
		// Map of log categories to their respective chalk color functions
		this.categoryColors = new Map();

		// Time format configuration (12h or 24h)
		this.timeFormat = '24h'; // default to 24-hour format

		// Seconds display configuration
		this.showSeconds = true; // default to showing seconds

		// Initialize default categories if requested
		if (defaultCategories) {
			this.categoryColors.set("server", chalk.green);
			this.categoryColors.set("database", chalk.yellow);
			this.categoryColors.set("error", chalk.red);
			this.categoryColors.set("info", chalk.blue);
			this.categoryColors.set("success", chalk.greenBright);
			this.categoryColors.set("warn", chalk.hex("#F8A85E"));
			this.categoryColors.set("api", chalk.magenta);
		}

		// Initialize default logging methods
		this.initializeDefaultMethods();

		// Return a Proxy to intercept property access
		return new Proxy(this, {
			get(target, prop) {
				// If property exists, return it
				if (prop in target || typeof prop === 'symbol') {
					return target[prop];
				}

				// If it's a string and looks like a logging method, create it
				if (typeof prop === 'string') {
					// Auto-create category if it doesn't exist
					if (!target.categoryColors.has(prop)) {
						target.categoryColors.set(prop, chalk.white);
					}

					// Return logging function for this category
					return (...args) => target.log(prop, ...args);
				}

				return target[prop];
			}
		});
	}

	/**
	 * Initialize default logging methods
	 */
	initializeDefaultMethods() {
		const categories = Array.from(this.categoryColors.keys());
		categories.forEach(category => {
			this[category] = (...args) => this.log(category, ...args);
		});
	}

	/**
	 * Get formatted timestamp based on current time format setting
	 */
	getTimestamp() {
		const use12Hour = this.timeFormat === '12h';
		const timeOptions = {
			hour12: use12Hour,
			hour: '2-digit',
			minute: '2-digit'
		};

		// Add seconds if enabled
		if (this.showSeconds) {
			timeOptions.second = '2-digit';
		}

		return chalk.gray(new Date().toLocaleTimeString("en-US", timeOptions));
	}

	/**
	 * Main logging function with colors
	 */
	log(category, ...args) {
		const color = this.categoryColors.get(category) || chalk.white;
		const timestamp = this.getTimestamp();

		const formattedMessage = args
			.map((arg) => {
				if (arg instanceof Error) {
					return chalk.red(arg.message);
				} else if (typeof arg === "object") {
					return this.colorizeJson(arg);
				} else {
					return String(arg);
				}
			})
			.join(" ");

		const logMessage = `${timestamp} | [${color(category.toUpperCase())}] - ${formattedMessage}`;

		// Use appropriate console method based on category
		switch (category) {
			case "error":
				console.error(logMessage);
				break;
			case "warn":
				console.warn(logMessage);
				break;
			case "info":
				console.info(logMessage);
				break;
			case "table":
				console.log(`${timestamp} | [${color(category.toUpperCase())}] -`);
				console.table(args[0]);
				break;
			default:
				console.log(logMessage);
				break;
		}
	}

	/**
	 * Set time format for timestamps
	 * @param {string} format - Either '12h' or '24h'
	 */
	setTimeFormat(format) {
		if (format === '12h' || format === '24h') {
			this.timeFormat = format;
		} else {
			throw new Error("Time format must be '12h' or '24h'");
		}
		return this;
	}

	/**
	 * Get current time format
	 */
	getTimeFormat() {
		return this.timeFormat;
	}

	/**
	 * Set to 12-hour format (convenience method)
	 */
	use12HourFormat() {
		this.timeFormat = '12h';
		return this;
	}

	/**
	 * Set to 24-hour format (convenience method)
	 */
	use24HourFormat() {
		this.timeFormat = '24h';
		return this;
	}

	/**
	 * Set whether to show seconds in timestamps
	 * @param {boolean} show - Whether to show seconds
	 */
	setShowSeconds(show) {
		this.showSeconds = Boolean(show);
		return this;
	}

	/**
	 * Get current seconds display setting
	 */
	getShowSeconds() {
		return this.showSeconds;
	}

	/**
	 * Show seconds in timestamps (convenience method)
	 */
	showSecondsInTime() {
		this.showSeconds = true;
		return this;
	}

	/**
	 * Hide seconds in timestamps (convenience method)
	 */
	hideSecondsInTime() {
		this.showSeconds = false;
		return this;
	}

	/**
	 * Colorize JSON objects for pretty output
	 */
	colorizeJson(obj, indent = 0) {
		if (obj === null) return chalk.red("null");
		if (obj === undefined) return chalk.red("undefined");
		if (typeof obj === "string") return chalk.green(`"${obj}"`);
		if (typeof obj === "number") return chalk.yellow(obj);
		if (typeof obj === "boolean") return chalk.blue(obj);

		const indentStr = "  ".repeat(indent);

		if (Array.isArray(obj)) {
			if (obj.length === 0) return chalk.white("[]");
			const items = obj.map(item => this.colorizeJson(item, indent + 1));
			return `${chalk.white("[\n")}${items.map(item => `${indentStr}  ${item}`).join(chalk.white(",\n"))}\n${indentStr}${chalk.white("]")}`;
		}

		if (typeof obj === "object") {
			const keys = Object.keys(obj);
			if (keys.length === 0) return chalk.white("{}");

			const entries = keys.map(key => {
				const value = obj[key];
				const formattedKey = chalk.cyan(`"${key}"`);
				const formattedValue = this.colorizeJson(value, indent + 1);
				return `${indentStr}  ${formattedKey}${chalk.white(":")} ${formattedValue}`;
			});

			return `${chalk.white("{\n")}${entries.join(chalk.white(",\n"))}\n${indentStr}${chalk.white("}")}`;
		}

		return chalk.gray(String(obj));
	}

	/**
	 * Add a new logging category with chalk color or hex
	 */
	addCategory(category, color = chalk.white) {
		this.categoryColors.set(category, color);
		this[category] = (...args) => this.log(category, ...args);
		return this;
	}

	/**
	 * Add category with hex color (easier syntax)
	 */
	hex(category, hexColor) {
		this.categoryColors.set(category, chalk.hex(hexColor));
		this[category] = (...args) => this.log(category, ...args);
		return this;
	}

	/**
	 * Add category with RGB color
	 */
	rgb(category, r, g, b) {
		this.categoryColors.set(category, chalk.rgb(r, g, b));
		this[category] = (...args) => this.log(category, ...args);
		return this;
	}

	/**
	 * Table logging using console.table with optional column filtering
	 */
	table(data, options = {}) {
		let tableData = data;

		if (options.columns && Array.isArray(options.columns)) {
			tableData = data.map(row => {
				const filtered = {};
				options.columns.forEach(col => {
					if (row.hasOwnProperty(col)) {
						filtered[col] = row[col];
					}
				});
				return filtered;
			});
		}

		this.log("table", tableData);
	}

	/**
	 * Get available categories
	 */
	getCategories() {
		return Array.from(this.categoryColors.keys());
	}

	/**
	 * Set color for existing category
	 */
	setColor(category, color) {
		if (this.categoryColors.has(category)) {
			this.categoryColors.set(category, color);
		}
		return this;
	}

	/**
	 * Set hex color for existing category
	 */
	setHex(category, hexColor) {
		if (this.categoryColors.has(category)) {
			this.categoryColors.set(category, chalk.hex(hexColor));
		}
		return this;
	}

	/**
	 * Remove category
	 */
	removeCategory(category) {
		this.categoryColors.delete(category);
		delete this[category];
		return this;
	}

	/**
	 * Create a clean instance with no default categories
	 */
	static clean() {
		return new BunnyLogger(false);
	}
}

// Export singleton instance with default categories
export const bunnyLog = new BunnyLogger();
