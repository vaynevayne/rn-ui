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
];

const onwarn = (warning, rollupWarn) => {
  rollupWarn(warning);
};

const deps = [
  ...Object.keys(packageJson.dependencies ?? {}),
  ...Object.keys(packageJson.peerDependencies ?? {}),
];

console.log("deps", cwd(), import.meta.url);
const external = new RegExp(`^(${deps.join("|")})`);

const emsConfig = defineConfig({
  input: Object.fromEntries(
    globSync("src/**/*.{ts,tsx}").map((file) => {
      console.log(
        "+++",
        path.relative(
          "src",
          file.slice(0, file.length - path.extname(file).length)
        ),
        path.resolve(cwd(), file)
      );
      return [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative(
          "src",
          file.slice(0, file.length - path.extname(file).length)
        ),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        path.resolve(cwd(), file),
      ];
    })
  ), // 跟单入口 src/index.ts 生成的文件一样, why? esbuild的原因吗?
  output: {
    format: "es",
    exports: "named",
    entryFileNames: "[name].mjs",
    dir: path.resolve(cwd(), "dist/esm"),
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
  input: Object.fromEntries(
    globSync("src/**/*.{ts,tsx}").map((file) => {
      return [
        // 这里将删除 `src/` 以及每个文件的扩展名。
        // 因此，例如 src/nested/foo.js 会变成 nested/foo
        path.relative(
          "src",
          file.slice(0, file.length - path.extname(file).length)
        ),
        // 这里可以将相对路径扩展为绝对路径，例如
        // src/nested/foo 会变成 /project/src/nested/foo.js
        path.resolve(cwd(), file),
      ];
    })
  ),
  output: {
    format: "cjs",
    exports: "named",
    entryFileNames: "[name].cjs",
    dir: path.resolve(cwd(), "dist/cjs"),
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
