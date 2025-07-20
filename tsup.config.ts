import { defineConfig } from "tsup";
import { rmSync } from "fs";
import { join } from "path";
import { glob } from "glob";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  sourcemap: false,
  clean: true,
  splitting: true,
  target: "es2017",
  external: ["react", "react-dom", "_next/static/pagefind/pagefind.js"],
  minify: true,
  shims: true,
  banner: {
    js: '"use client";',
  },
  esbuildOptions(options) {
    options.jsx = "transform";
    options.preserveSymlinks = true;
    options.keepNames = true;
  },
  onSuccess: () => {
    const cssMaps = glob.sync("dist/**/*.css.map");
    cssMaps.forEach((file) => rmSync(join(process.cwd(), file)));
    return new Promise((resolve) => resolve(undefined));
  },
});
