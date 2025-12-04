import path from "path";
import { glob } from "glob";
import { writePrettyFile } from "./utils/svg.ts";

const OUTPUT_DIR = process.argv[3]
  ? path.resolve(process.argv[3], "icons")
  : path.join(process.cwd(), "iconPack", "icons");
const OUT_INDEX = process.argv[3]
  ? path.resolve(process.argv[3], "index.ts")
  : path.join(process.cwd(), "iconPack", "index.ts");

async function run() {
  const files = glob.sync("*.tsx", { cwd: OUTPUT_DIR });
  const exports = files
    .map((f) => {
      const name = f.replace(/\.tsx$/, "");
      return `export { default as ${name} } from './icons/${name}';`;
    })
    .join("\n");
  await writePrettyFile(OUT_INDEX, exports, "babel-ts");
}

run().catch(console.error);
