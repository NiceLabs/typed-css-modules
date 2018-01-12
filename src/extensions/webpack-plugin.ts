import chokidar = require("chokidar");
import fs = require("fs");
import _ = require("lodash");
import { promisify } from "util";
import webpack = require("webpack");

import { createTypeHint } from "../type-hint";
import { getModuleNames } from "./postcss-plugin";

export interface IOptions {
    mode: "local" | "global";
    camelCase: boolean;
    filesPattern: string | string[];
}

export default class TypedCSSModulesPlugin implements webpack.Plugin {
    private options: IOptions;

    public constructor(options: IOptions) {
        this.options = _.defaults(options, {
            filesPattern: "**/*.css",
        });
    }

    public apply(compiler: webpack.Compiler) {
        const watcher = chokidar.watch(this.options.filesPattern);
        compiler.plugin("compile", () => {
            watcher.on("add", this.createDTSFile);
            watcher.on("change", this.createDTSFile);
        });
        compiler.plugin("done", () => {
            watcher.close();
        });
        return;
    }

    private async createDTSFile(path: string) {
        const source = await promisify(fs.readFile)(path);
        const names = await getModuleNames(source.toString(), this.options);
        const dtsFile = createTypeHint(names);
        await promisify(fs.writeFile)(`${path}.d.ts`, dtsFile);
    }
}
