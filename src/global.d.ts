declare module "css-selector-tokenizer" {
    export function parse(input: string): Node;

    export interface Node {
        type: string;
        name?: string;
        value?: string;
        nodes?: Node[];
    }
}

declare module "postcss-load-config" {
    import { Plugin, ProcessOptions } from "postcss"

    type Config = {
        file: string
        plugins: Plugin<any>[]
        options: ProcessOptions
    }

    function loadConfig(context?: object, path?: string, options?: ProcessOptions): Promise<Config>;

    export = loadConfig
}