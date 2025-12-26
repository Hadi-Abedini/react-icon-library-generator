import path from "path";
import fs from "fs/promises";
import { transform } from "@svgr/core";
import { readSvgFiles, md5, writePrettyFile } from "./utils/svg.ts";

const INPUT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(process.cwd(), "src", "icons");
const OUTPUT_DIR = process.argv[3]
  ? path.resolve(process.argv[3], "icons")
  : path.join(process.cwd(), "iconPack", "icons");

function toPascalCase(str: string) {
  return str
    .split(/[-_ ]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

function svgoCleanPlugin() {
  return {
    name: "clean-icon",
    fn: () => ({
      element: {
        enter: (node: any) => {
          if (!node?.attributes) return;
          delete node.attributes.fill;
          delete node.attributes.stroke;
          delete node.attributes["fill-opacity"];
          delete node.attributes["stroke-opacity"];
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
    if (prevHash === hash) continue;

    const componentName = `${toPascalCase(svg.base)}Icon`;

    const jsxCode = await transform(
      svg.content,
      {
        typescript: false,
        jsxRuntime: "automatic",
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  removeViewBox: false,
                  convertColors: false,
                },
              },
            },
            svgoCleanPlugin(),
          ],
        },
      },
      { componentName: "SvgTemp" }
    );

    const svgMatch = jsxCode.match(/<svg[\s\S]*?<\/svg>/);
    if (!svgMatch) {
      console.warn(`Could not extract SVG content from ${svg.base}`);
      continue;
    }

    let svgContent = svgMatch[0];

    svgContent = svgContent
      .replace(/\s+width=["'][^"']*["']/g, "")
      .replace(/\s+height=["'][^"']*["']/g, "")
      .replace(/\s+fill=["'][^"']*["']/g, "")
      .replace(/\s+fill-opacity=["'][^"']*["']/g, "")
      .replace(/\s+stroke=["'][^"']*["']/g, "")
      .replace(/\s+stroke-opacity=["'][^"']*["']/g, "");

    svgContent = svgContent
      .replace(/fill-rule=/g, "fillRule=")
      .replace(/clip-rule=/g, "clipRule=")
      .replace(/stroke-width=/g, "strokeWidth=")
      .replace(/stroke-linecap=/g, "strokeLinecap=")
      .replace(/stroke-linejoin=/g, "strokeLinejoin=")
      .replace(/stroke-miterlimit=/g, "strokeMiterlimit=");

    const finalCode = `import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
  size?: number | string;
}

const ${componentName} = React.forwardRef<SVGSVGElement, IconProps>(
  ({ title, size = 24, ...props }, ref) => (
    ${svgContent
      .replace(
        /<svg/,
        '<svg\n      ref={ref}\n      width={size}\n      height={size}\n      fill="currentColor"\n      aria-hidden={!title}\n      focusable="false"\n      {...props}'
      )
      .replace(
        /<svg([^>]*)>/,
        (match) => `${match}\n      {title && <title>{title}</title>}`
      )}
  )
);

${componentName}.displayName = "${componentName}";

export default ${componentName};
`;

    const outPath = path.join(OUTPUT_DIR, `${componentName}.tsx`);
    await writePrettyFile(outPath, finalCode, "babel-ts");
    await fs.writeFile(cacheFile, hash, "utf8");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
