declare module "css-modules-loader-core/lib/parser" {
    import { Plugin } from "postcss"

    type PathFetcher = (file: string, relativeTo: string, depTrace: string) => Promise<object>

    class Parser {
        constructor(pathFetcher?: PathFetcher, trace?: string)

        plugin: Plugin<any>;

        exportTokens: { [name: string]: string; };
    }

    export = Parser
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