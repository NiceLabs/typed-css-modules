#!/usr/bin/env node
import _ = require("lodash");

import fs = require("fs");
import { promisify } from "util";

import { getModuleNames } from "./modules";
import { createTypeHint } from "./type-hint";

export function makeCreateDTSFile() {
    const readFile = promisify(fs.readFile);
    const writeFile = promisify(fs.writeFile);
    const exists = promisify(fs.exists);
    const unlink = promisify(fs.unlink);
    // tslint:disable no-console
    return async (filePath: string, source?: string) => {
        const target = `${filePath}.d.ts`;
        try {
            const tokens = await getModuleNames(
                source || await readFile(filePath, "utf8"),
            );

            if (!_.isEmpty(tokens)) {
                await writeFile(target, createTypeHint(tokens));
                console.log(`Updated ${target}`);
                return;
            }
            if (await exists(target)) {
                await unlink(target);
                console.log(`Deleted ${target}`);
            }
        } catch (e) {
            console.log(`Error ${target} Message "${e.message}"`);
        }
    };
    // tslint:enable no-console
}
