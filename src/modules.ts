import Parser = require("css-modules-loader-core/lib/parser");
import _ = require("lodash");
import PostCSS = require("postcss");
import loadConfig = require("postcss-load-config");
import { promisify } from "util";

export const getModuleNames = async (source: string): Promise<string[]> => {
    const parser = new Parser();

    const { plugins, options, file } = await loadConfig();
    await PostCSS(_.union(plugins, [parser.plugin]))
        .process(source, _.assign({}, options, { from: file }));
    return _.keys(parser.exportTokens);
};
