#!/usr/bin/env node
import _ = require("lodash");

import fs = require("fs");
import path = require("path");
import { promisify } from "util";

import { getModuleTokens } from "./modules";
import { createTypeHint } from "./type-hint";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const exists = promisify(fs.exists);
const unlink = promisify(fs.unlink);

// tslint:disable no-console
export const makeCreateDTSFile = (options?: any) => async (filePath: string, source?: string) => {
    const target = `${filePath}.d.ts`;
    try {
        const payload = source || await readFile(filePath, "utf8");
        const tokens = await getModuleTokens(payload, filePath, options);
        if (!_.isEmpty(tokens)) {
            await writeFile(target, createTypeHint(tokens));
            return;
        }
        if (await exists(target)) {
            await unlink(target);
        }
    } catch (e) {
        console.log(`Error ${target} Message "${e.message}"`);
    }
};
// tslint:enable no-console
