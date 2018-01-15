import _ = require("lodash");
import ts = require("typescript");

export function createTypeHint(tokens: string[]) {
    if (_.isEmpty(tokens)) { return ""; }
    const Locals = _.chain(tokens)
        .sortedUniq()
        .map((token) => ts.createPropertySignature(
            undefined, ts.createLiteral(token), undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), undefined,
        ))
        .thru(ts.createTypeLiteralNode)
        .thru((node) => ts.createTypeAliasDeclaration(
            undefined, undefined, ts.createIdentifier("Locals"), undefined, node,
        ))
        .value();
    const localsName = ts.createIdentifier("locals");
    const locals = ts.createVariableStatement(
        [ts.createToken(ts.SyntaxKind.DeclareKeyword)],
        ts.createVariableDeclarationList(
            [ts.createVariableDeclaration(
                localsName,
                ts.createTypeReferenceNode(
                    Locals.name,
                    undefined,
                ),
            )],
            ts.NodeFlags.Const,
        ),
    );

    const file = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
    file.statements = ts.createNodeArray([
        Locals,
        locals,
        ts.createExportAssignment(undefined, undefined, true, localsName),
    ]);

    return ts.createPrinter().printFile(file);
}
