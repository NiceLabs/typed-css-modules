import _ from "lodash";
import ts from "typescript";

export function createTypeHint(tokens: string[]) {
    if (_.isEmpty(tokens)) { return ""; }
    const Locals = _.chain(tokens)
        .union()
        .map((token) => ts.createPropertySignature(
            undefined, ts.createLiteral(token), undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), undefined,
        ))
        .thru((members) => ts.createInterfaceDeclaration(
            undefined, undefined, ts.createIdentifier("ILocals"),
            undefined, undefined, members,
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

    const lines = [
        "// tslint:disable",
        "// The code is automated generator",
        "// https://github.com/NiceLabs/typed-css-modules",
        ts.createPrinter().printFile(file),
    ];
    return lines.join("\n");
}
