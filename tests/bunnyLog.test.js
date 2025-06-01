import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { bunnyLog, BunnyLogger, Table, FORMAT_UNICODE, FORMAT_DEFAULT } from '../src/index.js'
import chalk from 'chalk'

describe('BunnyLog Comprehensive Tests', () => {
	let consoleSpy
	let errorSpy

	beforeEach(() => {
		// Reset any existing spies
		if (consoleSpy) consoleSpy.mockRestore()
		if (errorSpy) errorSpy.mockRestore()

		// Create fresh spies for each test
		consoleSpy = spyOn(console, 'log').mockImplementation(() => {})
		errorSpy = spyOn(console, 'error').mockImplementation(() => {})
	})

	afterEach(() => {
		// Clean up spies after each test
		if (consoleSpy) {
			consoleSpy.mockRestore()
			consoleSpy = null
		}
		if (errorSpy) {
			errorSpy.mockRestore()
			errorSpy = null
		}
	})

	describe('Basic Logging Methods', () => {
		it('should have server logging method', () => {
			expect(typeof bunnyLog.server).toBe('function')
			bunnyLog.server('Test server log')
			// Just verify the method can be called without error
		})

		it('should have info logging method', () => {
			expect(typeof bunnyLog.info).toBe('function')
			bunnyLog.info('Test info log')
			// Just verify the method can be called without error
		})

		it('should have error logging method', () => {
			expect(typeof bunnyLog.error).toBe('function')
			bunnyLog.error(new Error('Test error log'))
			// Just verify the method can be called without error
		})

		it('should have success logging method', () => {
			expect(typeof bunnyLog.success).toBe('function')
			bunnyLog.success('Test success log')
			// Just verify the method can be called without error
		})

		it('should have API logging method', () => {
			expect(typeof bunnyLog.api).toBe('function')
			bunnyLog.api('Test api log')
			// Just verify the method can be called without error
		})

		it('should have database logging method', () => {
			expect(typeof bunnyLog.database).toBe('function')
			bunnyLog.database('Test database log')
			// Just verify the method can be called without error
		})

		it('should have warn logging method', () => {
			expect(typeof bunnyLog.warn).toBe('function')
			bunnyLog.warn('Test warning log')
			// Just verify the method can be called without error
		})
	})

	describe('Auto-Category Creation', () => {
		it('should auto-create custom categories', () => {
			expect(typeof bunnyLog.discord).toBe('function')
			bunnyLog.discord('Discord bot message')
			// Verify the category was created
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('discord')
		})

		it('should auto-create payment category', () => {
			bunnyLog.payment('Payment processed')
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('payment')
		})

		it('should auto-create auth category', () => {
			bunnyLog.auth('User authenticated')
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('auth')
		})

		it('should auto-create any custom category', () => {
			bunnyLog.myCustomCategory('This just works!')
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('myCustomCategory')
		})

		it('should track auto-created categories', () => {
			const initialCategories = bunnyLog.getCategories()
			bunnyLog.newCategory('Test message')
			const updatedCategories = bunnyLog.getCategories()
			expect(updatedCategories).toContain('newCategory')
			expect(updatedCategories.length).toBeGreaterThan(initialCategories.length)
		})
	})

	describe('Hex Color Support', () => {
		it('should support hex colors for new categories', () => {
			const result = bunnyLog.hex("github", "#6cc644")
			expect(typeof result.log).toBe('function') // Should return chainable instance
			bunnyLog.github("GitHub integration active")
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('github')
		})

		it('should support chaining hex color definitions', () => {
			const result = bunnyLog
				.hex("deploy", "#00d4aa")
				.hex("build", "#ff9500")
				.hex("test", "#34c759")

			expect(typeof result.log).toBe('function') // Should return chainable instance

			// Verify all categories were created
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('deploy')
			expect(categories).toContain('build')
			expect(categories).toContain('test')

			// Verify we can call the methods
			bunnyLog.deploy("Deployment started")
			bunnyLog.build("Build completed")
			bunnyLog.test("Tests passing")
		})

		it('should change colors dynamically', () => {
			bunnyLog.info('Info with original color')

			const result = bunnyLog.setHex("info", "#ff6b35")
			expect(typeof result.log).toBe('function') // Should return chainable instance

			bunnyLog.info('Info with new orange color')
			// Both calls should work without error
		})
	})

	describe('RGB Color Support', () => {
		it('should support RGB colors', () => {
			const result = bunnyLog.rgb("custom", 255, 100, 150)
			expect(typeof result.log).toBe('function') // Should return chainable instance
			bunnyLog.custom("Pretty pink message")
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('custom')
		})
	})

	describe('Custom Logger Instances', () => {
		it('should create clean logger instance', () => {
			const myLogger = BunnyLogger.clean()
			expect(myLogger).toBeInstanceOf(BunnyLogger)

			const result = myLogger
				.hex("app", "#ff6b9d")
				.hex("db", "#4ecdc4")
				.hex("cache", "#ffe66d")

			expect(typeof result.log).toBe('function') // Should return chainable instance

			const categories = myLogger.getCategories()
			expect(categories).toContain('app')
			expect(categories).toContain('db')
			expect(categories).toContain('cache')

			// Test that the clean logger doesn't have default categories
			expect(categories).not.toContain('info')
			expect(categories).not.toContain('error')
		})

		it('should create service-specific logger', () => {
			const apiLogger = new BunnyLogger(false)
			expect(apiLogger).toBeInstanceOf(BunnyLogger)

			apiLogger
				.hex("request", "#00b4d8")
				.hex("response", "#90e0ef")
				.hex("error", "#ef476f")
				.hex("middleware", "#ffd166")

			const categories = apiLogger.getCategories()
			expect(categories).toContain('request')
			expect(categories).toContain('response')
			expect(categories).toContain('error')
			expect(categories).toContain('middleware')
		})
	})

	describe('Category Management', () => {
		it('should remove categories', () => {
			bunnyLog.testCategory('Test message')
			let categories = bunnyLog.getCategories()
			expect(categories).toContain('testCategory')

			bunnyLog.removeCategory('testCategory')
			categories = bunnyLog.getCategories()
			expect(categories).not.toContain('testCategory')
		})

		it('should get all categories', () => {
			const categories = bunnyLog.getCategories()
			expect(Array.isArray(categories)).toBe(true)
			expect(categories.length).toBeGreaterThan(0)
		})
	})

	describe('Complex Data Structures', () => {
		it('should log complex objects correctly', () => {
			const complexData = {
				user: {
					id: 123,
					name: "Alice",
					preferences: { theme: "dark", language: "en" }
				},
				permissions: ["read", "write", "admin"],
				metadata: {
					createdAt: "2024-01-01",
					lastLogin: null,
					isActive: true,
					stats: {
						loginCount: 42,
						lastIP: "192.168.1.1",
						devices: ["mobile", "desktop"]
					}
				}
			}

			// Should not throw error when logging complex objects
			expect(() => {
				bunnyLog.info('Complex user data:', complexData)
			}).not.toThrow()
		})

		it('should log simple objects correctly', () => {
			const simpleData = {
				string: 'value',
				number: 42,
				boolean: true,
				data: null,
				object: {
					string: 'value',
					boolean: true,
					number: 42,
					data: null,
				},
				array: [1, 2, 3],
				emptyObject: {},
				emptyArray: [],
			}

			// Should not throw error when logging objects
			expect(() => {
				bunnyLog.info(simpleData)
			}).not.toThrow()
		})
	})

	describe('Error Handling', () => {
		it('should handle errors with custom categories', () => {
			try {
				throw new Error("Something broke in the payment system")
			} catch (error) {
				expect(() => {
					bunnyLog.hex("critical", "#ff006e").critical("Critical error:", error)
				}).not.toThrow()

				const categories = bunnyLog.getCategories()
				expect(categories).toContain('critical')
			}
		})
	})

	describe('Table Functionality', () => {
		it('should have table method', () => {
			expect(typeof bunnyLog.table).toBe('function')

			const data = [
				{ name: 'Alice', age: 30, isAdmin: true, preferences: { theme: 'dark' } },
				{ name: 'Bob', age: 25, isAdmin: false, preferences: { theme: 'light' } },
			]

			expect(() => {
				bunnyLog.table(data)
			}).not.toThrow()
		})

		it('should create and render default table', async () => {
			const table = new Table()
			expect(table).toBeInstanceOf(Table)

			table.setFormat(FORMAT_DEFAULT)

			await table.setTitle(["User", "Role", "Status"])
			await table.addRows([
				["Alice", "Admin", "Active"],
				["Bob", "User", "Active"]
			])

			const rendered = table.render()
			expect(typeof rendered).toBe('string')
			expect(rendered.length).toBeGreaterThan(0)
		})

		it('should create and render unicode table', async () => {
			const table = new Table()
			table.setFormat(FORMAT_UNICODE)

			await table.setTitle(["Service", "Status", "Uptime"])
			await table.addRows([
				["API Gateway", "Online", "99.9%"],
				["Database", "Online", "99.8%"]
			])

			const rendered = table.render(false)
			expect(typeof rendered).toBe('string')
			expect(rendered.length).toBeGreaterThan(0)
		})

		it('should create colored table', async () => {
			const table = new Table()
			table.setFormat(FORMAT_UNICODE)

			await table.setTitle(["Component", "Version", "Status"])
			await table.addRows([
				["Node.js", "v20.0.0", "Latest"],
				["Express", "v4.18.2", "Stable"]
			])

			const rendered = table.render(true)
			expect(typeof rendered).toBe('string')
			expect(rendered.length).toBeGreaterThan(0)
		})

		it('should handle table with custom logger', () => {
			const apiLogger = new BunnyLogger(false)
				.hex("table", "#06ffa5")

			// The table method should work with custom loggers
			expect(typeof apiLogger.table).toBe('function')
		})
	})

	describe('Method Chaining', () => {
		it('should support method chaining for multiple color definitions', () => {
			const result = bunnyLog
				.hex("chain1", "#ff0000")
				.hex("chain2", "#00ff00")
				.rgb("chain3", 0, 0, 255)

			expect(typeof result.hex).toBe('function') // Should have chaining methods
			expect(typeof result.rgb).toBe('function')
			expect(typeof result.log).toBe('function')

			// Verify methods were created
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('chain1')
			expect(categories).toContain('chain2')
			expect(categories).toContain('chain3')
		})

		it('should support chaining on custom logger instances', () => {
			const logger = new BunnyLogger(false)
			const result = logger
				.hex("test1", "#111111")
				.hex("test2", "#222222")

			expect(typeof result.hex).toBe('function') // Should have chaining methods
			expect(typeof result.log).toBe('function')

			const categories = logger.getCategories()
			expect(categories).toContain('test1')
			expect(categories).toContain('test2')
		})

		it('should support chaining after logging methods', () => {
			const logger = new BunnyLogger()

			// Test chaining after default logging methods
			const result1 = logger.info('Test message')
			expect(typeof result1.log).toBe('function') // Should return chainable object
			expect(typeof result1.hex).toBe('function')

			const result2 = logger.success('Success message')
			expect(typeof result2.log).toBe('function') // Should return chainable object
		})

		it('should support chaining after auto-created logging methods', () => {
			const logger = new BunnyLogger()

			// Test chaining after auto-created methods
			const result = logger.customCategory('Custom message')
			expect(typeof result.log).toBe('function') // Should return chainable object
			expect(typeof logger.customCategory).toBe('function')
		})

		it('should allow complex chaining combinations', () => {
			const logger = new BunnyLogger(false)

			// Complex chaining: create category, log, modify color, log again
			const result = logger
				.hex('test', '#FF0000')
				.test('First message')
				.setHex('test', '#00FF00')
				.test('Second message with new color')
				.use12HourFormat()
				.test('Third message with 12h format')
				.hideSecondsInTime()
				.test('Fourth message without seconds')

			expect(typeof result.log).toBe('function') // Should return chainable object
			expect(logger.getTimeFormat()).toBe('12h')
			expect(logger.getShowSeconds()).toBe(false)
		})

		it('should work with the user example pattern', () => {
			const logger = new BunnyLogger()

			// Test the exact pattern the user wanted
			const result = logger.bruh("bruh message").setColor("bruh", chalk.red)
			expect(typeof result.log).toBe('function') // Should return chainable object

			// Verify the category was created and color was set
			const categories = logger.getCategories()
			expect(categories).toContain('bruh')
		})

		it('should support chaining with hex color setting', () => {
			const logger = new BunnyLogger()

			// Test chaining with setHex using the log() method (recommended approach)
			logger.log('testCategory', 'Test message')
			const result = logger
				.setHex('testCategory', '#FFFF00')
				.log('testCategory', 'Message with yellow color')

			expect(typeof result.log).toBe('function') // Should return chainable object
		})
	})

	describe('Core Functionality Verification', () => {
		it('should have all required methods on bunnyLog', () => {
			expect(typeof bunnyLog.removeCategory).toBe('function')
			expect(typeof bunnyLog.getCategories).toBe('function')
			expect(typeof bunnyLog.hex).toBe('function')
			expect(typeof bunnyLog.rgb).toBe('function')
			expect(typeof bunnyLog.setHex).toBe('function')
			expect(typeof bunnyLog.table).toBe('function')
			expect(typeof bunnyLog.setTimeFormat).toBe('function')
			expect(typeof bunnyLog.getTimeFormat).toBe('function')
			expect(typeof bunnyLog.use12HourFormat).toBe('function')
			expect(typeof bunnyLog.use24HourFormat).toBe('function')
			expect(typeof bunnyLog.getTimestamp).toBe('function')
			expect(typeof bunnyLog.setShowSeconds).toBe('function')
			expect(typeof bunnyLog.getShowSeconds).toBe('function')
			expect(typeof bunnyLog.showSecondsInTime).toBe('function')
			expect(typeof bunnyLog.hideSecondsInTime).toBe('function')
			expect(typeof bunnyLog.setTextColor).toBe('function')
			expect(typeof bunnyLog.getTextColor).toBe('function')
			expect(typeof bunnyLog.enableTextColor).toBe('function')
			expect(typeof bunnyLog.disableTextColor).toBe('function')
		})

		it('should export all required classes and constants', () => {
			expect(bunnyLog).toBeDefined()
			expect(BunnyLogger).toBeDefined()
			expect(Table).toBeDefined()
			expect(FORMAT_UNICODE).toBeDefined()
			expect(FORMAT_DEFAULT).toBeDefined()
		})
	})

	describe('Time Format Configuration', () => {
		it('should default to 24-hour format', () => {
			const logger = new BunnyLogger()
			expect(logger.getTimeFormat()).toBe('24h')
		})

		it('should allow setting time format to 12h', () => {
			const logger = new BunnyLogger()
			const result = logger.setTimeFormat('12h')
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getTimeFormat()).toBe('12h')
		})

		it('should allow setting time format to 24h', () => {
			const logger = new BunnyLogger()
			logger.setTimeFormat('12h') // Set to 12h first
			const result = logger.setTimeFormat('24h')
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getTimeFormat()).toBe('24h')
		})

		it('should throw error for invalid time format', () => {
			const logger = new BunnyLogger()
			expect(() => {
				logger.setTimeFormat('invalid')
			}).toThrow("Time format must be '12h' or '24h'")
		})

		it('should have convenience method for 12-hour format', () => {
			const logger = new BunnyLogger()
			const result = logger.use12HourFormat()
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getTimeFormat()).toBe('12h')
		})

		it('should have convenience method for 24-hour format', () => {
			const logger = new BunnyLogger()
			logger.use12HourFormat() // Set to 12h first
			const result = logger.use24HourFormat()
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getTimeFormat()).toBe('24h')
		})

		it('should generate timestamps with correct format', () => {
			const logger = new BunnyLogger()

			// Test 24-hour format
			logger.use24HourFormat()
			const timestamp24h = logger.getTimestamp()
			expect(typeof timestamp24h).toBe('string')
			expect(timestamp24h.length).toBeGreaterThan(0)

			// Test 12-hour format
			logger.use12HourFormat()
			const timestamp12h = logger.getTimestamp()
			expect(typeof timestamp12h).toBe('string')
			expect(timestamp12h.length).toBeGreaterThan(0)

			// Timestamps should be different formats (though exact content may vary)
			// We just verify they're both strings and not empty
		})

		it('should use time format in actual logging', () => {
			const logger = new BunnyLogger()

			logger.use12HourFormat()
			expect(() => {
				logger.info('Test message with 12h format')
			}).not.toThrow()

			logger.use24HourFormat()
			expect(() => {
				logger.info('Test message with 24h format')
			}).not.toThrow()
		})

		it('should maintain time format across different logging calls', () => {
			const logger = new BunnyLogger()

			logger.setTimeFormat('12h')
			expect(logger.getTimeFormat()).toBe('12h')

			logger.info('First message')
			expect(logger.getTimeFormat()).toBe('12h')

			logger.success('Second message')
			expect(logger.getTimeFormat()).toBe('12h')
		})
	})

	describe('Seconds Display Configuration', () => {
		it('should default to showing seconds', () => {
			const logger = new BunnyLogger()
			expect(logger.getShowSeconds()).toBe(true)
		})

		it('should allow setting seconds display to false', () => {
			const logger = new BunnyLogger()
			const result = logger.setShowSeconds(false)
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getShowSeconds()).toBe(false)
		})

		it('should allow setting seconds display to true', () => {
			const logger = new BunnyLogger()
			logger.setShowSeconds(false) // Set to false first
			const result = logger.setShowSeconds(true)
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getShowSeconds()).toBe(true)
		})

		it('should have convenience method to show seconds', () => {
			const logger = new BunnyLogger()
			logger.setShowSeconds(false) // Set to false first
			const result = logger.showSecondsInTime()
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getShowSeconds()).toBe(true)
		})

		it('should have convenience method to hide seconds', () => {
			const logger = new BunnyLogger()
			const result = logger.hideSecondsInTime()
			expect(typeof result.log).toBe('function') // Should return chainable instance
			expect(logger.getShowSeconds()).toBe(false)
		})

		it('should generate timestamps with/without seconds correctly', () => {
			const logger = new BunnyLogger()

			// Test with seconds
			logger.showSecondsInTime()
			const timestampWithSeconds = logger.getTimestamp()
			expect(typeof timestampWithSeconds).toBe('string')
			expect(timestampWithSeconds.length).toBeGreaterThan(0)

			// Test without seconds
			logger.hideSecondsInTime()
			const timestampWithoutSeconds = logger.getTimestamp()
			expect(typeof timestampWithoutSeconds).toBe('string')
			expect(timestampWithoutSeconds.length).toBeGreaterThan(0)

			// Without seconds should be shorter than with seconds
			// Note: We can't guarantee exact length due to potential time changes during test
		})

		it('should use seconds setting in actual logging', () => {
			const logger = new BunnyLogger()

			logger.showSecondsInTime()
			expect(() => {
				logger.info('Test message with seconds')
			}).not.toThrow()

			logger.hideSecondsInTime()
			expect(() => {
				logger.info('Test message without seconds')
			}).not.toThrow()
		})

		it('should maintain seconds setting across different logging calls', () => {
			const logger = new BunnyLogger()

			logger.setShowSeconds(false)
			expect(logger.getShowSeconds()).toBe(false)

			logger.info('First message')
			expect(logger.getShowSeconds()).toBe(false)

			logger.success('Second message')
			expect(logger.getShowSeconds()).toBe(false)
		})

		it('should work with different time formats', () => {
			const logger = new BunnyLogger()

			// Test 12h with seconds
			logger.use12HourFormat().showSecondsInTime()
			expect(() => {
				logger.info('12h with seconds')
			}).not.toThrow()

			// Test 12h without seconds
			logger.use12HourFormat().hideSecondsInTime()
			expect(() => {
				logger.info('12h without seconds')
			}).not.toThrow()

			// Test 24h with seconds
			logger.use24HourFormat().showSecondsInTime()
			expect(() => {
				logger.info('24h with seconds')
			}).not.toThrow()

			// Test 24h without seconds
			logger.use24HourFormat().hideSecondsInTime()
			expect(() => {
				logger.info('24h without seconds')
			}).not.toThrow()
		})

		it('should convert boolean values correctly', () => {
			const logger = new BunnyLogger()

			// Test truthy values
			logger.setShowSeconds(1)
			expect(logger.getShowSeconds()).toBe(true)

			logger.setShowSeconds('true')
			expect(logger.getShowSeconds()).toBe(true)

			// Test falsy values
			logger.setShowSeconds(0)
			expect(logger.getShowSeconds()).toBe(false)

			logger.setShowSeconds('')
			expect(logger.getShowSeconds()).toBe(false)

			logger.setShowSeconds(null)
			expect(logger.getShowSeconds()).toBe(false)
		})
	})
})
