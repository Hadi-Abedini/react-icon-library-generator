import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    cli: "bin/cli.ts",
    "scripts/generate-components": "scripts/generate-components.ts",
    "scripts/generate-index": "scripts/generate-index.ts",
    "scripts/generate-iconmap": "scripts/generate-iconmap.ts",
    "scripts/generate-preview": "scripts/generate-preview.ts",
    "scripts/utils/svg": "scripts/utils/svg.ts",
  },
  outDir: "dist",
  format: "esm",
  target: "node18",
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  minify: true,
});
