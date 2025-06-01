import { bunnyLog, BunnyLogger, Table, FORMAT_UNICODE, FORMAT_DEFAULT } from '../src/index.js';

console.log("=== 🐰 BunnyLog Advanced Examples ===\n");

// ✨ MAGIC: Auto-created categories! No need for bunnyLog.addCategory()
console.log("=== 🎯 Auto-Category Creation (MAGIC!) ===");
bunnyLog.info("Standard info message");
bunnyLog.success("Standard success message");

// 🪄 Just use ANY category name - it's auto-created!
bunnyLog.discord("Discord bot message");  // Auto-created!
bunnyLog.payment("Payment processed");    // Auto-created!
bunnyLog.auth("User authenticated");      // Auto-created!
bunnyLog.myCustomCategory("This just works!"); // Auto-created!

console.log("Available categories after auto-creation:", bunnyLog.getCategories());

// 🎨 Easy hex colors!
console.log("\n=== 🌈 Hex Colors (Super Easy!) ===");
bunnyLog.hex("github", "#6cc644").github("GitHub integration active");
bunnyLog.hex("discord", "#5865f2").discord("Discord bot online");
bunnyLog.hex("stripe", "#635bff").stripe("Payment webhook received");
bunnyLog.hex("warning", "#ff6b35").warning("Custom orange warning");

// 🎨 RGB colors too!
bunnyLog.rgb("custom", 255, 100, 150).custom("Pretty pink message");

// 🔗 Chainable methods!
bunnyLog
	.hex("deploy", "#00d4aa")
	.hex("build", "#ff9500")
	.hex("test", "#34c759");

bunnyLog.deploy("Deployment started");
bunnyLog.build("Build completed");
bunnyLog.test("Tests passing");

// 🆕 Create your own clean logger!
console.log("\n=== 🧹 Custom Clean Instance ===");
const myLogger = BunnyLogger.clean()  // No default categories
	.hex("app", "#ff6b9d")
	.hex("db", "#4ecdc4")
	.hex("cache", "#ffe66d");

myLogger.app("My app is running");
myLogger.db("Database connected");
myLogger.cache("Cache cleared");

console.log("My logger categories:", myLogger.getCategories());

// 🔄 Another custom instance for different service
console.log("\n=== 🏢 Service-Specific Logger ===");
const apiLogger = new BunnyLogger(false)  // Clean start
	.hex("request", "#00b4d8")
	.hex("response", "#90e0ef")
	.hex("error", "#ef476f")
	.hex("middleware", "#ffd166");

apiLogger.request("GET /api/users");
apiLogger.middleware("Auth middleware passed");
apiLogger.response("200 OK - Users fetched");

// 🛠️ Change colors dynamically
console.log("\n=== 🎛️ Dynamic Color Changes ===");
bunnyLog.info("Info with blue color");
bunnyLog.setHex("info", "#ff6b35");  // Change to orange
bunnyLog.info("Same category, now orange!");

// 🗑️ Remove categories
bunnyLog.removeCategory("myCustomCategory");
console.log("After removal:", bunnyLog.getCategories());

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

bunnyLog.hex("data", "#a8dadc").data("Complex user data:", complexData);

// 🎯 Error handling with colors
console.log("\n=== 🚨 Error Handling ===");
try {
	throw new Error("Something broke in the payment system");
} catch (error) {
	bunnyLog.hex("critical", "#ff006e").critical("Critical error:", error);
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
console.log("✅ Auto-categories: bunnyLog.anyName() just works!");
console.log("🎨 Hex colors: bunnyLog.hex('name', '#color')");
console.log("🧹 Clean instances: BunnyLogger.clean()");
console.log("🔗 Chainable: .hex().rgb().setColor()");
console.log("🎯 TypeScript: Suggests known categories + any custom ones");

console.log("\n=== 🐰 BunnyLog Complete! ===");
