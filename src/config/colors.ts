import chalk, { type ChalkInstance } from 'chalk'
import type { LogCategory } from '../types/bunnyLog'

export const categoryColors = new Map<LogCategory, ChalkInstance>([
	['server', chalk.green],
	['database', chalk.yellow],
	['error', chalk.red],
	['info', chalk.blue],
	['success', chalk.greenBright],
	['warning', chalk.yellowBright],
	['api', chalk.magenta],
])
