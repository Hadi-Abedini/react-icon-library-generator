import path from "path";
import fs from "fs/promises";
import { transform } from "@svgr/core";
import { readSvgFiles, md5, writePrettyFile } from "./utils/svg.ts";

const ROOT = path.resolve(process.cwd());
const INPUT_DIR = path.join(ROOT, "src", "icons");
const OUTPUT_DIR = path.join(ROOT, "iconPack", "icons");

function toPascalCase(str: string) {
  return str
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function svgoAddStrokePlugin() {
  return {
    name: "senet-stroke",
    fn: () => ({
      element: {
        enter: (node: any) => {
          if (!node || !node.attributes) return;
          delete node.attributes.fill;
          delete node.attributes.stroke;
          if (
            ["path", "circle", "rect", "line", "polyline", "polygon"].includes(
              node.name
            )
          ) {
            node.attributes["stroke-linecap"] =
              node.attributes["stroke-linecap"] || "round";
            node.attributes["stroke-linejoin"] =
              node.attributes["stroke-linejoin"] || "round";
          }
        },
      },
    }),
  };
}

async function run() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const svgs = await readSvgFiles(INPUT_DIR);
  const cacheDir = path.join(OUTPUT_DIR, ".cache");
  await fs.mkdir(cacheDir, { recursive: true });

  for (const svg of svgs) {
    const hash = md5(svg.content);
    const cacheFile = path.join(cacheDir, `${svg.base}.hash`);
    let prevHash: string | null = null;
    try {
      prevHash = await fs.readFile(cacheFile, "utf8");
    } catch {}
    if (prevHash === hash) {
      console.log(`⏭️ ${svg.base} unchanged, skipping`);
      continue;
    }

    const componentName = `${toPascalCase(svg.base)}Icon`;

    const tsx = await transform(
      svg.content,
      {
        typescript: true,
        icon: true,
        jsxRuntime: "automatic",
        svgo: true,
        svgProps: { fill: "currentColor", width: "{24}", height: "{24}" },
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: { overrides: { removeViewBox: false } },
            },
            { name: "removeAttrs", params: { attrs: "(fill|stroke)" } },
            svgoAddStrokePlugin(),
          ],
        },
        template: (variables: any, { tpl }: any) => {
          return tpl`
import * as React from "react";
interface Props extends React.SVGProps<SVGSVGElement> {
  title?: string;
  variant?: "filled" | "outlined";
}
const ${variables.componentName} = ({ title, variant = "outlined", ...props }: Props) => {
  // variant را می‌توان از بیرون ست کرد؛ در جداگانه سازی نهایی ممکن است دو فایل جدا بسازیم.
  return ${variables.jsx};
};
export default ${variables.componentName};
`;
        },
      },
      { componentName }
    );

    const outPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
    await writePrettyFile(outPath, tsx, "babel-ts");
    await fs.writeFile(cacheFile, hash, "utf8");
    console.log(`✅ ${componentName}.tsx generated`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
