#!/usr/bin/bash
set -ueo pipefail
HERE=$(cd -L $(dirname -- $0); pwd)
export PATH="$HERE/node_modules/.bin:$PATH"
webpack --config index.webpack.js
webpack --config modes.webpack.js
