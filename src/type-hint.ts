import _ = require("lodash");
import ts = require("typescript");

export function createTypeHint(tokens: string[]) {
    if (_.isEmpty(tokens)) { return ""; }
    const members = _.chain(tokens)
        .sortedUniq()
        .filter((token) => /^[$_]?[^-]*$/g.test(token))
        .map((token) => ts.createVariableDeclaration(
            token,
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
        ))
        .map((declaration) => ts.createVariableStatement(
            [ts.createToken(ts.SyntaxKind.ExportKeyword)],
            ts.createVariableDeclarationList([declaration], ts.NodeFlags.Const),
        ))
        .value();
    const file = ts.createSourceFile("", "", ts.ScriptTarget.Latest);
    file.statements = ts.createNodeArray(members);
    return ts.createPrinter().printFile(file);
}
