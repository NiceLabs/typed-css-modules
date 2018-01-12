import ts = require("typescript");

export function createTypeHint(names: string[]) {
    const createSignatureWithName = (name: string) => ts.createPropertySignature(
        undefined, ts.createLiteral(name),
        undefined, ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        undefined,
    );

    const Names = ts.createInterfaceDeclaration(
        undefined, undefined, "CSSModuleNames",
        undefined, undefined, names.map(createSignatureWithName),
    );

    const file = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
    file.statements = ts.createNodeArray([
        Names,
        ts.createExportAssignment(undefined, undefined, true, Names.name),
    ]);

    return ts.createPrinter().printFile(file);
}
