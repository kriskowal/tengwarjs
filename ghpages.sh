#!/usr/bin/bash
set -ueo pipefail

HERE=$(cd -L $(dirname -- $0); pwd)
export PATH="$HERE/node_modules/.bin":"$PATH"
export GIT_DIR="$HERE/../.git"
export GIT_INDEX_FILE=$(mktemp "$GIT_DIR/TEMP.XXXXXX")
function trap_rm_index {
    rm "$GIT_INDEX_FILE"
}
trap trap_rm_index exit
export GIT_WORK_TREE=$HERE

git read-tree --empty
git add .
TREE=$(git write-tree --missing-ok)
COMMIT=$(git commit-tree $TREE < <(echo Deploy))
git update-ref refs/heads/gh-pages $COMMIT
