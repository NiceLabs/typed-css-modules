#!/bin/bash
set -euo pipefail
IFS=$'\n\t'
set -x

echo $(jq '.name = "@nicelabs/typed-css-modules"' package.json) > package.json

VERSION=$(jq -r '.version' package.json)
npm --no-git-tag-version version "$VERSION-$GITHUB_RUN_NUMBER"
npm publish
