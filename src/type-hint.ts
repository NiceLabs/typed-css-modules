import _ from "lodash";
import ts from "typescript";

const StringKeyword = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);

const IndexSignature = ts.createIndexSignature(
    undefined, undefined,
    ts.createNodeArray([
        ts.createParameter(
            undefined, undefined,
            undefined, "name",
            undefined, StringKeyword,
        ),
    ]),
    StringKeyword,
);

export function createTypeHint(tokens: string[]) {
    if (_.isEmpty(tokens)) { return ""; }
    const Locals = _.chain(tokens)
        .union()
        .map((token): ts.TypeElement => ts.createPropertySignature(
            undefined, ts.createLiteral(token), undefined,
            StringKeyword, undefined,
        ))
        .concat(IndexSignature)
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
        "/* eslint-disable */",
        "/* ignore jslint start */",
        "// tslint:disable",
        "// jscs:disable",
        "// jshint ignore: start",
        "// prettier-ignore",
        "",
        "// The code is automated generator",
        "// https://github.com/NiceLabs/typed-css-modules",
        ts.createPrinter().printFile(file),
    ];
    return lines.join("\n");
}
