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
			expect(result).toBe(bunnyLog) // Should return chainable instance
			bunnyLog.github("GitHub integration active")
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('github')
		})

		it('should support chaining hex color definitions', () => {
			const result = bunnyLog
				.hex("deploy", "#00d4aa")
				.hex("build", "#ff9500")
				.hex("test", "#34c759")

			expect(result).toBe(bunnyLog)

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
			expect(result).toBe(bunnyLog) // Should return chainable instance

			bunnyLog.info('Info with new orange color')
			// Both calls should work without error
		})
	})

	describe('RGB Color Support', () => {
		it('should support RGB colors', () => {
			const result = bunnyLog.rgb("custom", 255, 100, 150)
			expect(result).toBe(bunnyLog)
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

			expect(result).toBe(myLogger)

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
		it('should add custom category with color', () => {
			bunnyLog.addCategory('debug', chalk.hex('#dc23da'))
			const categories = bunnyLog.getCategories()
			expect(categories).toContain('debug')
			expect(typeof bunnyLog.debug).toBe('function')
			bunnyLog.debug('Test debug log')
		})

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

			expect(result).toBe(bunnyLog) // Should return the same instance for chaining

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

			expect(result).toBe(logger)

			const categories = logger.getCategories()
			expect(categories).toContain('test1')
			expect(categories).toContain('test2')
		})
	})

	describe('Core Functionality Verification', () => {
		it('should have all required methods on bunnyLog', () => {
			expect(typeof bunnyLog.addCategory).toBe('function')
			expect(typeof bunnyLog.removeCategory).toBe('function')
			expect(typeof bunnyLog.getCategories).toBe('function')
			expect(typeof bunnyLog.hex).toBe('function')
			expect(typeof bunnyLog.rgb).toBe('function')
			expect(typeof bunnyLog.setHex).toBe('function')
			expect(typeof bunnyLog.table).toBe('function')
		})

		it('should export all required classes and constants', () => {
			expect(bunnyLog).toBeDefined()
			expect(BunnyLogger).toBeDefined()
			expect(Table).toBeDefined()
			expect(FORMAT_UNICODE).toBeDefined()
			expect(FORMAT_DEFAULT).toBeDefined()
		})
	})
})
