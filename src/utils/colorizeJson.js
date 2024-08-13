import chalk from "chalk";

const typeColors = new Map([
	["string", chalk.green],
	["number", chalk.yellow],
	["boolean", chalk.blue],
	["null", chalk.red],
	["object", chalk.magenta],
	["array", chalk.white],
]);

export function colorizeJson(json, indentLevel = 0) {
	const indent = "  ".repeat(indentLevel);

	if (json === null) {
		return typeColors.get("null")("null");
	}
	if (Array.isArray(json)) {
		const color = typeColors.get("array");
		return color(
			`[\n${json
				.map((item) => `${indent}  ${colorizeJson(item, indentLevel + 1)}`)
				.join(",\n")}\n${indent}]`,
		);
	}
	if (typeof json === "object") {
		const keys = Object.keys(json);
		return `{\n${keys
			.map((key) => {
				const value = json[key];
				const formattedValue =
					typeof value === "string"
						? `"${typeColors.get("string")(value)}"`
						: colorizeJson(value, indentLevel + 1);
				return `${indent}  ${chalk.gray(`${key}`)}: ${formattedValue}`;
			})
			.join(",\n")}\n${indent}}`;
	}
	if (typeof json === "string") {
		const color = typeColors.get("string");
		return color(json.toString());
	}
	if (typeof json === "number") {
		const color = typeColors.get("number");
		return color(json.toString());
	}
	if (typeof json === "boolean") {
		const color = typeColors.get("boolean");
		return color(json.toString());
	}
	return String(json);
}
