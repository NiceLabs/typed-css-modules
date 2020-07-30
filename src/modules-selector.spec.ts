import _ from 'lodash';

import { expect } from 'chai';
import 'mocha';

import { getModuleTokensWithSelector } from './modules-selector';

describe('getModuleTokens with selector', () => {
  it('local mode', () => {
    // tslint:disable object-literal-sort-keys
    const mapping: { [name: string]: string[] } = {
      '.foo': ['foo'],
      '.foo .bar': ['foo', 'bar'],
      // Shorthand global selector
      ':global .foo .bar': [],
      '.foo :global .bar': ['foo'],
      // Targeted global selector
      ':global(.foo) .bar': ['bar'],
      '.foo:global(.bar)': ['foo'],
      '.foo :global(.bar) .baz': ['foo', 'baz'],
      '.foo:global(.bar) .baz': ['foo', 'baz'],
    };
    // tslint:enable object-literal-sort-keys
    _.forEach(mapping, (matches, selector) => {
      const locals = getModuleTokensWithSelector(selector, {
        mode: 'local',
      });
      expect(matches).to.eql(locals);
    });
  });

  it('global mode', () => {
    // tslint:disable object-literal-sort-keys
    const mapping: { [name: string]: string[] } = {
      '.foo': [],
      '.foo .bar': [],
      // Shorthand local selector
      ':local .foo :global .bar': ['foo'],
      '.foo :local .bar': ['bar'],
      // Targeted local selector
      ':local(.foo) .bar': ['foo'],
      '.foo:local(.bar)': ['bar'],
    };
    // tslint:enable object-literal-sort-keys
    _.forEach(mapping, (matches, selector) => {
      const locals = getModuleTokensWithSelector(selector, {
        mode: 'global',
      });
      expect(matches).to.eql(locals);
    });
  });
});
