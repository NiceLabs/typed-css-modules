import _ = require("lodash");
import ts = require("typescript");

export function createTypeHint(tokens: string[]) {
    if (_.isEmpty(tokens)) { return ""; }
    const exportName = ts.createIdentifier("CSSModuleNames");
    const file = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
    file.statements = ts.createNodeArray([
        ts.createInterfaceDeclaration(
            undefined, undefined, exportName,
            undefined, undefined, _.map(_.sortBy(_.uniq(tokens)), (token) => ts.createPropertySignature(
                undefined,
                /^[$_]?[a-zA-Z0-9]*$/g.test(token)
                    ? ts.createIdentifier(token)
                    : ts.createLiteral(token),
                undefined,
                ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                undefined,
            )),
        ),
        ts.createIdentifier("\r") as ts.Node as ts.Statement,
        ts.createExportAssignment(undefined, undefined, true, exportName),
    ]);
    return ts.createPrinter().printFile(file);
}
