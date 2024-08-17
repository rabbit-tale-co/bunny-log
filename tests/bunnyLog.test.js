import stripAnsi from "strip-ansi";
import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import { bunnyLog } from "../src/bunnyLog";
import chalk from "chalk";

describe("bunnyLog", () => {
	let consoleSpy;
	let errorSpy;

	beforeEach(() => {
		consoleSpy = spyOn(console, "log").mockImplementation((message) => {
			process.stdout.write(`Logged message: ${message}\n`);
		});
		errorSpy = spyOn(console, "error").mockImplementation((message) => {
			process.stdout.write(`Logged error: ${message}\n`);
		});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
		errorSpy.mockRestore();
	});

	it("should log server message correctly", () => {
		bunnyLog.server("Test server log");
		// bunnyLog('server', 'Test server log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("SERVER");
	});

	it("should log info message correctly", () => {
		bunnyLog.info("Test info log");
		// bunnyLog('info', 'Test info log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("INFO");
	});

	it("should log error message correctly", () => {
		bunnyLog.error(new Error("Test error log"));
		// bunnyLog('error', new Error('Test error log'))

		const actualLogOutput = stripAnsi(errorSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("ERROR");
	});

	it("should log success message correctly", () => {
		bunnyLog.success("Test success log");
		// bunnyLog('success', 'Test success log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("SUCCESS");
	});

	it("should log API message correctly", () => {
		bunnyLog.api("Test api log");
		// bunnyLog('api', 'Test api log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("API");
	});

	it("should log database message correctly", () => {
		bunnyLog.database("Test database log");
		// bunnyLog('database', 'Test database log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("DATABASE");
	});

	it("should log warn message correctly", () => {
		bunnyLog.warn("Test warning log");
		// bunnyLog('warning', 'Test warning log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("WARN");
	});

	it("should log custom category correctly", () => {
		bunnyLog.addCategory("debug", chalk.hex("#dc23da"));

		bunnyLog.debug("Test debug log");

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("DEBUG");
	});

	it("should log object message correctly", () => {
		bunnyLog.info({
			string: "value",
			number: 42,
			boolean: true,
			data: null,
			object: {
				string: "value",
				boolean: true,
				number: 42,
				data: null,
			},
			array: [1, 2, 3],
			emptyObject: {},
			emptyArray: [],
		});
		// bunnyLog('object', {
		// 	string: 'value',
		// 	number: 42,
		// 	boolean: true,
		// 	data: null,
		// 	object: {
		// 		string: 'value',
		// 		boolean: true,
		// 		number: 42,
		// 		data: null,
		// 	},
		// 	array: [1, 2, 3],
		// 	emptyObject: {},
		// 	emptyArray: [],
		// })

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0]);
		expect(actualLogOutput).toContain("INFO");
	});
});
