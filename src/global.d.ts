declare module "css-selector-tokenizer" {
    export function parse(input: string): INode;

    export interface INode {
        type: string;
        name?: string;
        value?: string;
        nodes?: this[];
    }
}
