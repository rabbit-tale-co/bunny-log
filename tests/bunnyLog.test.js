import stripAnsi from 'strip-ansi'
import { describe, it, expect, beforeEach, afterEach, spyOn } from 'bun:test'
import { bunnyLog } from '../src/bunnyLog'

describe('bunnyLog', () => {
	let consoleSpy
	let errorSpy

	beforeEach(() => {
		consoleSpy = spyOn(console, 'log').mockImplementation((message) => {
			process.stdout.write(`Logged message: ${message}\n`)
		})
		errorSpy = spyOn(console, 'error').mockImplementation((message) => {
			process.stdout.write(`Logged error: ${message}\n`)
		})
	})

	afterEach(() => {
		consoleSpy.mockRestore()
		errorSpy.mockRestore()
	})

	it('should log server message correctly', () => {
		bunnyLog('server', 'Test server log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[SERVER] - Test server log')
	})

	it('should log info message correctly', () => {
		bunnyLog('info', 'Test info log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[INFO] - Test info log')
	})

	it('should log error message correctly', () => {
		bunnyLog('error', new Error('Test error log'))

		const actualLogOutput = stripAnsi(errorSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[ERROR] - Test error log')
	})

	it('should log success message correctly', () => {
		bunnyLog('success', 'Test success log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[SUCCESS] - Test success log')
	})

	it('should log API message correctly', () => {
		bunnyLog('api', 'Test api log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[API] - Test api log')
	})

	it('should log database message correctly', () => {
		bunnyLog('database', 'Test database log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[DATABASE] - Test database log')
	})

	it('should log warning message correctly', () => {
		bunnyLog('warning', 'Test warning log')

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain('[WARNING] - Test warning log')
	})

	it('should log object message correctly', () => {
		bunnyLog('object', {
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
		})

		const actualLogOutput = stripAnsi(consoleSpy.mock.calls[0][0])
		expect(actualLogOutput).toContain(`{
  string: "value",
  number: 42,
  boolean: true,
  data: null,
  object: {
    string: "value",
    boolean: true,
    number: 42,
    data: null
  },
  array: [1, 2, 3],
  emptyObject: {},
  emptyArray: []
}`)
	})
})
