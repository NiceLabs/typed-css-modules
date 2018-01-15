import _ = require("lodash");

import PostCSS = require("postcss");
import loadConfig = require("postcss-load-config");

import { getModuleTokensWithSelector, ISelectorOptions } from "./modules-selector";

export async function getModuleTokens(source: string, from?: string, options?: ISelectorOptions): Promise<string[]> {
    let tokens: string[] = [];

    const walkTokensPlugin = (css: PostCSS.Root) => {
        css.walkRules((node) => {
            const newTokens = _.flatMap(
                node.selectors,
                (selector) => getModuleTokensWithSelector(selector, options),
            );
            tokens = _.union(tokens, newTokens);
        });
    };

    const config = await loadConfig();
    config.options.from = from || config.file;

    await PostCSS(config.plugins)
        .use(walkTokensPlugin)
        .process(source, config.options);

    return tokens;
}
