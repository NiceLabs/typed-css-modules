import chokidar = require("chokidar");
import fs = require("fs");
import _ = require("lodash");
import { promisify } from "util";
import webpack = require("webpack");

import { makeCreateDTSFile } from "../utils";

export interface IPluginOptions {
    mode?: "local" | "global";
    camelCase?: boolean;
    filesPattern?: string | string[];
}

export default class TypedCSSModulesPlugin implements webpack.Plugin {
    private options: IPluginOptions = {
        camelCase: false,
        filesPattern: ["**/*.css", "**/*.less", "**/*.scss"],
        mode: "global",
    };

    public constructor(options?: IPluginOptions) {
        this.options = _.defaults(options, this.options);
    }

    public apply(compiler: webpack.Compiler) {
        const createDTSFile = makeCreateDTSFile();

        const watcher = chokidar.watch(this.options.filesPattern);
        compiler.plugin("compile", () => {
            watcher.on("add", createDTSFile);
            watcher.on("change", createDTSFile);
        });
        compiler.plugin("done", () => {
            watcher.close();
        });
        return;
    }
}
