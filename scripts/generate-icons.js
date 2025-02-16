import { fileURLToPath } from "url";
import path from "path";
import fs from "fs-extra";
import { transform } from "@svgr/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.resolve(__dirname, "../src/icons/svg");
const OUTPUT_DIR = path.resolve(__dirname, "../src/icons/react");
const INDEX_DIR = path.resolve(__dirname, "../src/icons");

function toPascalCase(str) {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

async function generateIcons() {
  await fs.ensureDir(OUTPUT_DIR);
  await fs.ensureDir(INDEX_DIR);

  const files = await fs.readdir(INPUT_DIR);
  const exportsList = [];

  for (const file of files) {
    if (!file.endsWith(".svg")) continue;

    const filePath = path.join(INPUT_DIR, file);
    const svgContent = await fs.readFile(filePath, "utf8");

    const baseName = path.basename(file, ".svg");
    const componentName = toPascalCase(baseName) + "Icon";

    const jsCode = await transform(
      svgContent,
      { icon: true, typescript: true },
      { componentName }
    );

    const componentCode = `
import * as React from 'react';

const ${componentName} = React.forwardRef(({ title, titleId, ...props }, ref) => (
  ${jsCode.replace("<svg", "<svg ref={ref}")}
));

export default ${componentName};
    `;

    const outputFilePath = path.join(OUTPUT_DIR, `${componentName}.js`);
    await fs.writeFile(outputFilePath, componentCode, "utf8");
    console.log(`✅ ${componentName} generated successfully`);
    exportsList.push(componentName);
  }

  const indexContent = exportsList
    .map(name => `export { default as ${name} } from './react/${name}.js';`)
    .join('\n');
  const indexFilePath = path.join(INDEX_DIR, "index.js");
  await fs.writeFile(indexFilePath, indexContent, "utf8");
  console.log(`✅ index.js generated successfully with ${exportsList.length} exports`);
}

generateIcons().catch(console.error);
