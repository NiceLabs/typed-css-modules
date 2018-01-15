#!/usr/bin/env node
import chokidar = require("chokidar");
import fs = require("fs");
import glob = require("glob");
import _ = require("lodash");
import path = require("path");
import { promisify } from "util";
import yargs = require("yargs");

import { makeCreateDTSFile } from "../utils";

function createArgs() {
    const commands = [
        "Create .css.d.ts from CSS modules *.css files.",
        "Usage: $0 [options] <input directory>",
    ];
    // tslint:disable max-line-length
    return yargs
        .usage(commands.join("\n"))
        .example("$0 src/styles", "")
        .example("$0 src -o dist", "")
        .example("$0 -p styles/**/*.icss -w", "")
        .detectLocale(false)
        .demand(["_"])
        .alias("c", "camelCase").describe("c", "Convert CSS class tokens to camelcase").boolean("c")
        .alias("p", "pattern").describe("p", "Glob pattern with css files").default("p", "./src/**/*.css")
        .alias("w", "watch").describe("w", "Watch input directory's css files or pattern").boolean("w")
        .alias("m", "mode").describe("m", "Workmode").choices("m", ["local", "global"]).default("m", "local")
        .alias("h", "help").help("h")
        .version(require("../../package.json").version);
    // tslint:enable max-line-length
}

interface IOptions {
    mode?: "local" | "global";
    camelCase?: boolean;
    searchDirectory?: string;
    filesPattern?: string;
}

// tslint:disable no-console object-literal-sort-keys
async function main() {
    const yarg = createArgs();
    const { argv } = yarg;

    if (argv.help) {
        yarg.showHelp();
        return;
    }

    const options: IOptions = {
        mode: argv.mode,
        camelCase: Boolean(argv.camelCase),
        searchDirectory: !_.isEmpty(argv._) ? _.first(argv._) : argv.pattern ? "." : undefined,
        filesPattern: argv.pattern,
    };

    if (_.isUndefined(options.searchDirectory)) {
        yarg.showHelp();
        return;
    }

    const filesPattern = path.join(options.searchDirectory, options.filesPattern);

    const createDTSFile = makeCreateDTSFile(options);

    if (argv.watch) {
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
