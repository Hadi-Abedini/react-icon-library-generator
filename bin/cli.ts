#!/usr/bin/env bun
/**
 * CLI entrypoint for react-icon-gen
 * Goal: User runs this in a folder containing SVG/PNG files (or provides a folder path).
 * Output will be generated in 'iconPack' folder in the current working directory.
 */

import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// --- Determine current script folder inside the package ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Scripts folder inside the npm package
const SCRIPTS_DIR = path.join(__dirname, "../scripts");

// Current working directory of the user
const ROOT = process.cwd();

// Input folder for SVG/PNG files (from argument or default to cwd)
const INPUT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : ROOT;
const OUTPUT_DIR = path.join(ROOT, "iconPack");

// Check if input folder exists
if (!fs.existsSync(INPUT_DIR)) {
  console.error(`❌ Input folder does not exist: ${INPUT_DIR}`);
  process.exit(1);
}

// Check if 'iconPack' folder exists, create if not
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log("📦 'iconPack' folder created in current directory.");
} else {
  console.log("📦 'iconPack' folder already exists, continuing...");
}

// Helper function to run scripts
function runScript(scriptPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("bun", [scriptPath, INPUT_DIR, OUTPUT_DIR], {
      stdio: "inherit",
      cwd: ROOT,
    });
    child.on("close", (code) => {
      if (code !== 0)
        reject(new Error(`${scriptPath} failed with exit code ${code}`));
      else resolve();
    });
  });
}

// Run all scripts sequentially
(async () => {
  try {
    console.log("🚀 Starting icon generation...");
    console.log(`📂 Reading SVG/PNG files from: ${INPUT_DIR}`);

    await runScript(path.join(SCRIPTS_DIR, "generate-components.ts"));
    await runScript(path.join(SCRIPTS_DIR, "generate-index.ts"));
    await runScript(path.join(SCRIPTS_DIR, "generate-iconmap.ts"));
    await runScript(path.join(SCRIPTS_DIR, "generate-preview.ts"));

    console.log("🎉 All steps completed successfully!");
    console.log(`📂 Check your generated icons in: ${OUTPUT_DIR}`);
  } catch (err: any) {
    console.error("❌ Error occurred while running scripts:", err.message);
    process.exit(1);
  }
})();
