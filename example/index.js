import { bunnyLog, BunnyLogger, Table, FORMAT_UNICODE, FORMAT_DEFAULT } from '../src/index.js';

console.log("=== 🐰 BunnyLog Simple & Clean Examples ===\n");

// ✨ MAGIC: Auto-created categories with smart colors!
console.log("=== 🎯 Auto-Category Creation with Smart Colors ===");
bunnyLog.log("info", "Info with automatic blue color");
bunnyLog.log("success", "Success with automatic green color");
bunnyLog.log("error", "Error with automatic red color");
bunnyLog.log("warn", "Warning with automatic yellow color");

// 🪄 Custom categories auto-created too!
bunnyLog.log("server", "Server message with cyan color"); // Auto-created with cyan

console.log("Available categories after auto-creation:", bunnyLog.getCategories());

// 🎨 Text coloring demonstration
console.log("\n=== 🎨 Text Coloring Examples ===");
bunnyLog.log("info", "Default: category colored, text plain");

bunnyLog.enableTextColor();
bunnyLog.log("info", "Enabled: both category AND text are colored!");
bunnyLog.log("success", "Success message with colored text");
bunnyLog.log("error", "Error message with colored text");
bunnyLog.log("warn", "Warning message with colored text");

bunnyLog.disableTextColor();
bunnyLog.log("info", "Disabled: back to plain text with colored category");

// 🎨 Easy hex colors!
console.log("\n=== 🌈 Hex Colors (Super Easy!) ===");
bunnyLog.hex("github", "#6cc644").log("github", "GitHub integration active");
bunnyLog.hex("discord", "#5865f2").log("discord", "Discord bot online");
bunnyLog.hex("stripe", "#635bff").log("stripe", "Payment webhook received");
bunnyLog.hex("warning", "#ff6b35").log("warning", "Custom orange warning");

// 🎨 RGB colors too!
bunnyLog.rgb("custom", 255, 100, 150).log("custom", "Pretty pink message");

// 🔗 Chainable methods!
bunnyLog
	.hex("deploy", "#00d4aa")
	.hex("build", "#ff9500")
	.hex("test", "#34c759");

bunnyLog.log("deploy", "Deployment started");
bunnyLog.log("build", "Build completed");
bunnyLog.log("test", "Tests passing");

// 🆕 Create your own clean logger!
console.log("\n=== 🧹 Custom Clean Instance ===");
const myLogger = BunnyLogger.clean()  // No default categories
	.hex("app", "#ff6b9d")
	.hex("db", "#4ecdc4")
	.hex("cache", "#ffe66d");

myLogger.log("app", "My app is running");
myLogger.log("db", "Database connected");
myLogger.log("cache", "Cache cleared");

console.log("My logger categories:", myLogger.getCategories());

// 🔄 Another custom instance for different service
console.log("\n=== 🏢 Service-Specific Logger ===");
const apiLogger = new BunnyLogger(false)  // Clean start
	.hex("request", "#00b4d8")
	.hex("response", "#90e0ef")
	.hex("error", "#ef476f")
	.hex("middleware", "#ffd166");

apiLogger.log("request", "GET /api/users");
apiLogger.log("middleware", "Auth middleware passed");
apiLogger.log("response", "200 OK - Users fetched");

// 🛠️ Change colors dynamically
console.log("\n=== 🎛️ Dynamic Color Changes ===");
bunnyLog.log("info", "Info with blue color");
bunnyLog.setHex("info", "#ff6b35");  // Change to orange
bunnyLog.log("info", "Same category, now orange!");

// 🗑️ Remove categories
bunnyLog.removeCategory("myCustomCategory");
console.log("After removal:", bunnyLog.getCategories());

// ⏰ Time Format Configuration
console.log("\n=== ⏰ Time Format Configuration ===");
bunnyLog.log("info", "Default 24-hour format with seconds");

// Switch to 12-hour format
bunnyLog.use12HourFormat();
bunnyLog.log("info", "Now using 12-hour format");
bunnyLog.log("success", "12h format works for all categories");

// Hide seconds from timestamps
bunnyLog.hideSecondsInTime();
bunnyLog.log("info", "12h format without seconds");
bunnyLog.log("warn", "Notice: no seconds displayed");

// Show seconds again
bunnyLog.showSecondsInTime();
bunnyLog.log("info", "12h format with seconds restored");

// Switch back to 24-hour format
bunnyLog.use24HourFormat();
bunnyLog.log("info", "Back to 24h format");
bunnyLog.log("warn", "24h format restored");

// Test chaining with both time format, seconds, and text color
bunnyLog
	.setTimeFormat('12h')
	.setShowSeconds(false)
	.enableTextColor();
bunnyLog.hex("time", "#FFD700").log("time", "Chained: 12h without seconds, colored text");

bunnyLog
	.setTimeFormat('24h')
	.setShowSeconds(true)
	.disableTextColor();
bunnyLog.hex("time", "#FFD700").log("time", "Chained: 24h with seconds, plain text");

// Check current settings
console.log("Current time format:", bunnyLog.getTimeFormat());
console.log("Show seconds:", bunnyLog.getShowSeconds());
console.log("Text coloring:", bunnyLog.getTextColor());

// Show with custom logger too
const timeLogger = BunnyLogger.clean()
	.hex("morning", "#FFA500")
	.hex("evening", "#4B0082");

timeLogger.use12HourFormat().hideSecondsInTime().enableTextColor();
timeLogger.log("morning", "Custom logger: 12h without seconds, colored text");

timeLogger.use24HourFormat().showSecondsInTime().disableTextColor();
timeLogger.log("evening", "Custom logger: 24h with seconds, plain text");

// 📊 Complex object with colors
console.log("\n=== 📊 Complex Data Structures ===");
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
};

bunnyLog.hex("data", "#a8dadc").log("data", "Complex user data:", complexData);

// 🎯 Error handling with colors
console.log("\n=== 🚨 Error Handling ===");
try {
	throw new Error("Something broke in the payment system");
} catch (error) {
	bunnyLog.hex("critical", "#ff006e").log("critical", "Critical error:", error);
}

// 📋 Tables with different loggers
console.log("\n=== 📋 Table Examples ===");
const userData = [
	{ id: 1, name: "Alice", role: "admin", active: true, lastLogin: "2024-01-15" },
	{ id: 2, name: "Bob", role: "user", active: true, lastLogin: "2024-01-14" },
	{ id: 3, name: "Charlie", role: "moderator", active: false, lastLogin: "2024-01-10" }
];

bunnyLog.table(userData);

// Custom logger table
apiLogger.hex("table", "#06ffa5").table(userData, { columns: ["name", "role", "active"] });

// 🎨 Advanced table
console.log("\n=== 🎨 Advanced Styled Table ===");
async function createStyledTable() {
	const table = new Table();
	table.setFormat(FORMAT_UNICODE);

	await table.setTitle(["Service", "Status", "Uptime", "Last Check"]);
	await table.addRows([
		["API Gateway", "Online", "99.9%", "2s ago"],
		["Database", "Online", "99.8%", "5s ago"],
		["Cache", "Warning", "98.5%", "1m ago"],
		["CDN", "Online", "100%", "3s ago"]
	]);

	console.log(table.render(false)); // No colors for better compatibility
}

async function createSimpleTable() {
	console.log("\n=== 📊 Simple Default Table ===");
	const table = new Table();
	table.setFormat(FORMAT_DEFAULT);

	await table.setTitle(["User", "Role", "Status", "Last Login"]);
	await table.addRows([
		["Alice", "Admin", "Active", "2024-01-15"],
		["Bob", "User", "Active", "2024-01-14"],
		["Charlie", "Mod", "Inactive", "2024-01-10"],
		["Diana", "User", "Active", "2024-01-16"]
	]);

	console.log(table.render());
}

async function createColoredTable() {
	console.log("\n=== 🌈 Colored Table ===");
	const table = new Table();
	table.setFormat(FORMAT_UNICODE);

	await table.setTitle(["Component", "Version", "Status"]);
	await table.addRows([
		["Node.js", "v20.0.0", "Latest"],
		["Express", "v4.18.2", "Stable"],
		["TypeScript", "v5.0.0", "Latest"],
		["Chalk", "v5.2.0", "Stable"]
	]);

	console.log(table.render(true)); // With colors
}

createStyledTable();
createSimpleTable();
createColoredTable();

console.log("\n=== 🎉 Summary ===");
console.log("✅ Auto-categories with smart colors: logger.log('info', 'message')");
console.log("🎨 Text coloring: .enableTextColor() / .disableTextColor()");
console.log("🎨 Hex colors: bunnyLog.hex('name', '#color')");
console.log("🧹 Clean instances: BunnyLogger.clean()");
console.log("🔗 Chainable: .hex().rgb().setColor()");
console.log("⏰ Time formats: .use12HourFormat() and .use24HourFormat()");
console.log("⏱️  Seconds control: .showSecondsInTime() and .hideSecondsInTime()");

console.log("\n=== 🐰 BunnyLog Complete! ===");
