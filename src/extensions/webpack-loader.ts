import fs = require("fs");
import { getOptions } from "loader-utils";
import _ = require("lodash");
import ts = require("typescript");
import { promisify } from "util";
import webpack = require("webpack");

import { createTypeHint } from "../type-hint";
import { makeCreateDTSFile } from "../utils";

export default function loader(this: webpack.loader.LoaderContext, source: string, sourceMap: string | Buffer) {
    this.cacheable();

    const callback = this.async();
    const createDTSFile = makeCreateDTSFile();

    createDTSFile(this.resourcePath, source)
        .then(() => callback(undefined, source, sourceMap))
        .catch((err) => callback(err));
}
