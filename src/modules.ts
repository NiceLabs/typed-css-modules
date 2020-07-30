import _ from 'lodash';

import PostCSS from 'postcss';
import loadConfig from 'postcss-load-config';

import {
  getModuleTokensWithSelector,
  ISelectorOptions,
} from './modules-selector';

export async function getModuleTokens(
  source: string,
  from?: string,
  options?: ISelectorOptions,
): Promise<string[]> {
  let tokens: string[] = [];

  const walkTokensPlugin = (css: PostCSS.Root) => {
    css.walkRules((node) => {
      const newTokens = _.flatMap(node.selectors, (selector) =>
        getModuleTokensWithSelector(selector, options),
      );
      tokens = _.compact(_.union(tokens, newTokens));
    });
  };

  const config = await getConfig();
  config.options.from = from || config.file;

  await PostCSS(config.plugins)
    .use(walkTokensPlugin)
    .process(source, config.options);

  return tokens;
}

function getConfig() {
  const defaults = {
    file: undefined,
    options: { from: undefined },
    plugins: [],
  };
  return loadConfig().catch(_.constant(defaults));
}
