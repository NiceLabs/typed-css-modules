import _ from "lodash";

import Tokenizer from "css-selector-tokenizer";

export interface ISelectorOptions {
    mode?: "local" | "global";
    camelCase?: boolean;
}

export function getModuleTokensWithSelector(selector: string, options?: ISelectorOptions) {
    options = _.defaults(options, { mode: "local", camelCase: false });
    return _.chain(Tokenizer.parse(selector).nodes)
        .flatMap((node) => getTokens(node, { mode: options!.mode }, []))
        .map(options.camelCase ? _.camelCase : _.identity)
        .value();
}

const getTokens = ({ name, type, nodes }: Tokenizer.INode, options: { mode?: string }, tokens: string[]): string[] => {
    if (name === "local" || name === "global") {
        if (type === "pseudo-class") {
            options.mode = name;
        }
        if (type === "nested-pseudo-class") {
            return getTokens(nodes![0], { mode: name }, tokens);
        }
    }
    if (options.mode === "local" && (type === "id" || type === "class")) {
        tokens = _.compact(_.union(tokens, [name]));
    }
    if (_.isArray(nodes)) {
        return _.flatMap(nodes, (node) => getTokens(node, options, tokens));
    }
    return tokens;
};
