import path from "path";
import { glob } from "glob";
import { writePrettyFile } from "./utils/svg.ts";

const ROOT = process.cwd();
const ICON_DIR = path.join(ROOT, "iconPack", "icons");
const OUT_INDEX = path.join(ROOT, "iconPack", "index.ts");

async function run() {
  const files = glob.sync("*.tsx", { cwd: ICON_DIR });
  const exports = files
    .map((f) => {
      const name = f.replace(/\.tsx$/, "");
      return `export { default as ${name} } from './icons/${name}';`;
    })
    .join("\n");
  await writePrettyFile(OUT_INDEX, exports, "babel-ts");
  console.log(`✅ index.ts generated with ${files.length} exports`);
}

run().catch(console.error);
