
var makeColumn = require("./column");

var Font = {
    "names": [
        ["tinco", "parma", "calma", "quesse"],
        ["ando", "umbar", "anga", "ungwe"],
        ["thule", "formen", "harma", "hwesta"],
        ["anto", "ampa", "anca", "unque"],
        ["numen", "malta", "noldo", "nwalme"],
        ["ore", "vala", "anna", "wilya"],
        ["romen", "arda", "lambe", "alda"],
        ["silme", "silme-nuquerna", "esse", "esse-nuquerna"],
        ["hyarmen", "hwesta-sindarinwa", "yanta", "ure"],
        ["halla", "short-carrier", "long-carrier", "round-carrier"],
        ["tinco-extended", "parma-extended", "calma-extended", "quesse-extended"],
    ],
    "aliases": {
        "vilya": "wilya",
        "aha": "harma"
    },
    // classical
    "tengwar": {
        // 1
        "tinco": "1", // t
        "parma": "q", // p
        "calma": "a", // c
        "quesse": "z", // qu
        // 2
        "ando" : "2", // nd
        "umbar": "w", // mb
        "anga" : "s", // ng
        "ungwe": "x", // ngw
        // 3
        "thule" : "3", // th
        "formen": "e", // ph / f
        "harma" : "d", // h / ch
        "hwesta": "c", // hw / chw
        // 4
        "anto" : "4", // nt
        "ampa" : "r", // mp
        "anca" : "f", // nc
        "unque": "v", // nqu
        // 5
        "numen" : "5", // n
        "malta" : "t", // m
        "noldo" : "g", // ng
        "nwalme": "b", // ngw / nw
        // 6
        "ore"  : "6", // r
        "vala" : "y", // v
        "anna" : "h", // -
        "wilya": "n", // w / v
        // 7
        "romen": "7", // medial r
        "arda" : "u", // rd / rh
        "lambe": "j", // l
        "alda" : "m", // ld / lh
        // 8
        "silme":          "8", // s
        "silme-nuquerna": "i", // s
        "esse":           "k", // z
        "esse-nuquerna":  ",", // z
        // 9
        "hyarmen":           "9", // hyarmen
        "hwesta-sindarinwa": "o", // hwesta sindarinwa
        "yanta":             "l", // yanta
        "ure":               ".", // ure
        // 10
        "halla": "½", // halla
        "short-carrier": "`",
        "long-carrier": "~",
        "round-carrier": "]",
        // I
        "tinco-extended": "!",
        "parma-extended": "Q",
        "calma-extended": "A",
        "quesse-extended": "Z",
        // punctuation
        "comma": "=",
        "full-stop": "-",
        "exclamation-point": "Á",
        "question-mark": "À",
        "open-paren": "&#140;",
        "close-paren": "&#156;",
        "flourish-left": "&#286;",
        "flourish-right": "&#287;",
    },
    "tehtar": {
        "a": "#EDC",
        "e": "$RFV",
        "i": "%TGB",
        "o": "^YHN",
        "u": [
            "&",
            "U",
            "J",
            "M",
            "&#256;", // backward hooks, from the alt font to the custom font
            "&#257;",
            "&#258;",
            "&#259;"
        ],
        //"á": "",
        "ó": [
            "&#260;",
            "&#261;",
            "&#262;",
            "&#263;"
        ],
        "ú": [
            "&#264;",
            "&#265;",
            "&#266;",
            "&#267;"
        ],
        "í": [
            "&#212;",
            "&#213;",
            "&#214;",
            "&#215;",
        ],
        "w": "èéêë",
        "y": "ÌÍÎÏ´",
        /*
        "o-under": [
            "ä",
            "&#229;", // a ring above
            "æ",
            "ç",
            "|"
        ],
        */
        // TODO deal with the fact that all of these
        // should only be final (for word spacing) except
        // for the first S-hook for "calma" and "quesse"
        // since they appear within the tengwa
        "s": {
            "special": true,
            "tinco": "+",
            "ando": "+",
            "numen": "+",
            "lambe": "_",
            "calma": "|",
            "quesse": "|",
            "short-carrier": "}",
        },
        "s-inverse": {
            "special": true,
            "tinco": "¡"
        },
        "s-extended": {
            "special": true,
            "tinco": "&#199;"
        },
        "s-flourish": {
            "special": true,
            "tinco": "&#163;",
            "lambe": "&#165;"
        },
        "tilde-above": "Pp",
        "tilde-below": [
            ":",
            ";",
            "&#176;",
        ],
        "tilde-high-above": ")0",
        "tilde-far-below": "?/",
        "bar-above": "{[",
        "bar-below": [
            '"',
            "'",
            "&#184;" // cedilla
        ],
        "bar-high-above": "ìî",
        "bar-far-below": "íï"
    },
    "barsAndTildes": [
        "tilde-above",
        "tilde-below",
        "tilde-high-above",
        "tilde-far-below",
        "bar-above",
        "bar-below",
        "bar-high-above",
        "bar-high-below"
    ],
    "tehtaPositions": {
        "tinco": {
            "o": 3,
            "w": 3,
            "others": 2
        },
        "parma": {
            "o": 3,
            "w": 3,
            "others": 2
        },
        "calma": {
            "o": 3,
            "w": 3,
            "u": 3,
            "others": 2
        },
        "quesse": {
            "o": 3,
            "w": 3,
            "others": 2
        },
        "ando": {
            "wide": true,
            "e": 1,
            "o": 2,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "umbar": {
            "wide": true,
            "e": 1,
            "o": 2,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "anga": {
            "wide": true,
            "e": 1,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "ungwe": {
            "wide": true,
            "e": 1,
            "o": 1,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "thule": {
            "others": 3
        },
        "formen": 3,
        "harma": {
            "e": 0,
            "o": 3,
            "u": 7,
            "ó": 2,
            "ú": 2,
            "w": 0,
            "others": 1
        },
        "hwesta": {
            "e": 0,
            "o": 3,
            "u": 7,
            "w": 0,
            "others": 1
        },
        "anto": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "ampa": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "anca": {
            "wide": true,
            "u": 7,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "unque": {
            "wide": true,
            "u": 7,
            "others": 0
        },
        "numen": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "malta": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "noldo": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "nwalme": {
            "wide": true,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "ore": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "others": 1
        },
        "vala": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "others": 1
        },
        "anna": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 2,
            "ú": 2,
            "others": 1
        },
        "wilya": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "others": 1
        },
        "romen": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 2,
            "ú": 2,
            "y": null,
            "others": 1
        },
        "arda": {
            "a": 1,
            "e": 3,
            "i": 1,
            "o": 3,
            "u": 3,
            "í": 1,
            "ó": 2,
            "ú": 2,
            "y": null,
            "others": 0
        },
        "lambe": {
            "wide": true,
            "e": 1,
            "y": 4,
            "ó": 1,
            "ú": 1,
            "others": 0
        },
        "alda": {
            "wide": true,
            "others": 1
        },
        "silme": {
            "y": 3,
            "others": null
        },
        "silme-nuquerna": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "y": null,
            "others": 1
        },
        "esse": {
            "y": null,
            "others": null
        },
        "esse-nuquerna": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "others": 1
        },
        "hyarmen": 3,
        "hwesta-sindarinwa": {
            "o": 2,
            "u": 2,
            "ó": 1,
            "ú": 2,
            "others": 0
        },
        "yanta": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 2,
            "ú": 2,
            "others": 1
        },
        "ure": {
            "e": 3,
            "o": 3,
            "u": 3,
            "ó": 3,
            "ú": 3,
            "others": 1
        },
        // should not occur:
        "halla": {
            "others": null
        },
        "short-carrier": 3,
        "long-carrier": {
            "y": null,
            "others": 3
        },
        "round-carrier": 3,
        "tinco-extended": 3,
        "parma-extended": 3,
        "calma-extended": {
            "o": 3,
            "u": 7,
            "ó": 2,
            "ú": 2,
            "others": 1
        },
        "quesse-extended": {
            "o": 0,
            "u": 7,
            "others": 1
        }
    },
    "punctuation": {
        "-": "comma",
        ",": "comma",
        ":": "comma",
        ";": "full-stop",
        ".": "full-stop",
        "!": "exclamation-point",
        "?": "question-mark",
        "(": "open-paren",
        ")": "close-paren",
        ">": "flourish-left",
        "<": "flourish-right"
    },
    "annotations": {
        "tinco": {"tengwa": "t"},
        "parma": {"tengwa": "p"},
        "calma": {"tengwa": "c"},
        "quesse": {"tengwa": "c"},
        "ando": {"tengwa": "d"},
        "umbar": {"tengwa": "b"},
        "anga": {"tengwa": "ch"},
        "ungwe": {"tengwa": "g"},
        "thule": {"tengwa": "th"},
        "formen": {"tengwa": "f"},
        "hyarmen": {"tengwa": "h"},
        "hwesta": {"tengwa": "kh"},
        "unque": {"tengwa": "gh"},
        "anto": {"tengwa": "dh"},
        "anca": {"tengwa": "j"},
        "ampa": {"tengwa": "v"},
        "numen": {"tengwa": "n"},
        "malta": {"tengwa": "m"},
        "nwalme": {"tengwa": "ñ"},
        "romen": {"tengwa": "r"},
        "ore": {"tengwa": "-r"},
        "lambe": {"tengwa": "l"},
        "silme": {"tengwa": "s"},
        "silme-nuquerna": {"tengwa": "s"},
        "esse": {"tengwa": "z"},
        "esse-nuquerna": {"tengwa": "z"},
        "harma": {"tengwa": "sh"},
        "alda": {"tengwa": "lh"},
        "arda": {"tengwa": "rh"},
        "wilya": {"tengwa": "a"},
        "vala": {"tengwa": "w"},
        "anna": {"tengwa": "i"},
        "vala": {"tengwa": "w"},
        "yanta": {"tengwa": "e"},
        "hwesta-sindarinwa": {"tengwa": "wh"},
        "s": {"following": "s"},
        "s-inverse": {"following": "s<sub>2</sub>"},
        "s-extended": {"following": "s<sub>3</sub>"},
        "s-flourish": {"following": "s<sub>4</sub>"},
        "long-carrier": {"tengwa": "´"},
        "short-carrier": {},
        "tilde-above": {"above": "nmñ-"},
        "tilde-below": {"below": "2"},
        "a": {"tehta-above": "a"},
        "e": {"tehta-above": "e"},
        "i": {"tehta-above": "i"},
        "o": {"tehta-above": "o"},
        "u": {"tehta-above": "u"},
        "ó": {"tehta-above": "ó"},
        "ú": {"tehta-above": "ú"},
        "í": {"tehta-above": "y"},
        "y": {"tehta-below": "y"},
        "w": {"tehta-above": "w"},
        "full-stop": {"tengwa": "."},
        "exclamation-point": {"tengwa": "!"},
        "question-mark": {"tengwa": "?"},
        "comma": {"tengwa": "-"},
        "open-paren": {"tengwa": "("},
        "close-paren": {"tengwa": ")"},
        "flourish-left": {"tengwa": "“"},
        "flourish-right": {"tengwa": "”"}
    }
};

exports.encode = encode;
function encode(sections) {
    return sections.map(function (section) {
        return section.map(function (paragraph) {
            return paragraph.map(function (line) {
                return line.map(function (word) {
                    return word.map(function (column) {
                        var parts = [];
                        if (column.below)
                            parts.push(column.below);
                        if (column.above)
                            parts.push(column.above);
                        if (column.barAbove)
                            parts.push("bar-above");
                        if (column.barBelow)
                            parts.push("bar-below");
                        if (column.following)
                            parts.push(column.following);
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
function decode(encoding) {
    return encoding.split("\n\n\n").map(function (section) {
        return section.split("\n\n").map(function (paragraph) {
            return paragraph.split("\n").map(function (line) {
                return line.split(" ").map(decodeWord);
            });
        });
    });
}

exports.decodeWord = decodeWord;
function decodeWord(word) {
    return word.split(";").map(function (column) {
        var parts = column.split(":");
        var tengwa = parts.shift();
        var tehtar = parts.length ? parts.shift().split(",") : [];
        var result = makeColumn(tengwa);
        tehtar.forEach(function (tehta) {
            if (tehta === "bar-above") {
                result.addBarAbove();
            } else if (tehta === "bar-below") {
                result.addBarBelow();
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

exports.transcribe = transcribe;
function transcribe(sections) {
    return sections.map(function (section) {
        return section.map(function (paragraph) {
            return paragraph.map(function (line) {
                return line.map(function (word) {
                    return word.map(function (column) {
                        var tengwa = column.tengwa || "anna";
                        var tehtar = [];
                        if (column.above) tehtar.push(column.above);
                        if (column.below) tehtar.push(column.below);
                        if (column.barBelow) tehtar.push("bar-below");
                        if (column.barAbove) tehtar.push("bar-above");
                        if (column.following) tehtar.push(column.following);
                        var html = Font.tengwar[tengwa] + tehtar.map(function (tehta) {
                            return tehtaForTengwa(tengwa, tehta);
                        }).join("");
                        if (column.errors) {
                            html = "<abbr class=\"error\" title=\"" + column.errors.join("\n").replace(/"/g, "&quot;") + "\">" + html + "</abbr>";
                        }
                        return html;
                    }).join("");
                }).join(" ");;
            }).join("\n");
        }).join("\n\n");
    }).join("\n\n\n");
}

exports.tehtaForTengwa = tehtaForTengwa;
function tehtaForTengwa(tengwa, tehta) {
    var tehtaKey = tehtaKeyForTengwa(tengwa, tehta);
    if (tehtaKey === null)
        return null;
    return (
        Font.tehtar[tehta][tengwa] ||
        Font.tehtar[tehta][tehtaKey] ||
        ""
    );
}

function tehtaKeyForTengwa(tengwa, tehta) {
    var positions = Font.tehtaPositions;
    if (!Font.tehtar[tehta])
        throw new Error("No tehta for: " + JSON.stringify(tehta));
    if (Font.tehtar[tehta].special && !Font.tehtar[tehta][tengwa])
        return null;
    if (Font.barsAndTildes.indexOf(tehta) >= 0) {
        if (["lambe", "alda"].indexOf(tengwa) >= 0 && Font.tehtar[tehta].length >= 2)
            return 2;
        return positions[tengwa].wide ? 0 : 1;
    } else if (positions[tengwa] !== undefined) {
        if (positions[tengwa][tehta] !== undefined) {
            return positions[tengwa][tehta];
        } else if (positions[tengwa].others !== undefined) {
            return positions[tengwa].others;
        } else {
            return positions[tengwa];
        }
    }
    return 0;
}

