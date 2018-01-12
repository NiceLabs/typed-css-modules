import _ = require("lodash");

import Tokenizer = require("css-selector-tokenizer");

export interface IOptions {
    mode: "local" | "global";
    camelCase: boolean;
}

export const getModuleNames = (selector: string, options: IOptions): string[] => {
    options = _.defaults(options, { mode: "global", camelCase: false });
    const isValid = (
        _.isString(selector) &&
        !_.isEmpty(selector) &&
        _.includes(["local", "global"], options.mode)
    );
    if (!isValid) {
        return [];
    }
    return _.chain(Tokenizer.parse(selector).nodes)
        .flatMap((token) => getNames(token, options.mode, []))
        .map(makeNameMethod(options.camelCase))
        .value();
};

const getNames = (node: Tokenizer.Node, mode: string, names: string[]): string[] => {
    if (node.name === "local" || node.name === "global") {
        if (node.type === "pseudo-class") {
            mode = node.name;
        }
        if (node.type === "nested-pseudo-class") {
            return getNames(node.nodes[0], node.name, names);
        }
    }
    if (mode === "local" && (node.type === "id" || node.type === "class")) {
        names = _.union(names, [node.name]);
    }
    if (Array.isArray(node.nodes)) {
        return _.flatMap(node.nodes, (token) => getNames(token, mode, names));
    }
    return names;
};

const makeNameMethod = (camelCase: boolean) => (
    camelCase
        ? _.camelCase
        : _.identity
);
