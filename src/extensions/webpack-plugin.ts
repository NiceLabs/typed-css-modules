import _ = require('lodash');

import chokidar = require('chokidar');
import webpack = require('webpack');
import { makeDTSFile } from '../utils';

export interface IPluginOptions {
  mode?: 'local' | 'global';
  camelCase?: boolean;
  filesPattern?: string | string[];
}

export default class TypedCSSModulesPlugin {
  private options: IPluginOptions;
  private createDTSFile: (path: string) => Promise<void>;

  public constructor(options?: IPluginOptions) {
    this.options = _.defaults(options, { filesPattern: './src/**/*.css' });
    this.createDTSFile = _.unary(makeDTSFile(this.options));
  }

  public apply(compiler: webpack.Compiler) {
    if (this.options.filesPattern === undefined) {
      return;
    }
    const watcher = chokidar.watch(this.options.filesPattern);
    compiler.plugin('compile', () => {
      watcher.on('add', this.createDTSFile);
      watcher.on('change', this.createDTSFile);
    });
    compiler.plugin('done', () => {
      watcher.close();
    });
    return;
  }
}
