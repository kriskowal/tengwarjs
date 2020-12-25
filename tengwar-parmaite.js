"use strict";

var Alphabet = require("./alphabet");
var Bindings = require("./dan-smith");
var makeFontColumn = require("./column");

var tengwar = exports.tengwar = {
    ...Bindings.tengwar,
    "open-paren": "=",
    "close-paren": "=",
};
var tehtar = exports.tehtar = Bindings.tehtar;

var positions = exports.positions = {

    "tinco": 2,
    "parma": 2,
    "calma": {
        "y-quenya": 1,
        "o-below": 1,
        "others": 2
    },
    "quesse": {
        "y-quenya": 1,
        "o-below": 1,
        "others": 2
    },

    "ando": {
        "wide": true,
        "others": 0
    },
    "umbar": {
        "wide": true,
        "others": 0
    },
    "anga": {
        "wide": true,
        "others": 0
    },
    "ungwe": {
        "wide": true,
        "others": 0
    },

    "thúle": {
        "a": 3,
        "w": 3,
        "y-sindarin": 3,
        "others": 2
    },
    "formen": {
        "a": 3,
        "w": 3,
        "í": 3,
        "y-sindarin": 3,
        "others": 2
    },
    "harma": {
        "a": 0,
        "e": 0,
        "w": 0,
        "í": 0,
        "y-sindarin": 0,
        "others": 1
    },
    "hwesta": {
        "a": 0,
        "e": 0,
        "w": 0,
        "y-sindarin": 0,
        "others": 1
    },

    "anto": {
        "wide": true,
        "others": 0
    },
    "ampa": {
        "wide": true,
        "others": 0
    },
    "anca": {
        "wide": true,
        "others": 0
    },
    "unque": {
        "wide": true,
        "others": 0
    },

    "númen": {
        "wide": true,
        "others": 0
    },
    "malta": {
        "wide": true,
        "others": 0
    },
    "noldo": {
        "wide": true,
        "others": 0
    },
    "ñwalme": {
        "wide": true,
        "others": 0
    },

    "óre": {
        "a": 1,
        "e": 2,
        "i": 1,
        "o": 2,
        "u": 3,
        "others": 1
    },
    "vala": {
        "a": 1,
        "e": 2,
        "i": 2,
        "o": 2,
        "w": 1,
        "y-quenya": 1,
        "y-sindarin": 2,
        "y-english": 2,
        "í": 2,
        "i-below": 1,
        "others": 3
    },
    "anna": {
        "a": 1,
        "w": 3,
        "others": 2
    },
    "wilya": {
        "i": 2,
        "í": 2,
        "y-english": 2,
        "y-sindarin": 2,
        "others": 1
    },

    "rómen": {
        "a": 1,
        "e": 1,
        "i": 2,
        "o": 1,
        "u": 1,
        "y-quenya": 3,
        "o-below": null,
        "i-below": 3,
        "others": 1
    },
    "arda": {
        "a": 1,
        "e": 1,
        "i": 2,
        "o": 1,
        "u": 1,
        "w": 1,
        "í": 2,
        "y-quenya": 3,
        "y-sindarin": 2,
        "y-english": 2,
        "o-below": null,
        "i-below": 3,
        "others": 0
    },
    "lambe": {
        "wide": true,
        "e": 1,
        "y-quenya": 4,
        "w": 0,
        "o-below": null,
        "i-below": 4,
        "others": 0
    },
    "alda": {
        "wide": true,
        "w": 0,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },

    "silme": {
        "y-quenya": 2,
        "o-below": 2,
        "i-below": 2,
        "others": null
    },
    "silme-nuquerna": {
        "e": 2,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },
    "esse": {
        "others": null
    },
    "esse-nuquerna": {
        "e": 2,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },

    "hyarmen": {
        "y-quenya": 1,
        "o-below": 1,
        "i-below": 1,
        "others": 3
    },
    "hwesta-sindarinwa": {
        "w": 1,
        "y-quenya": 1,
        "o-below": 1,
        "i-below": 1,
        "others": 0
    },
    "yanta": {
        "a": 1,
        "others": 2
    },
    "úre": {
        "a": 1,
        "others": 2
    },

    "halla": {
        "i-below": 3,
        "o-below": 3,
        "others": null
    },
    "telco": {
        "y-quenya": null,
        "others": 3
    },
    "ára": {
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 3
    },
    "osse": 2,

    "thúletinco": {
        "a": 3,
        "w": 3,
        "y-quenya": 3,
        "y-sindarin": 3,
        "í": 3,
        "o-below": 3,
        "others": 2
    },
    "formenparma": {
        "a": 3,
        "w": 3,
        "y-quenya": 3,
        "y-sindarin": 3,
        "í": 3,
        "o-below": 3,
        "others": 2
    },
    "harmacalma": {
        "i": 1,
        "w": 1,
        "y-quenya": 0,
        "í": 0,
        "i-below": 1,
        "o-below": 1,
        "others": 0
    },
    "hwestaquesse": {
        "i": 1,
        "w": 1,
        "y-quenya": 0,
        "í": 0,
        "i-below": 1,
        "o-below": 1,
        "others": 0
    },

    "antoando": {
        "wide": true,
        "others": 0
    },
    "ampaumbar": {
        "wide": true,
        "others": 0
    },
    "ancaanga": {
        "wide": true,
        "others": 0
    },
    "unqueungwe": {
        "wide": true,
        "others": 0
    }

};

exports.transcribe = transcribe;
function transcribe(sections, options) {
    options = options || {};
    var block = options.block || false;
    var beginParagraph = block ? "<p>" : "";
    var delimitParagraph = "<br>";
    var endParagraph = block ? "</p>" : "";
    return sections.map(function (section) {
        return section.map(function (paragraph) {
            return beginParagraph + paragraph.map(function (line) {
                return line.map(function (word) {
                    return word.map(function (column) {
                        return transcribeColumn(column, options);
                    }).join("");
                }).join(" ");;
            }).join(delimitParagraph + "\n") + endParagraph;
        }).join("\n\n");
    }).join("\n\n\n");
}

exports.transcribeColumn = transcribeColumn;
function transcribeColumn(column, options) {
    options = options || {};
    var plain = options.plain || false;
    var tengwa = column.tengwa || "anna";
    var tehtar = [];
    if (column.above) tehtar.push(column.above);
    if (column.below) tehtar.push(column.below);
    if (column.tildeBelow) tehtar.push("tilde-below");
    if (column.tildeAbove) tehtar.push("tilde-above");
    if (column.following) tehtar.push(column.following);
    var html = tengwar[tengwa] + tehtar.map(function (tehta) {
        return tehtaForTengwa(tengwa, tehta);
    }).join("");
    if (column.errors && !plain) {
        html = "<abbr class=\"error\" title=\"" + column.errors.join("\n").replace(/"/g, "&quot;") + "\">" + html + "</abbr>";
    }
    return html;
}

exports.tehtaForTengwa = tehtaForTengwa;
function tehtaForTengwa(tengwa, tehta) {
    var tehtaKey = tehtaKeyForTengwa(tengwa, tehta);
    if (tehtaKey == null)
        return null;
    return (
        tehtar[tehta][tengwa] ||
        tehtar[tehta][tehtaKey] ||
        null
    );
}

var longVowels = "áéóú";
function tehtaKeyForTengwa(tengwa, tehta) {
    if (!tehtar[tehta])
        return null;
    if (longVowels.indexOf(tehta) !== -1)
        return null;
    if (tehtar[tehta].special)
        return tehtar[tehta][tengwa] || null;
    if (Alphabet.barsAndTildes.indexOf(tehta) !== -1) {
        if (tengwa === "lambe" || tengwa === "alda" && tehtar[tehta].length >= 2)
            return 2;
        return positions[tengwa].wide ? 0 : 1;
    }
    if (positions[tengwa] == null)
        return null;
    if (positions[tengwa][tehta] === null)
        return null;
    if (positions[tengwa][tehta] != null)
        return positions[tengwa][tehta];
    if (positions[tengwa].others != null)
        return positions[tengwa].others;
    return positions[tengwa];
}

exports.makeColumn = makeColumn;
function makeColumn(tengwa, tengwarFrom) {
    return makeFontColumn(exports, tengwa, tengwarFrom);
}
