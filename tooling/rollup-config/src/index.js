import { defineConfig } from "rollup";
import resolvePlugin from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { cwd } from "process";
import { globSync } from "glob";
import path from "node:path";
import { readFileSync } from "fs";
import esbuild from "rollup-plugin-esbuild";
import image from "@rollup/plugin-image";

const packageJson = JSON.parse(
  readFileSync(path.resolve(cwd(), "./package.json"))
);

const isProd = process.env.NODE_ENV === "production";

const defaultPlugins = [
  resolvePlugin(),
  image(),
  commonjs({
    include: /node_modules/,
  }),
  {
    name: "@rollup-plugin/remove-empty-chunks",
    generateBundle(_, bundle) {
      for (const [name, chunk] of Object.entries(bundle)) {
        if (chunk.type === "chunk" && chunk.code.length === 0) {
          delete bundle[name];
        }
      }
    },
  },
];

const onwarn = (warning, rollupWarn) => {
  rollupWarn(warning);
};

const deps = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
];

const external = new RegExp(`^(${deps.join("|")})`);

const emsConfig = defineConfig({
  input: globSync("src/**/*.{ts,tsx}"), // 跟单入口 src/index.ts 生成的文件一样, why? esbuild的原因吗?
  output: {
    format: "es",
    exports: "named",
    entryFileNames: "[name].mjs",
    dir: path.resolve(cwd(), "dist/esm"),
    preserveModules: true,
  },
  onwarn,
  external,
  plugins: [
    ...defaultPlugins,
    esbuild({
      sourceMap: true,
      tsconfig: path.resolve(cwd(), "tsconfig.json"),
      // minify: process.env.NODE_ENV === "production",
    }),
  ],
});

const cjsConfig = defineConfig({
  input: globSync("src/**/*.{ts,tsx}"),
  output: {
    format: "cjs",
    exports: "named",
    entryFileNames: "[name].cjs",
    dir: path.resolve(cwd(), "dist/cjs"),
    preserveModules: true,
  },
  onwarn,
  external,
  plugins: [
    ...defaultPlugins,
    esbuild({
      sourceMap: true,
      tsconfig: path.resolve(cwd(), "tsconfig.json"),
      // minify: process.env.NODE_ENV === "production",
    }),
  ],
});

export default isProd ? [emsConfig, cjsConfig] : emsConfig;
