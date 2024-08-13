import { describe, expect, it, beforeEach, afterEach, spyOn } from 'bun:test'
import { bunnyLog } from '../src'

describe('bunnyLog', () => {
	let consoleSpy: ReturnType<typeof spyOn>

	beforeEach(() => {
		consoleSpy = spyOn(console, 'log').mockImplementation(() => {})
	})

	afterEach(() => {
		consoleSpy.mockRestore()
	})

	it('should log server message correctly', () => {
		bunnyLog('server', 'Test server log')
		expect(consoleSpy).toHaveBeenCalled()
	})

	// Additional tests for other categories...
})
