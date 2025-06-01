import { bunnyLog, BunnyLogger } from "../src";

console.log("=== 🐰 BunnyLog Simple & Clean Examples ===\n");

// ✅ Clean usage - no prebuild categories, everything auto-created
const logger = new BunnyLogger();

// ✅ Categories are created automatically when first used
logger.log("info", "This creates an 'info' category automatically");
logger.log("success", "This creates a 'success' category");
logger.log("error", "This creates an 'error' category");
logger.log("warn", "This creates a 'warn' category");

// ✅ Text coloring demonstration
console.log("\n=== 🎨 Text Coloring Examples ===");
logger.log("info", "Default: category colored, text plain");

logger.enableTextColor();
logger.log("info", "Enabled: both category AND text are colored!");
logger.log("success", "Success message with colored text");
logger.log("error", "Error message with colored text");
logger.log("warn", "Warning message with colored text");

logger.disableTextColor();
logger.log("info", "Disabled: back to plain text with colored category");

// ✅ Custom categories with colors
logger
  .hex("api", "#00d4aa")
  .log("api", "API request received")
  .hex("database", "#ffff00")
  .log("database", "Database connected")
  .hex("deploy", "#ff6b35")
  .log("deploy", "Deployment started");

// ✅ Singleton usage - starts completely clean
bunnyLog.log("app", "Application starting...");
bunnyLog.log("server", "Server listening on port 3000");

// ✅ Chaining with time format configuration
bunnyLog
  .setTimeFormat("12h")
  .hideSecondsInTime()
  .log("config", "Using 12h time format without seconds");

// ✅ Clean logger instance (no default categories at all)
const gameLogger = BunnyLogger.clean()
  .hex("player", "#00ff00")
  .hex("enemy", "#ff0000")
  .hex("item", "#ffff00");

gameLogger
  .log("player", "Player joined the game")
  .log("enemy", "Enemy spawned")
  .log("item", "Item collected");

// ✅ Complex data logging
const userData = {
  id: 123,
  name: "Alice",
  permissions: ["read", "write"],
  isActive: true
};

logger
  .hex("user", "#ff6b9d")
  .log("user", "User data:", userData);

// ✅ Table example
const tableData = [
  { name: "Alice", role: "admin", active: true },
  { name: "Bob", role: "user", active: false }
];

logger.table(tableData);

console.log("\n=== ✅ Simple & Clean Complete! ===");
console.log("🎯 No prebuild categories - everything auto-created");
console.log("🔧 Clean, simple, and flexible");
console.log("Available categories:", logger.getCategories());
