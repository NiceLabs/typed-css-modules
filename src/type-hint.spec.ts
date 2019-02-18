import _ from "lodash";
import dedent from "ts-dedent";

import { expect } from "chai";
import "mocha";

import { createTypeHint } from "./type-hint";

describe("type-hint generator", () => {
    it("tokens", () => {
        const hint = createTypeHint(["a", "b", "c"]);
        const result = dedent`
        /* eslint-disable */
        /* ignore jslint start */
        // tslint:disable
        // jscs:disable
        // jshint ignore: start

        // The code is automated generator
        // https://github.com/NiceLabs/typed-css-modules
        interface ILocals {
            "a": string;
            "b": string;
            "c": string;
        }
        declare const locals: ILocals;
        export = locals;

        `;
        expect(result).to.eql(hint);
    });
});
