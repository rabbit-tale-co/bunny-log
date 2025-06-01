# 🐰 BunnyLog

Beautiful console logging with auto-categories, hex colors, and advanced tables.

![npm version](https://img.shields.io/npm/v/bunny-log)
![license](https://img.shields.io/npm/l/bunny-log)
![downloads](https://img.shields.io/npm/dm/bunny-log)

## ✨ Features

- 🪄 **Auto-Categories** - Use any category name, automatically created via Proxy
- 🎨 **Hex Colors** - Easy hex color support with `.hex(category, "#color")`
- 🔗 **Chainable** - Fluent API with method chaining
- 📊 **Advanced Tables** - Beautiful Unicode tables with multiple formats
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

### Basic Logging (Magic Auto-Categories!)

```javascript
import { bunnyLog } from 'bunny-log';

// Standard categories (with colors!)
bunnyLog.info("Application started");
bunnyLog.success("Database connected");
bunnyLog.warn("Memory usage high");
bunnyLog.error("Connection failed");

// 🪄 MAGIC: Any category name works - auto-created!
bunnyLog.discord("Bot is online");        // Auto-created!
bunnyLog.payment("Payment processed");    // Auto-created!
bunnyLog.auth("User authenticated");      // Auto-created!
bunnyLog.myCustomName("This just works!"); // Auto-created!
```

**Output:**
```
14:32:15 | [INFO] - Application started
14:32:15 | [SUCCESS] - Database connected
14:32:15 | [WARN] - Memory usage high
14:32:15 | [ERROR] - Connection failed
14:32:15 | [DISCORD] - Bot is online
14:32:15 | [PAYMENT] - Payment processed
14:32:15 | [AUTH] - User authenticated
14:32:15 | [MYCUSTOMNAME] - This just works!
```

### 🎨 Hex Colors (Super Easy!)

```javascript
// Add categories with beautiful hex colors
bunnyLog.hex("github", "#6cc644").github("GitHub webhook received");
bunnyLog.hex("discord", "#5865f2").discord("Discord bot online");
bunnyLog.hex("stripe", "#635bff").stripe("Payment successful");

// RGB colors work too!
bunnyLog.rgb("custom", 255, 100, 150).custom("Pretty pink message");

// Chainable for multiple categories
bunnyLog
  .hex("deploy", "#00d4aa")
  .hex("build", "#ff9500")
  .hex("test", "#34c759");

bunnyLog.deploy("Deployment started");
bunnyLog.build("Build completed");
bunnyLog.test("All tests passing");
```

**Output:**
```
14:32:16 | [GITHUB] - GitHub webhook received     (in green #6cc644)
14:32:16 | [DISCORD] - Discord bot online         (in purple #5865f2)
14:32:16 | [STRIPE] - Payment successful          (in blue #635bff)
14:32:16 | [CUSTOM] - Pretty pink message         (in pink rgb(255,100,150))
14:32:16 | [DEPLOY] - Deployment started          (in teal #00d4aa)
14:32:16 | [BUILD] - Build completed              (in orange #ff9500)
14:32:16 | [TEST] - All tests passing             (in green #34c759)
```

### 🧹 Custom Logger Instances

```javascript
import { BunnyLogger } from 'bunny-log';

// Clean logger without default categories
const apiLogger = BunnyLogger.clean()
  .hex("request", "#00b4d8")
  .hex("response", "#90e0ef")
  .hex("error", "#ef476f");

apiLogger.request("GET /api/users");
apiLogger.response("200 OK - Users fetched");

// Service-specific logger
const gameLogger = new BunnyLogger(false)  // No defaults
  .hex("player", "#00ff00")
  .hex("enemy", "#ff0000")
  .hex("item", "#ffff00");

gameLogger.player("Player joined the game");
```

**Output:**
```
14:32:17 | [REQUEST] - GET /api/users              (in blue #00b4d8)
14:32:17 | [RESPONSE] - 200 OK - Users fetched    (in light blue #90e0ef)
14:32:17 | [PLAYER] - Player joined the game      (in green #00ff00)
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

14:32:18 | [TABLE] -
┌───┬───────┬───────┐
│   │ name  │ role  │
├───┼───────┼───────┤
│ 0 │ Alice │ admin │
│ 1 │ Bob   │ user  │
└───┴───────┴───────┘

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
bunnyLog.info("Now orange!");

// Remove categories
bunnyLog.removeCategory("old-category");
```

**Output:**
```
[
  'info', 'success', 'warn', 'error', 'server',
  'database', 'api', 'discord', 'payment', 'auth'
]
14:32:19 | [INFO] - Now orange!                   (in orange #ff6b35)
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
│   │   └── index.js      # Advanced table system
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

### BunnyLogger Class

```javascript
// Constructor
new BunnyLogger(defaultCategories?: boolean)

// Methods
.log(category: string, ...args: any[]): void
.hex(category: string, hexColor: string): this
.rgb(category: string, r: number, g: number, b: number): this
.addCategory(category: string, color?: Chalk): this
.setColor(category: string, color: Chalk): this
.setHex(category: string, hexColor: string): this
.removeCategory(category: string): this
.getCategories(): string[]
.table(data: object[], options?: TableOptions): void

// Static
BunnyLogger.clean(): BunnyLogger
```

### Default Categories

- `info` - Blue
- `success` - Bright green
- `warn` - Orange
- `error` - Red
- `server` - Green
- `database` - Yellow
- `api` - Magenta

## 🎯 TypeScript Support

Full TypeScript support with auto-completion:

```typescript
import { bunnyLog, BunnyLogger } from 'bunny-log';

// TypeScript knows about default categories
bunnyLog.info("Typed message");        // ✅ Auto-complete
bunnyLog.customCategory("Works too");  // ✅ Also works

// Custom instances are fully typed
const logger: BunnyLogger = new BunnyLogger();
```

**Output:**
```
14:32:20 | [INFO] - Typed message
14:32:20 | [CUSTOMCATEGORY] - Works too
```

## 📄 License

MIT © [Your Name]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

---

Made with ❤️ and 🐰 by the Hasiradoo - RabbitTale Studio
