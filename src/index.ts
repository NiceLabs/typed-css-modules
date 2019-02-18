export { createTypeHint } from "./type-hint";
export { getModuleTokens } from "./modules";
export { default as Plugin } from "./extensions/webpack-plugin";

export const loader = require.resolve("./extensions/webpack-loader")
