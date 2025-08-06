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
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const componentTemplate = (variables, { tpl }) => {
  return tpl`
import * as React from 'react';

interface Props extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

const ${variables.componentName} = React.forwardRef<SVGSVGElement, Props>(({ title, ...props }, ref) => (
  ${variables.jsx}
));

export default ${variables.componentName};
  `;
};

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

    const tsxCode = await transform(
      svgContent,
      {
        typescript: true,
        icon: true,
        ref: true,
        jsxRuntime: "automatic",
        template: componentTemplate,
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      },
      { componentName }
    );
    
    const outputFilePath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
    await fs.writeFile(outputFilePath, tsxCode, "utf8");
    
    console.log(`✅ ${componentName}.tsx generated successfully`);
    exportsList.push(componentName);
  }
  
  const indexContent = exportsList
    .map((name) => `export { default as ${name} } from './react/${name}';`)
    .join("\n");
    
  const indexFilePath = path.join(INDEX_DIR, "index.ts");
  await fs.writeFile(indexFilePath, indexContent, "utf8");
  
  console.log(`✅ index.ts generated successfully with ${exportsList.length} exports`);
}

generateIcons().catch(console.error);