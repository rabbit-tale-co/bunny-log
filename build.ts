#!/usr/bin/env bun
import { $ } from "bun";
import { existsSync } from "fs";
import { mkdir, copyFile, writeFile } from "fs/promises";

console.log("🐰 Building bunny-log...");

// Clean and create dist directory
if (existsSync("dist")) {
  await $`rm -rf dist`;
}
await mkdir("dist", { recursive: true });

console.log("📦 Building JavaScript files...");

// Build main index.js
await $`bun build src/index.js --outdir ./dist --target node --minify`;

console.log("📝 Copying TypeScript declarations...");

console.log("✅ Build completed successfully!");
console.log("📁 Output:");
console.log("  - dist/index.js (main module)");
console.log("  - index.d.ts (TypeScript declarations)");
