import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import prettier from "prettier";
import { glob } from "glob";

export async function readSvgFiles(dir: string) {
  const files = glob.sync("**/*.svg", { cwd: dir, absolute: true });
  const data = await Promise.all(
    files.map(async (fp) => {
      const content = await fs.readFile(fp, "utf8");
      const base = path.basename(fp, ".svg");
      return { path: fp, base, content };
    })
  );
  return data;
}

export function md5(input: string) {
  return crypto.createHash("md5").update(input).digest("hex");
}

export async function writePrettyFile(
    filePath: string,
    code: string,
    parser = "babel-ts"
  ) {
    let formatted = code;
    try {
      formatted = await prettier.format(code, { parser });
    } catch (e) {
      // اگر prettier خطا داد، فایل را بدون فرمت هم بنویس
    }
  
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, formatted, "utf8");
  }
  
