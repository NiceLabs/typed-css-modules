import fs = require("fs");
import _ = require("lodash");
import ts = require("typescript");
import { promisify } from "util";

import { createTypeHint } from "../type-hint";

export default function loader(source: string) {
    createTypeHintFile(getNames(source), `${this.resourcePath}.d.ts`);
    return source;
}

async function createTypeHintFile(names: string[], path: string) {
    if (_.isEmpty(names)) { return; }
    await promisify(fs.writeFile)(path, createTypeHint(names));
}

function getNames(source: string): string[] {
    return _.chain(ts.createSourceFile("", source, ts.ScriptTarget.Latest))
        .get("statements.0.expression.right.properties")
        .map<ts.Node, string>("name.text")
        .value();
}
