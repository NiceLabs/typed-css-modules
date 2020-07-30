#!/usr/bin/env node
import { promises as fs } from 'fs';
import _ from 'lodash';
import { getModuleTokens } from './modules';
import { ISelectorOptions } from './modules-selector';
import { createTypeHint } from './type-hint';

export const makeDTSFile = (options?: ISelectorOptions) => async (
  filePath: string,
  source?: string,
) => {
  const target = `${filePath}.d.ts`;
  try {
    const payload = source || (await fs.readFile(filePath, 'utf8'));
    const tokens = await getModuleTokens(payload, filePath, options);
    if (!_.isEmpty(tokens)) {
      await fs.writeFile(target, createTypeHint(tokens));
      return;
    }
    if (await fs.stat(target)) {
      await fs.unlink(target);
    }
  } catch (e) {
    // ignore error
  }
};
