import _ = require("lodash");

import Tokenizer = require("css-selector-tokenizer");

export interface ISelectorOptions {
    mode?: "local" | "global";
    camelCase?: boolean;
}

const validMode = (mode: string) => _.includes(["local", "global"], mode);

const getTokens = ({ name, type, nodes }: Tokenizer.Node, mode: string, names: string[]): string[] => {
    let nextMode = mode;
    if (validMode(name)) {
        if (type === "pseudo-class") {
            nextMode = name;
        }
        if (type === "nested-pseudo-class") {
            return getTokens(nodes[0], name, names);
        }
    }
    if (mode === "local" && ["id", "class"].includes(name)) {
        names = _.union(names, [name]);
    }
    if (_.isArray(nodes)) {
        return _.flatMap(nodes, (token) => getTokens(token, nextMode, names));
    }
    return names;
};

export function getModuleTokensWithSelector(selector: string, options?: ISelectorOptions) {
    options = _.defaults(options, { mode: "global", camelCase: false });
    const isValid = _.isString(selector) && !_.isEmpty(selector) && validMode(options.mode);
    if (!isValid) {
        return [];
    }
    return _.chain(Tokenizer.parse(selector).nodes)
        .flatMap((token) => getTokens(token, options.mode, []))
        .map(options.camelCase ? _.camelCase : _.identity)
        .value();
}
