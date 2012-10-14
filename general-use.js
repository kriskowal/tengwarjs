
var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var Parser = require("./parser");
var makeDocumentParser = require("./document-parser");
var normalize = require("./normalize");
var punctuation = require("./punctuation");
var parseNumber = require("./numbers");

exports.name = "General Use Mode";

var defaults = {};
exports.makeOptions = makeOptions;
function makeOptions(options) {
    options = options || defaults;
    return {
        font: options.font || TengwarAnnatar,
        block: options.block,
        plain: options.plain,
        doubleNasalsWithTildeBelow: options.doubleNasalsWithTildeBelow,
        // Any tengwa can be doubled by placing a tilde above, and any tengwa
        // can be prefixed with the nasal from the same series by putting a
        // tilde below.  Doubled nasals have the special distinction that
        // either of these rules might apply so the tilde can go either above
        // or below.
        // false: by default, place a tilde above doubled nasals.
        // true: place the tilde below doubled nasals.
        reverseCurls: options.reverseCurls || options.blackSpeech,
        // false: by default, o is forward, u is backward
        // true: o is backward, u is forward
        swapDotSlash: options.swapDotSlash,
        // false: by default, e is a slash, i is a dot
        // true: e is a dot, i is a slash
        medialOre: options.medialOre || options.blackSpeech,
        // false: by default, ore only appears in final position
        // true: ore also appears before consonants, as in the ring inscription
        blackSpeech: options.blackSpeech,
        // false: sh is harma, gh is unque
        // true: sh is calma-extended, gh is ungwe-extended, as in the ring
        // inscription
        noAchLaut: options.noAchLaut,
        // false: "ch" is interpreted as ach-laut, "cc" as "ch" as in "chew"
        // true: "ch" is interpreted as "ch" as in chew
        sHook: options.sHook,
        // false: "is" is silme with I tehta
        // true: "is" is short carrier with S hook and I tehta
        tsdz: options.tsdz,
        // false: "ts" and "dz" are rendered as separate characters
        // true: "ts" is IPA "c" and "dz" is IPA "dʒ"
        duodecimal: options.duodecimal
        // false: numbers are decimal by default
        // true: numbers are duodecimal by default
    };
}

exports.transcribe = transcribe;
function transcribe(text, options) {
    options = makeOptions(options);
    var font = options.font;
    return font.transcribe(parse(text, options), options);
}

exports.encode = encode;
function encode(text, options) {
    options = makeOptions(options);
    return Notation.encode(parse(text, options), options);
}

var parse = exports.parse = makeDocumentParser(parseNormalWord, makeOptions);

function parseNormalWord(callback, options) {
    return normalize(parseWord(callback, options));
}

function parseWord(callback, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return scanWord(function (word) {
        if (book[word]) {
            return callback(Notation.decodeWord(book[word], makeColumn));
        } else {
            return callback(parseWordPiecewise(word, options));
        }
    }, options);
}

var book = {
    "iant": "yanta;tinco:a,tilde-above",
    "iaur": "yanta;vala:a;ore",
    "baranduiniant": "umbar;romen:a;ando:a,tilde-above;anna:u;yanta;anto:a,tilde-above",
    "ioreth": "yanta;romen:o;thule:e",
    "noldo": "nwalme;lambe:o;ando;short-carrier:o",
    "noldor": "nwalme;lambe:o;ando;ore:o"
};

function scanWord(callback, options, word) {
    word = word || "";
    return function (character) {
        if (Parser.isBreak(character)) {
            return callback(word)(character);
        } else {
            return scanWord(callback, options, word + character);
        }
    };
}

var parseWordPiecewise = Parser.makeParser(function (callback, options) {
    return parseWordTail(callback, options, []);
});

function parseWordTail(callback, options, columns, previous) {
    return parseColumn(function (moreColumns) {
        if (!moreColumns.length) {
            return callback(columns);
        } else {
            return parseWordTail(
                callback,
                options,
                columns.concat(moreColumns),
                moreColumns[moreColumns.length - 1] // previous
            );
        }
    }, options, previous);
}

function parseColumn(callback, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;

    return parseTehta(function (tehta) {
        return parseTengwa(function (column) {
            if (column) {
                if (tehta) {
                    if (options.reverseCurls) {
                        tehta = reverseCurls[tehta] || tehta;
                    }
                    if (options.swapDotSlash) {
                        tehta = swapDotSlash[tehta] || tehta;
                    }
                    if (column.tengwa === "silme" && tehta && options.sHook) {
                        return callback([
                            makeColumn("short-carrier")
                            .addAbove(tehta)
                            .addBelow("s")
                        ]);
                    } else if (canAddAboveTengwa(tehta) && column.canAddAbove(tehta)) {
                        column.addAbove(tehta);
                        return parseTengwaAnnotations(function (column) {
                            return callback([column]);
                        }, column);
                    } else {
                        // some tengwar inherently lack space above them
                        // and cannot be reversed to make room.
                        // some long tehtar cannot be placed on top of
                        // a tengwa.
                        // put the previous tehta over the appropriate carrier
                        // then follow up with this tengwa.
                        return parseTengwaAnnotations(function (column) {
                            return callback([makeCarrier(tehta, options), column]);
                        }, column);
                    }
                } else {
                    return parseTengwaAnnotations(function (column) {
                        return callback([column]);
                    }, column);
                }
            } else if (tehta) {
                if (options.reverseCurls) {
                    tehta = reverseCurls[tehta] || tehta;
                }
                if (options.swapDotSlash) {
                    tehta = swapDotSlash[tehta] || tehta;
                }
                return parseTengwaAnnotations(function (carrier) {
                    return callback([carrier]);
                }, makeCarrier(tehta, options));
            } else {
                return function (character) {
                    if (Parser.isBreak(character)) {
                        return callback([]);
                    } else if (/\d/.test(character)) {
                        return parseNumber(callback, options)(character);
                    } else if (punctuation[character]) {
                        return callback([makeColumn(punctuation[character])]);
                    } else {
                        return callback([makeColumn("ure").addError("Cannot transcribe " + JSON.stringify(character) + " in General Use Mode")]);
                    }
                };
            }
        }, options, tehta);
    });

}

function makeCarrier(tehta, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    if (tehta === "á") {
        return makeColumn("wilya").addAbove("a");
    } else if (shorterVowels[tehta]) {
        return makeColumn("long-carrier").addAbove(shorterVowels[tehta]);
    } else {
        return makeColumn("short-carrier").addAbove(tehta);
    }
}

function parseTehta(callback) {
    return function (character) {
        if (character === "") {
            return callback();
        } else if (lengthenableVowels.indexOf(character) !== -1) {
            return function (nextCharacter) {
                if (nextCharacter === character) {
                    return callback(longerVowels[character]);
                } else {
                    return callback(character)(nextCharacter);
                }
            };
        } else if (nonLengthenableVowels.indexOf(character) !== -1) {
            return callback(character);
        } else {
            return callback()(character);
        }
    };
}

var lengthenableVowels = "aeiou";
var longerVowels = {"a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"};
var nonLengthenableVowels = "aeióú";
var tehtarThatCanBeAddedAbove = "aeiouóú";
var vowels = "aeiouáéíóú";
var shorterVowels = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u"};
var reverseCurls = {"o": "u", "u": "o", "ó": "ú", "ú": "ó"};
var swapDotSlash = {"i": "e", "e": "i"};

function canAddAboveTengwa(tehta) {
    return tehtarThatCanBeAddedAbove.indexOf(tehta) !== -1;
}

function parseTengwa(callback, options, tehta) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "n") {
            return function (character) {
                if (character === "n") { // nn
                    if (options.doubleNasalsWithTildeBelow) {
                        return callback(makeColumn("numen").addTildeBelow());
                    } else {
                        return callback(makeColumn("numen").addTildeAbove());
                    }
                } else if (character === "t") { // nt
                    return function (character) {
                        if (character === "h") { // nth
                            return callback(makeColumn("thule").addTildeAbove());
                        } else { // nt.
                            return callback(makeColumn("tinco").addTildeAbove())(character);
                        }
                    };
                } else if (character === "d") { // nd
                    return callback(makeColumn("ando").addTildeAbove());
                } else if (character === "c") { // nc -> ñc
                    return callback(makeColumn("quesse").addTildeAbove());
                } else if (character === "g") { // ng -> ñg
                    return callback(makeColumn("ungwe").addTildeAbove());
                } else if (character === "j") { // nj
                    return callback(makeColumn("anca").addTildeAbove());
                } else if (character === "f") { // nf -> nv
                    return callback(makeColumn("numen"))("v");
                } else  if (character === "w") { // nw -> ñw
                    return function (character) {
                        if (character === "a") { // nwa
                            return function (character) { // nwal
                                if (character === "l") {
                                    return callback(makeColumn("nwalme").addAbove("w"))("a")(character);
                                } else { // nwa.
                                    return callback(makeColumn("numen").addAbove("w"))("a")(character);
                                }
                            };
                        } else if (character === "nw'") { // nw' prime -> ñw
                            return callback(makeColumn("nwalme").addAbove("w"));
                        } else { // nw.
                            return callback(makeColumn("numen").addAbove("w"))(character);
                        }
                    };
                } else { // n.
                    return callback(makeColumn("numen"))(character);
                }
            };
        } else if (character === "m") { // m
            return function (character) {
                if (character === "m") { // mm
                    if (options.doubleNasalsWithTildeBelow) {
                        return callback(makeColumn("malta").addTildeBelow());
                    } else {
                        return callback(makeColumn("malta").addTildeAbove());
                    }
                } else if (character === "p") { // mp
                    // mph is simplified to mf using the normalizer
                    return callback(makeColumn("parma").addTildeAbove());
                } else if (character === "b") { // mb
                    // mbh is simplified to mf using the normalizer
                    return callback(makeColumn("umbar").addTildeAbove());
                } else if (character === "f") { // mf
                    return callback(makeColumn("formen").addTildeAbove());
                } else if (character === "v") { // mv
                    return callback(makeColumn("ampa").addTildeAbove());
                } else { // m.
                    return callback(makeColumn("malta"))(character);
                }
            };
        } else if (character === "ñ") { // ñ
            return function (character) {
                // ññ does not exist to the best of my knowledge
                // ñw is handled naturally by following w
                if (character === "c") { // ñc
                    return callback(makeColumn("quesse").addTildeAbove());
                } else if (character === "g") { // ñg
                    return callback(makeColumn("ungwe").addTildeAbove());
                } else { // ñ.
                    return callback(makeColumn("nwalme"))(character);
                }
            };
        } else if (character === "t") { // t
            return function (character) {
                if (character === "t") { // tt
                    return callback(makeColumn("tinco").addTildeBelow());
                } else if (character === "h") { // th
                    return callback(makeColumn("thule"));
                } else if (character === "c") { // tc
                    return function (character) {
                        if (character === "h") { // tch -> tinco calma
                            return callback(makeColumn("tinco"))("c")("h")("'");
                        } else {
                            return callback(makeColumn("tinco"))("c")(character);
                        }
                    };
                } else if (character === "s" && options.tsdz) { // ts
                    return callback(makeColumn("calma"));
                } else { // t.
                    return callback(makeColumn("tinco"))(character);
                }
            };
        } else if (character === "p") { // p
            return function (character) {
                // ph is simplified to f by the normalizer
                if (character === "p") { // pp
                    return callback(makeColumn("parma").addTildeBelow());
                } else { // p.
                    return callback(makeColumn("parma"))(character);
                }
            };
        } else if (character === "c") { // c
            return function (character) {
                // cw should be handled either by following-w or a subsequent
                // vala
                if (character === "c") { // ch as in charm
                    return callback(makeColumn("calma"));
                } else if (character === "h") { // ch, ach-laut, as in bach
                    return Parser.countPrimes(function (primes) {
                        if (options.noAchLaut && !primes) {
                            return callback(makeColumn("calma")); // ch as in charm
                        } else {
                            return callback(makeColumn("hwesta")); // ch as in bach
                        }
                    });
                } else { // c.
                    return callback(makeColumn("quesse"))(character);
                }
            };
        } else if (character === "d") {
            return function (character) {
                if (character === "d") { // dd
                    return callback(makeColumn("ando").addTildeBelow());
                } else if (character === "j") { // dj
                    return callback(makeColumn("anga"));
                } else if (character === "z" && options.tsdz) { // dz
                    return callback(makeColumn("anga"));
                } else if (character === "h") { // dh
                    return callback(makeColumn("anto"));
                } else { // d.
                    return callback(makeColumn("ando"))(character);
                }
            };
        } else if (character === "b") { // b
            return function (character) {
                // bh is simplified to v by the normalizer
                if (character === "b") { // bb
                    return callback(makeColumn("umbar").addTildeBelow());
                } else { // b.
                    return callback(makeColumn("umbar"))(character);
                }
            };
        } else if (character === "g") { // g
            return function (character) {
                if (character === "g") { // gg
                    return callback(makeColumn("ungwe").addTildeBelow());
                } else if (character === "h") { // gh
                    if (options.blackSpeech) {
                        return callback(makeColumn("ungwe-extended"));
                    } else {
                        return callback(makeColumn("unque"));
                    }
                } else { // g.
                    return callback(makeColumn("ungwe"))(character);
                }
            };
        } else if (character === "f") { // f
            return function (character) {
                if (character === "f") { // ff
                    return callback(makeColumn("formen").addTildeBelow());
                } else { // f.
                    return callback(makeColumn("formen"))(character);
                }
            };
        } else if (character === "v") { // v
            return callback(makeColumn("ampa"));
        } else if (character === "j") { // j
            return callback(makeColumn("anca"));
        } else if (character === "s") { // s
            return function (character) {
                if (character === "s") { // ss
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var column = makeColumn(tengwa).addTildeBelow();
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column);
                    });
                } else if (character === "h") { // sh
                    if (options.blackSpeech) {
                        return callback(makeColumn("calma-extended"));
                    } else {
                        return callback(makeColumn("harma"));
                    }
                } else { // s.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var column = makeColumn(tengwa);
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column);
                    })(character);
                }
            };
        } else if (character === "z") { // z
            return function (character) {
                if (character === "z") { // zz
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "esse-nuquerna" : "esse";
                        var column = makeColumn(tengwa).addTildeBelow();
                        if (primes > 1) {
                            column.addError("Esse does not have this many alternate forms.");
                        }
                        return callback(column);
                    });
                } else { // z.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "esse-nuquerna" : "esse";
                        var column = makeColumn(tengwa);
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column);
                    })(character);
                }
            };
        } else if (character === "h") { // h
            return function (character) {
                if (character === "w") { // hw
                    return callback(makeColumn("hwesta-sindarinwa"));
                } else { // h.
                    return callback(makeColumn("hyarmen"))(character);
                }
            };
        } else if (character === "r") { // r
            return function (character) {
                if (character === "r") { // rr
                    return callback(makeColumn("romen").addTildeBelow());
                } else if (character === "h") { // rh
                    return callback(makeColumn("arda"));
                } else if (
                    Parser.isFinal(character) || (
                        options.medialOre &&
                        vowels.indexOf(character) === -1
                    )
                ) { // r final (optionally r before consonant)
                    return callback(makeColumn("ore"))(character);
                } else { // r.
                    return callback(makeColumn("romen"))(character);
                }
            };
        } else if (character === "l") {
            return function (character) {
                if (character === "l") { // ll
                    return callback(makeColumn("lambe").addTildeBelow());
                } else if (character === "h") { // lh
                    return callback(makeColumn("alda"));
                } else { // l.
                    return callback(makeColumn("lambe"))(character);
                }
            };
        } else if (character === "i") { // i
            return callback(makeColumn("anna"));
        } else if (character === "u") { // u
            return callback(makeColumn("vala"));
        } else if (character === "w") { // w
            return function (character) {
                if (character === "h") { // wh
                    return callback(makeColumn("hwesta-sindarinwa"));
                } else { // w.
                    return callback(makeColumn("vala"))(character);
                }
            };
        } else if (character === "e" && (!tehta || tehta === "a")) { // ae or e after consonants
            return callback(makeColumn("yanta"));
        } else if (character === "y") {
            return callback(makeColumn("wilya").addBelow("y"));
            // TODO consider alt: return callback(makeColumn("long-carrier").addAbove("i"));
        } else if (shorterVowels[character]) {
            return callback(makeCarrier(character, options).addAbove(shorterVowels[character]));
        } else {
            return callback()(character);
        }
    };
}

exports.parseTengwaAnnotations = parseTengwaAnnotations;
function parseTengwaAnnotations(callback, column) {
    return parseFollowingAbove(function (column) {
        return parseFollowingBelow(function (column) {
            return parseFollowing(callback, column);
        }, column);
    }, column);
}

// add a following-w above the current character if the next character is W and
// there is room for it.
function parseFollowingAbove(callback, column) {
    if (column.canAddAbove("w")) {
        return function (character) {
            if (character === "w") {
                return callback(column.addAbove("w"));
            } else {
                return callback(column)(character);
            }
        };
    } else {
        return callback(column);
    }
}

function parseFollowingBelow(callback, column) {
    return function (character) {
        if (character === "y" && column.canAddBelow("y")) {
            return callback(column.addBelow("y"));
        } else if (character === "e" && column.canAddBelow("i-below")) {
            return Parser.countPrimes(function (primes) {
                if (primes === 0) {
                    return callback(column)(character);
                } else {
                    if (primes > 1) {
                        column.addError("Following E has only one variation.");
                    }
                    return callback(column.addBelow("i-below"));
                }
            });
        } else {
            return callback(column)(character);
        }
    };
}

function parseFollowing(callback, column) {
    return function (character) {
        if (character === "s") {
            if (column.canAddBelow("s")) {
                return Parser.countPrimes(function (primes, rewind) {
                    if (primes === 0) {
                        return callback(column.addBelow("s"));
                    } else if (primes) {
                        if (primes > 1) {
                            column.addError("Only one alternate form for following S.");
                        }
                        return rewind(callback(column)("s"));
                    }
                });
            } else {
                return Parser.countPrimes(function (primes, rewind) {
                    return function (character) {
                        if (Parser.isFinal(character)) { // end of word
                            if (column.canAddFollowing("s-final") && primes-- === 0) {
                                column.addFollowing("s-final");
                            } else if (column.canAddFollowing("s-inverse") && primes -- === 0) {
                                column.addFollowing("s-inverse");
                            } else if (column.canAddFollowing("s-extended") && primes-- === 0) {
                                column.addFollowing("s-extended");
                            } else if (column.canAddFollowing("s-flourish") && primes-- === 0) {
                                column.addFollowing("s-flourish");
                            } else {
                                var state = callback(column)("s");
                                while (primes-- > 0) {
                                    state = state("'");
                                }
                                return state;
                            }
                            return callback(column);
                        } else {
                            return rewind(callback(column)("s"))(character);
                        }
                    };
                });
            }
        } else {
            return callback(column)(character);
        }
    };
}

