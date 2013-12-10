
exports.encode = encode;
function encode(sections) {
    return sections.map(function (section) {
        return section.map(function (paragraph) {
            return paragraph.map(function (line) {
                return line.map(function (word) {
                    return word.map(function (column) {
                        var parts = [];
                        if (column.above)
                            parts.push(column.above);
                        if (column.below)
                            parts.push(column.below);
                        if (column.following)
                            parts.push(column.following);
                        if (column.tildeAbove)
                            parts.push("tilde-above");
                        if (column.tildeBelow)
                            parts.push("tilde-below");
                        if (parts.length) {
                            return column.tengwa + ":" + parts.join(",");
                        } else {
                            return column.tengwa;
                        }
                    }).join(";");
                }).join(" ");;
            }).join("\n");
        }).join("\n\n");
    }).join("\n\n\n");
}

exports.decode = decode;
function decode(encoding, makeColumn) {
    return encoding.split("\n\n\n").map(function (section) {
        return section.split("\n\n").map(function (paragraph) {
            return paragraph.split("\n").map(function (line) {
                return line.split(" ").map(function (word) {
                    return decodeWord(word, makeColumn);
                });
            });
        });
    });
}

exports.decodeWord = decodeWord;
function decodeWord(word, makeColumn) {
    return word.split(";").map(function (column) {
        var parts = column.split(":");
        var tengwa = parts.shift();
        var tehtar = parts.length ? parts.shift().split(",") : [];
        var result = makeColumn(tengwa);
        tehtar.forEach(function (tehta) {
            if (tehta === "tilde-above") {
                result.addTildeAbove();
            } else if (tehta === "tilde-below") {
                result.addTildeBelow();
            } else if (tehta === "y") {
                result.addBelow("y");
            } else if (
                tehta === "s" ||
                tehta === "s-inverse" ||
                tehta === "s-extended" ||
                tehta === "s-flourish"
            ) {
                if (
                    tehta === "s" &&
                    (tengwa === "calma" || tengwa === "quesse")
                ) {
                    result.addBelow(tehta);
                } else {
                    result.addFollowing(tehta);
                }
            } else {
                result.addAbove(tehta);
            }
        });
        return result;
    });
}

