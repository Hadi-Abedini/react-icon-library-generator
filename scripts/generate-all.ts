import { spawnSync } from "child_process";

function runScript(file: string) {
  console.log(`\n--- running ${file} ---`);
  const result = spawnSync("bun", ["run", "tsx", file], {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  if (result.status !== 0) {
    console.error(`${file} failed with status ${result.status}`);
    process.exit(result.status || 1);
  }
}

(async () => {
  runScript("scripts/generate-components.ts");
  runScript("scripts/generate-index.ts");
  runScript("scripts/generate-iconmap.ts");
  runScript("scripts/generate-preview.ts");
  console.log("\n✅ All generation steps finished");
})();
