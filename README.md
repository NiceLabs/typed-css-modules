# @nice-labs/typed-css-modules

Creates TypeScript definition files from [CSS Modules](https://github.com/css-modules/css-modules) .css files.

If you have the following css,

```css
/* locals.css */

.local {
}
.local-1 {
}
```

typed-css-modules creates the following .d.ts files from the above css:

```ts
/* locals.css.d.ts */
type Locals = {
  "local": string;
  "local-1": string;
};
declare const locals: Locals;
export = locals;
```

So, you can import CSS modules' class or variable into your TypeScript sources:

```ts
/* app.ts */
import * as locals from "./locals.css";
console.log(locals.local);
console.log(locals["local-1"]);
```

## API

```sh
npm install -D @nice-labs/typed-css-modules
```

```ts
import * as fs from "fs";
import { promisify } from "util";
import { getModuleTokens, createTypeHint } from "@nice-labs/typed-css-modules";

const readFile = promisify(fs.readFile);

async function main() {
  const source = await readFile("locals.css");
  const tokens = await getModuleTokens(source); // ["local", "local-1"]
  const typeHint = createTypeHint(tokens); // d.ts file content
}

main();
```

## License

This software is released under the MIT License, see LICENSE.txt.
