import { resolve } from "node:path";
import { RollupOptions } from "rollup";
import ts from "typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import pkg from "./package.json" assert { type: "json" };

const external = Object.keys(pkg.peerDependencies);

const isExternal = (moduleId: string) =>
    external.includes(moduleId) || external.some((e) => moduleId.startsWith(e));

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const babelTargets = "last 2 years";

const input = "src/index.ts";

const config: RollupOptions = {
    input: input,
    output: [
        {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
    ],
    external: isExternal,
    plugins: [
        babel({
            extensions,
            babelHelpers: "bundled",
            presets: [
                ["babel-preset-solid", {}],
                "@babel/preset-typescript",
                ["@babel/preset-env", { bugfixes: true, targets: babelTargets }],
            ],
        }),
        nodeResolve({ extensions }),
        terser(),
        {
            name: "ts",
            buildEnd() {
                const program = ts.createProgram([resolve("src/index.ts")], {
                    target: ts.ScriptTarget.ESNext,
                    module: ts.ModuleKind.ESNext,
                    moduleResolution: ts.ModuleResolutionKind.Node10,
                    jsx: ts.JsxEmit.Preserve,
                    jsxImportSource: "solid-js",
                    allowSyntheticDefaultImports: true,
                    esModuleInterop: true,
                    outDir: `dist/source`,
                    declarationDir: `dist/types`,
                    declaration: true,
                    allowJs: true,
                });

                program.emit();
            },
        },
    ],
};

export default config;
