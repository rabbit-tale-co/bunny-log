import { describe, it, expect, beforeEach, afterEach, spyOn } from "bun:test";
import { bunnyLog } from "../src/bunnyLog.js";

describe("bunnyLog", () => {
	let consoleSpy;

	beforeEach(() => {
		consoleSpy = spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		consoleSpy.mockRestore();
	});

	it("should log server message correctly", () => {
		bunnyLog("server", "Test server log");
		expect(consoleSpy).toHaveBeenCalled();
	});

	// Additional tests for other categories...
});
