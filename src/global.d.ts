declare module "css-selector-tokenizer" {
    export function parse(input: string): Node;

    export interface Node {
        type: string;
        name?: string;
        operator?: string;
        before?: string;
        after?: string;
        value?: string;
        content?: string;
        nodes?: Node[];
    }
}