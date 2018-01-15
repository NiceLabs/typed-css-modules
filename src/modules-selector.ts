import _ = require("lodash");

import Tokenizer = require("css-selector-tokenizer");

export interface ISelectorOptions {
    mode?: "local" | "global";
    camelCase?: boolean;
}

export function getModuleTokensWithSelector(selector: string, options?: ISelectorOptions) {
    options = _.defaults(options, { mode: "local", camelCase: false });
    return _.chain(Tokenizer.parse(selector).nodes)
        .flatMap((token) => getTokens(token, options.mode, []))
        .map(options.camelCase ? _.camelCase : _.identity)
        .value();
}

const validMode = (mode: string) => _.includes(["local", "global"], mode);

const getTokens = ({ name, type, nodes }: Tokenizer.Node, mode: string, tokens: string[]): string[] => {
    let nextMode = mode;
    let nextTokens = tokens;
    if (validMode(name)) {
        if (type === "pseudo-class") {
            nextMode = name;
        }
        if (type === "nested-pseudo-class") {
            return getTokens(nodes[0], name, tokens);
        }
    }
    if (mode === "local" && ["id", "class"].includes(type)) {
        nextTokens = _.union(tokens, [name]);
    }
    if (_.isArray(nodes)) {
        return _.flatMap(nodes, (node) => getTokens(node, nextMode, nextTokens));
    }
    return nextTokens;
};
