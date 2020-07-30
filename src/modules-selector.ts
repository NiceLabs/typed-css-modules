import _ from 'lodash';

import Tokenizer from 'css-selector-tokenizer';

export interface ISelectorOptions {
  mode?: 'local' | 'global';
  camelCase?: boolean;
}

export function getModuleTokensWithSelector(
  selector: string,
  options?: ISelectorOptions,
) {
  options = _.defaults(options, { mode: 'local', camelCase: false });
  return _.chain(Tokenizer.parse(selector).nodes)
    .flatMap((node) => getTokens(node, { mode: options?.mode }, []))
    .map(options.camelCase ? _.camelCase : _.identity)
    .value();
}

const getTokens = (
  node: Tokenizer.AnySelectorNode,
  options: { mode?: string },
  tokens: string[],
): string[] => {
  if (node.name === 'local' || node.name === 'global') {
    if (node.type === 'pseudo-class') {
      options.mode = node.name;
    }
    if (node.type === 'nested-pseudo-class') {
      return getTokens(node.nodes[0], { mode: node.name }, tokens);
    }
  }
  if (
    options.mode === 'local' &&
    (node.type === 'id' || node.type === 'class')
  ) {
    tokens = _.compact(_.union(tokens, [node.name]));
  }
  // @ts-ignore
  if (_.isArray(node.nodes)) {
    // @ts-ignore
    return _.flatMap(node.nodes, (node) => getTokens(node, options, tokens));
  }
  return tokens;
};
