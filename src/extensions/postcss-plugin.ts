import _ = require("lodash");
import PostCSS = require("postcss");
import { getModuleNames as getNames } from "../modules";

export interface IOptions {
    mode: "local" | "global";
    camelCase: boolean;
    callback?(names: string[]): void;
}

const pluginName = "extract-css-module-names";

const plugin = PostCSS.plugin(pluginName, (options: IOptions) => (css, result) => {
    options = _.defaults(options, { mode: "global" });

    let names: string[] = [];
    css.walkRules((rule) => {
        if (rule.parent.type === "atrule") { return; }
        names = _.union(names, _.flatMap(rule.selectors, (selector) => getNames(rule.selector, options)));
    });
    if (_.isFunction(options.callback)) {
        options.callback(names);
    }
});

export default plugin;

export function getModuleNames(style: string, options: IOptions): Promise<string[]> {
    return new Promise((resolve) => {
        PostCSS()
            .use(plugin(_.assign({}, options, { callback: resolve })))
            .process(style);
    });
}
