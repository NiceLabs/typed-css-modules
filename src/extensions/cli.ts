import chokidar = require("chokidar");
import fs = require("fs");
import glob = require("glob");
import _ = require("lodash");
import path = require("path");
import { promisify } from "util";
import yargs = require("yargs");

import { createTypeHint } from "../type-hint";
import { getModuleNames } from "./postcss-plugin";

function createArgs() {
    const commands = [
        "Create .css.d.ts from CSS modules *.css files.",
        "Usage: $0 [options] <input directory>",
    ];
    const args = yargs.usage(commands, "");

    args.example("$0 src/styles", "");
    args.example("$0 src -o dist", "");
    args.example("$0 -p styles/**/*.icss -w", "");

    args.detectLocale(false);
    args.demand(["_"]);

    args.alias("c", "camelCase")
        .describe("c", "Convert CSS class tokens to camelcase")
        .default("c", false);

    args.alias("p", "pattern")
        .describe("p", "Glob pattern with css files")
        .default("p", "**/*.css");

    args.alias("w", "watch")
        .describe("w", "Watch input directory's css files or pattern")
        .boolean("w")
        .default("w", false);

    args.alias("m", "mode")
        .describe("m", "CSSModules working mode")
        .default("m", "local")
        .choices("m", ["local", "global"]);

    args.alias("h", "help")
        .help("h");

    args.version(require("../package.json").version);
    return args;
}

interface IOptions {
    mode: "local" | "global";
    camelCase: boolean;
    searchDirectory?: string;
    filesPattern?: string;
}

function makeCreateDTSFile(options: IOptions) {
    return async (filePath: string) => {
        const source = await promisify(fs.readFile)(filePath);
        const names = await getModuleNames(source.toString(), options);
        const dtsFile = createTypeHint(names);
        await promisify(fs.writeFile)(`${filePath}.d.ts`, dtsFile);
    };
}

// tslint:disable no-console object-literal-sort-keys
async function main() {
    const yarg = createArgs();
    const { argv } = yarg;
    if (argv.h) {
        yarg.showHelp();
        return;
    }
    const options: IOptions = {
        mode: argv.mode,
        camelCase: Boolean(argv.camelCase),
        searchDirectory: !_.isEmpty(argv._) ? _.first(argv._) : argv.p ? "." : undefined,
        filesPattern: argv.p || "**/*.css",
    };
    if (_.isUndefined(options.searchDirectory)) {
        yarg.showHelp();
        return;
    }
    const filesPattern = path.join(options.searchDirectory, options.filesPattern);

    const createDTSFile = makeCreateDTSFile(options);
    if (argv.w === true) {
        console.log(`Watch ${filesPattern}...`);

        const watcher = chokidar.watch(filesPattern);
        watcher.on("add", createDTSFile);
        watcher.on("change", createDTSFile);
    } else {
        const files = await promisify(glob)(filesPattern);
        _.forEach(files, createDTSFile);
    }
}
// tslint:enable no-console object-literal-sort-keys

main();
