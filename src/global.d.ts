declare module "css-selector-tokenizer" {
    export function parse(input: string): INode;

    export interface INode {
        type: string;
        name?: string;
        value?: string;
        nodes?: this[];
    }
}

declare module "postcss-load-config" {
    import { Plugin, ProcessOptions } from "postcss";

    interface IConfig {
        file: string;
        plugins: Array<Plugin<any>>;
        options: ProcessOptions;
    }

    function loadConfig(
        context?: object,
        path?: string,
        options?: any,
    ): Promise<IConfig>;

    export = loadConfig;
}
