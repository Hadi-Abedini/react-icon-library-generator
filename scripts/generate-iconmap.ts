import path from "path";
import { glob } from "glob";
import { writePrettyFile } from "./utils/svg.ts";

const OUTPUT_DIR = process.argv[3]
  ? path.resolve(process.argv[3], "icons")
  : path.join(process.cwd(), "iconPack", "icons");
const OUT_FILE = process.argv[3]
  ? path.resolve(process.argv[3], "iconMap.ts")
  : path.join(process.cwd(), "iconPack", "iconMap.ts");

function toKebab(name: string) {
  return name
    .replace(/Icon$/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

async function run() {
  const files = glob.sync("*.tsx", { cwd: OUTPUT_DIR });
  const imports = files.map((f) => f.replace(/\.tsx$/, ""));
  const importLine = `import { ${imports.join(", ")} } from './index';`;
  const mapEntries = files
    .map((f) => {
      const comp = f.replace(/\.tsx$/, "");
      const key = toKebab(comp);
      return `  '${key}': ${comp},`;
    })
    .join("\n");
  const content = `${importLine}\n\nexport const iconMap = {\n${mapEntries}\n} as const;\n\nexport type IconName = keyof typeof iconMap;`;
  await writePrettyFile(OUT_FILE, content, "babel-ts");
}

run().catch(console.error);
