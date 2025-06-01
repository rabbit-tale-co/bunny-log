# 🐰 BunnyLog

Beautiful console logging with auto-categories, hex colors, and advanced tables.

![npm version](https://img.shields.io/npm/v/bunny-log)
![license](https://img.shields.io/npm/l/bunny-log)
![downloads](https://img.shields.io/npm/dm/bunny-log)

## ✨ Features

- 🪄 **Auto-Categories** - Use any category name, automatically created with smart colors
- 🎨 **Hex Colors** - Easy hex color support with `.hex(category, "#color")`
- 🌈 **Text Coloring** - Color message text with category colors
- 🔗 **Chainable** - Fluent API with method chaining
- 📊 **Advanced Tables** - Beautiful Unicode tables with multiple formats
- ⏰ **Time Formats** - 12h/24h formats with seconds control
- 🎯 **TypeScript** - Full TypeScript support with auto-completion
- 🧹 **Clean Instances** - Create custom loggers without default categories
- ⚡ **Fast** - Built for performance with modern JavaScript

## 🚀 Installation

```bash
# Using bun (recommended)
bun add bunny-log

# Using npm
npm install bunny-log

# Using yarn
yarn add bunny-log
```

## 📖 Usage

### Basic Logging with Auto-Categories

```javascript
import { bunnyLog } from 'bunny-log';

// The simple, consistent way - use .log(category, message)
bunnyLog.log("info", "Application started");
bunnyLog.log("success", "Database connected");
bunnyLog.log("warn", "Memory usage high");
bunnyLog.log("error", "Connection failed");

// 🪄 MAGIC: Any category name works - auto-created with smart colors!
bunnyLog.log("discord", "Bot is online");        // Auto-created with white
bunnyLog.log("payment", "Payment processed");    // Auto-created with white
bunnyLog.log("server", "Server started");        // Auto-created with cyan
bunnyLog.log("database", "DB connected");        // Auto-created with bright blue
bunnyLog.log("api", "API ready");                // Auto-created with bright magenta
```

**Output:**
```
14:32:15 | [INFO] - Application started          (blue)
14:32:15 | [SUCCESS] - Database connected        (green)
14:32:15 | [WARN] - Memory usage high            (yellow)
14:32:15 | [ERROR] - Connection failed           (red)
14:32:15 | [DISCORD] - Bot is online             (white)
14:32:15 | [PAYMENT] - Payment processed         (white)
14:32:15 | [SERVER] - Server started             (cyan)
14:32:15 | [DATABASE] - DB connected             (bright blue)
14:32:15 | [API] - API ready                     (bright magenta)
```

### 🌈 Text Coloring

```javascript
// Default: only category labels are colored
bunnyLog.log("info", "Category colored, text plain");

// Enable text coloring - message text gets the category color too!
bunnyLog.enableTextColor();
bunnyLog.log("info", "Both category AND text are colored!");
bunnyLog.log("success", "Success message with colored text");
bunnyLog.log("error", "Error message with colored text");

// Disable text coloring
bunnyLog.disableTextColor();
bunnyLog.log("info", "Back to plain text with colored category");

// Check current setting
console.log("Text coloring enabled:", bunnyLog.getTextColor());
```

**Output:**
```
14:32:16 | [INFO] - Category colored, text plain              (category blue, text plain)
14:32:16 | [INFO] - Both category AND text are colored!       (both blue)
14:32:16 | [SUCCESS] - Success message with colored text      (both green)
14:32:16 | [ERROR] - Error message with colored text          (both red)
14:32:16 | [INFO] - Back to plain text with colored category  (category blue, text plain)
Text coloring enabled: false
```

### 🎨 Hex Colors (Super Easy!)

```javascript
// Add categories with beautiful hex colors
bunnyLog.hex("github", "#6cc644").log("github", "GitHub webhook received");
bunnyLog.hex("discord", "#5865f2").log("discord", "Discord bot online");
bunnyLog.hex("stripe", "#635bff").log("stripe", "Payment successful");

// RGB colors work too!
bunnyLog.rgb("custom", 255, 100, 150).log("custom", "Pretty pink message");

// Chainable for multiple categories
bunnyLog
  .hex("deploy", "#00d4aa")
  .hex("build", "#ff9500")
  .hex("test", "#34c759");

bunnyLog.log("deploy", "Deployment started");
bunnyLog.log("build", "Build completed");
bunnyLog.log("test", "All tests passing");
```

**Output:**
```
14:32:17 | [GITHUB] - GitHub webhook received     (green #6cc644)
14:32:17 | [DISCORD] - Discord bot online         (purple #5865f2)
14:32:17 | [STRIPE] - Payment successful          (blue #635bff)
14:32:17 | [CUSTOM] - Pretty pink message         (pink rgb(255,100,150))
14:32:17 | [DEPLOY] - Deployment started          (teal #00d4aa)
14:32:17 | [BUILD] - Build completed              (orange #ff9500)
14:32:17 | [TEST] - All tests passing             (green #34c759)
```

### 🧹 `bunnyLog` vs `BunnyLogger` - When to Use Which

#### Use `bunnyLog` (Singleton) for Simple Apps
```javascript
import { bunnyLog } from 'bunny-log';

// Ready to use immediately - one shared logger for your entire app
bunnyLog.log("info", "App starting");
bunnyLog.hex("api", "#00d4aa").log("api", "API ready");

// Global state - categories persist across modules
```

#### Use `BunnyLogger` (Class) for Complex Apps
```javascript
import { BunnyLogger } from 'bunny-log';

// Create isolated loggers for different services
const apiLogger = BunnyLogger.clean()  // No default categories
  .hex("request", "#00b4d8")
  .hex("response", "#90e0ef")
  .hex("error", "#ef476f");

const gameLogger = new BunnyLogger(false)  // Clean start
  .hex("player", "#00ff00")
  .hex("enemy", "#ff0000")
  .hex("item", "#ffff00");

// Each logger has its own categories and settings
apiLogger.log("request", "GET /api/users");
gameLogger.log("player", "Player joined the game");

// Loggers are completely independent
console.log("API categories:", apiLogger.getCategories());
console.log("Game categories:", gameLogger.getCategories());
```

**Output:**
```
14:32:18 | [REQUEST] - GET /api/users              (blue #00b4d8)
14:32:18 | [PLAYER] - Player joined the game      (green #00ff00)
API categories: [ "request", "response", "error" ]
Game categories: [ "player", "enemy", "item" ]
```

### ⏰ Time Format Configuration

```javascript
// Default is 24-hour format with seconds
bunnyLog.log("info", "Default 24h format with seconds");

// Switch to 12-hour format
bunnyLog.use12HourFormat();
bunnyLog.log("info", "Now using 12h format");

// Hide seconds from timestamps
bunnyLog.hideSecondsInTime();
bunnyLog.log("info", "12h format without seconds");

// Show seconds again
bunnyLog.showSecondsInTime();
bunnyLog.log("info", "12h format with seconds");

// Switch back to 24-hour format
bunnyLog.use24HourFormat();
bunnyLog.log("info", "Back to 24h format");

// Chain time format with text coloring
bunnyLog
  .setTimeFormat('12h')
  .setShowSeconds(false)
  .enableTextColor();
bunnyLog.hex("time", "#FFD700").log("time", "Chained: 12h, no seconds, colored text");

// Check current settings
console.log("Current format:", bunnyLog.getTimeFormat());
console.log("Show seconds:", bunnyLog.getShowSeconds());
console.log("Text coloring:", bunnyLog.getTextColor());
```

**Output:**
```
14:32:20 | [INFO] - Default 24h format with seconds
2:32:20 PM | [INFO] - Now using 12h format
2:32 PM | [INFO] - 12h format without seconds
2:32:20 PM | [INFO] - 12h format with seconds
14:32:20 | [INFO] - Back to 24h format
2:32 PM | [TIME] - Chained: 12h, no seconds, colored text    (gold text)
Current format: 24h
Show seconds: true
Text coloring: false
```

### 📊 Tables

```javascript
// Simple table using console.table
const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" }
];

bunnyLog.table(users);
bunnyLog.table(users, { columns: ["name", "role"] }); // Filter columns

// Advanced tables with formatting
import { Table, FORMAT_UNICODE } from 'bunny-log';

const table = new Table();
table.setFormat(FORMAT_UNICODE);

await table.setTitle(["Service", "Status", "Uptime"]);
await table.addRows([
  ["API Gateway", "Online", "99.9%"],
  ["Database", "Online", "99.8%"],
  ["Cache", "Warning", "98.5%"]
]);

console.log(table.render(true)); // With colors
```

**Output:**
```
14:32:18 | [TABLE] -
┌───┬────┬───────┬───────┐
│   │ id │ name  │ role  │
├───┼────┼───────┼───────┤
│ 0 │ 1  │ Alice │ admin │
│ 1 │ 2  │ Bob   │ user  │
└───┴────┴───────┴───────┘

╔═════════════╤════════╤═══════╗
║ Service     │ Status │ Uptime║
╠═════════════╪════════╪═══════╣
║ API Gateway │ Online │ 99.9% ║
║ Database    │ Online │ 99.8% ║
║ Cache       │Warning │ 98.5% ║
╚═════════════╧════════╧═══════╝
```

### 🔧 Dynamic Management

```javascript
// Get available categories
console.log(bunnyLog.getCategories());

// Change colors dynamically
bunnyLog.setHex("info", "#ff6b35");  // Change to orange
bunnyLog.log("info", "Now orange!");

// Remove categories
bunnyLog.removeCategory("old-category");
```

**Output:**
```
[ "info", "success", "warn", "error", "server", "database", "api" ]
14:32:19 | [INFO] - Now orange!                   (orange #ff6b35)
```

### 🔗 Advanced Method Chaining

```javascript
// Chain methods after logging!
bunnyLog
  .log("info", "Starting app")
  .setHex("info", "#ff6b35")
  .log("info", "Now orange!");

// Create and immediately use categories
bunnyLog
  .hex("deploy", "#00d4aa")
  .log("deploy", "Starting deployment")
  .setTimeFormat("12h")
  .hideSecondsInTime()
  .enableTextColor()
  .log("deploy", "Deployment complete");

// Complex chaining with auto-created categories
bunnyLog
  .log("bruh", "Bruh moment")
  .setHex("bruh", "#ff0000")
  .log("bruh", "Now in red")
  .use12HourFormat()
  .log("bruh", "With 12h format");

// Chain with custom loggers
const gameLogger = BunnyLogger.clean()
  .hex("player", "#00ff00")
  .log("player", "Player joined")
  .setShowSeconds(false)
  .enableTextColor()
  .log("player", "Game started");
```

**Output:**
```
14:32:21 | [INFO] - Starting app
14:32:21 | [INFO] - Now orange!                   (orange #ff6b35)
14:32:21 | [DEPLOY] - Starting deployment         (teal #00d4aa)
2:32 PM | [DEPLOY] - Deployment complete         (teal text, 12h, no seconds)
14:32:21 | [BRUH] - Bruh moment
14:32:21 | [BRUH] - Now in red                    (red #ff0000)
2:32:21 PM | [BRUH] - With 12h format             (red, 12h format)
14:32 | [PLAYER] - Player joined                 (green, no seconds)
14:32 | [PLAYER] - Game started                  (green text, no seconds)
```

## 🛠️ Development

### Building with Bun

```bash
# Install dependencies
bun install

# Build the package
bun run build

# Run examples
bun run dev

# Test build
bun run test
```

### Project Structure

```
bunny-log/
├── src/
│   ├── index.js          # Main entry point
│   ├── bunnyLog.js       # Core logger class
│   ├── table/            # Advanced table system
│   │   └── index.js
│   └── types/
│       └── index.d.ts    # TypeScript declarations
├── dist/                 # Built files (generated)
├── build.js              # Custom build script
├── package.json
└── README.md
```

### Build Process

The custom `build.js` script:
1. Cleans the `dist` directory
2. Copies JavaScript files maintaining structure
3. Copies TypeScript declarations
4. Preserves module imports/exports

## 📝 API Reference

### `bunnyLog` (Singleton Instance)

```javascript
import { bunnyLog } from 'bunny-log';

// Ready to use immediately - no setup needed
bunnyLog.log(category, message, ...args)
bunnyLog.hex(category, hexColor)
bunnyLog.rgb(category, r, g, b)
bunnyLog.setHex(category, hexColor)
bunnyLog.setColor(category, color)
bunnyLog.removeCategory(category)
bunnyLog.getCategories()
bunnyLog.table(data, options)

// Time format methods
bunnyLog.setTimeFormat('12h' | '24h')
bunnyLog.getTimeFormat()
bunnyLog.use12HourFormat()
bunnyLog.use24HourFormat()
bunnyLog.getTimestamp()

// Seconds display methods
bunnyLog.setShowSeconds(boolean)
bunnyLog.getShowSeconds()
bunnyLog.showSecondsInTime()
bunnyLog.hideSecondsInTime()

// Text coloring methods
bunnyLog.setTextColor(boolean)
bunnyLog.getTextColor()
bunnyLog.enableTextColor()
bunnyLog.disableTextColor()

// Auto-created dynamic methods (via Proxy)
bunnyLog.log("info", message, ...args)      // Auto-created when first used
bunnyLog.log("anyCategory", message, ...args)  // Any name works!
```

### `BunnyLogger` Class

```javascript
import { BunnyLogger } from 'bunny-log';

// Constructor
new BunnyLogger(defaultCategories?: boolean)  // defaults to false

// All the same methods as bunnyLog singleton
const logger = new BunnyLogger(false);
logger.log(category, message, ...args)
logger.hex(category, hexColor)
// ... all other methods

// Static method for clean instances
BunnyLogger.clean()  // Same as new BunnyLogger(false)
```

### Smart Auto-Colors

When categories are auto-created, they get smart default colors:

- `info` → Blue
- `error` → Red
- `warn/warning` → Yellow
- `success` → Green
- `debug` → Magenta
- `server` → Cyan
- `database/db` → Bright Blue
- `api` → Bright Magenta
- Everything else → White

## 🎯 TypeScript Support

Full TypeScript support with auto-completion:

```typescript
import { bunnyLog, BunnyLogger } from 'bunny-log';

// TypeScript knows about the log method
bunnyLog.log("info", "Typed message");        // ✅ Auto-complete
bunnyLog.log("customCategory", "Works too");  // ✅ Also works

// Custom instances are fully typed
const logger: BunnyLogger = new BunnyLogger();
logger.log("any", "Fully typed");

// All methods return the logger for chaining
const result = bunnyLog
  .setTimeFormat("12h")      // ✅ Auto-complete
  .hideSecondsInTime()       // ✅ All methods available
  .hex("deploy", "#00d4aa")  // ✅ Full method suggestions
  .log("deploy", "Deployment")  // ✅ Consistent interface
  .enableTextColor()         // ✅ All configuration methods
  .log("success", "Complete!");  // ✅ Seamless chaining
```

## 🆚 `bunnyLog` vs `BunnyLogger` Summary

| Feature | `bunnyLog` (Singleton) | `BunnyLogger` (Class) |
|---------|----------------------|----------------------|
| **Setup** | Ready immediately | `new BunnyLogger()` |
| **Use Case** | Simple apps, global logging | Multiple services, isolation |
| **Categories** | Shared across app | Each instance has its own |
| **State** | Global state | Instance-specific state |
| **Import** | `import { bunnyLog }` | `import { BunnyLogger }` |

```javascript
// Simple apps - use bunnyLog
bunnyLog.log("info", "One logger for everything");

// Complex apps - use BunnyLogger
const apiLogger = new BunnyLogger(false);
const dbLogger = new BunnyLogger(false);
// Each has isolated categories and settings
```

## 📄 License

MIT © Hasiradoo - RabbitTale Studio

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

Made with ❤️ and 🐰 by the Hasiradoo - RabbitTale Studio
