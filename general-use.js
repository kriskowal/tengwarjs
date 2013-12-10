
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
    // legacy
    if (options.blackSpeech) {
        options.language = "blackSpeech";
    }
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
        reverseCurls: options.reverseCurls || options.language === "blackSpeech",
        // false: by default, o is forward, u is backward
        // true: o is backward, u is forward
        swapDotSlash: options.swapDotSlash,
        // false: by default, e is a slash, i is a dot
        // true: e is a dot, i is a slash
        medialOre: options.medialOre || options.language === "blackSpeech",
        // false: by default, ore only appears in final position
        // true: ore also appears before consonants, as in the ring inscription
        language: options.language,
        // by default, no change
        // "english": final e implicitly silent
        // "black speech": sh is calma-extended, gh is ungwe-extended, as in
        // the ring inscription
        // not "blackSpeech": sh is harma, gh is unque
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
        if (options.language === "english" && word === "of") {
            return function (character) {
                var of = Notation.decodeWord(englishBook[word], makeColumn);
                if (character === " ") {
                    return scanWord(function (word, rewind) {
                        if (word === "the") {
                            return callback(Notation.decodeWord(englishBook["of the"], makeColumn));
                        } else {
                            return rewind(callback(of)(character));
                        }
                    });
                } else {
                    return callback(of)(character);
                }
            };
        } else if (options.language === "english" && englishBook[word]) {
            return callback(Notation.decodeWord(englishBook[word], makeColumn));
        } else if (book[word]) {
            return callback(Notation.decodeWord(book[word], makeColumn));
        } else {
            return callback(parseWordPiecewise(word, word.length, options));
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

var englishBook = {
    "of": "umbar-extended",
    "of'": "umbar-extended:u",
    "of the": "umbar-extended:tilde-below",
    "of'the": "umbar-extended ando-extended",
    "the": "ando-extended",
    "the'": "ando-extended:i-below",
    "and": "ando:tilde-above",
    "and'": "ando:tilde-above,i-below",
    "we": "vala:y"
};

function scanWord(callback, options, word, rewind) {
    word = word || "";
    rewind = rewind || function (state) {
        return state;
    };
    return function (character) {
        if (Parser.isBreak(character)) {
            return callback(word, rewind)(character);
        } else {
            return scanWord(callback, options, word + character, function (state) {
                return rewind(state)(character);
            });
        }
    };
}

var parseWordPiecewise = Parser.makeParser(function (callback, length, options) {
    return parseWordTail(callback, length, options, []);
});

function parseWordTail(callback, length, options, columns, previous) {
    return parseColumn(function (moreColumns) {
        if (!moreColumns.length) {
            return callback(columns);
        } else {
            return parseWordTail(
                callback,
                length,
                options,
                columns.concat(moreColumns),
                moreColumns[moreColumns.length - 1] // previous
            );
        }
    }, length, options, previous);
}

function parseColumn(callback, length, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;

    return parseTehta(function (tehta) {
        return parseTengwa(function (column, tehta) {
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
                        }, column, length, options);
                    } else {
                        // some tengwar inherently lack space above them
                        // and cannot be reversed to make room.
                        // some long tehtar cannot be placed on top of
                        // a tengwa.
                        // put the previous tehta over the appropriate carrier
                        // then follow up with this tengwa.
                        return parseTengwaAnnotations(function (column) {
                            return callback([makeCarrier(tehta, options), column]);
                        }, column, length, options);
                    }
                } else {
                    return parseTengwaAnnotations(function (column) {
                        return callback([column]);
                    }, column, length, options);
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
                }, makeCarrier(tehta, options), length, options);
            } else {
                return function (character) {
                    if (Parser.isBreak(character)) {
                        return callback([]);
                    } else if (/\d/.test(character)) {
                        return parseNumber(callback, options)(character);
                    } else if (punctuation[character]) {
                        return callback([makeColumn(punctuation[character])]);
                    } else {
                        return callback([
                            makeColumn("ure")
                            .addError(
                                "Cannot transcribe " +
                                JSON.stringify(character) +
                                " in General Use Mode"
                            )
                        ]);
                    }
                };
            }
        }, options, tehta);
    }, options);

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

function parseTehta(callback, options) {
    return function (character) {
        var firstCharacter = character;
        if (character === "ë" && options.language !== "english") {
            character = "e";
        }
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
var vowels = "aeëiouáéíóú";
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
                        return callback(makeColumn("numen").addTildeBelow(), tehta);
                    } else {
                        return callback(makeColumn("numen").addTildeAbove(), tehta);
                    }
                } else if (character === "t") { // nt
                    return function (character) {
                        if (character === "h") { // nth
                            return callback(makeColumn("thule").addTildeAbove(), tehta);
                        } else { // nt.
                            return callback(makeColumn("tinco").addTildeAbove(), tehta)(character);
                        }
                    };
                } else if (character === "d") { // nd
                    return callback(makeColumn("ando").addTildeAbove(), tehta);
                } else if (character === "c") { // nc -> ñc
                    return callback(makeColumn("quesse").addTildeAbove(), tehta);
                } else if (character === "g") { // ng -> ñg
                    return callback(makeColumn("ungwe").addTildeAbove(), tehta);
                } else if (character === "j") { // nj
                    return callback(makeColumn("anca").addTildeAbove(), tehta);
                } else if (character === "f") { // nf -> nv
                    return callback(makeColumn("numen"), tehta)("v");
                } else  if (character === "w") { // nw -> ñw
                    return function (character) {
                        if (character === "a") { // nwa
                            return function (character) { // nwal
                                if (character === "l") {
                                    return callback(makeColumn("nwalme").addAbove("w"), tehta)("a")(character);
                                } else { // nwa.
                                    return callback(makeColumn("numen").addAbove("w"), tehta)("a")(character);
                                }
                            };
                        } else if (character === "nw'") { // nw' prime -> ñw
                            return callback(makeColumn("nwalme").addAbove("w"), tehta);
                        } else { // nw.
                            return callback(makeColumn("numen").addAbove("w"), tehta)(character);
                        }
                    };
                } else { // n.
                    return callback(makeColumn("numen"), tehta)(character);
                }
            };
        } else if (character === "m") { // m
            return function (character) {
                if (character === "m") { // mm
                    if (options.doubleNasalsWithTildeBelow) {
                        return callback(makeColumn("malta").addTildeBelow(), tehta);
                    } else {
                        return callback(makeColumn("malta").addTildeAbove(), tehta);
                    }
                } else if (character === "p") { // mp
                    // mph is simplified to mf using the normalizer
                    return callback(makeColumn("parma").addTildeAbove(), tehta);
                } else if (character === "b") { // mb
                    // mbh is simplified to mf using the normalizer
                    return callback(makeColumn("umbar").addTildeAbove(), tehta);
                } else if (character === "f") { // mf
                    return callback(makeColumn("formen").addTildeAbove(), tehta);
                } else if (character === "v") { // mv
                    return callback(makeColumn("ampa").addTildeAbove(), tehta);
                } else { // m.
                    return callback(makeColumn("malta"), tehta)(character);
                }
            };
        } else if (character === "ñ") { // ñ
            return function (character) {
                // ññ does not exist to the best of my knowledge
                // ñw is handled naturally by following w
                if (character === "c") { // ñc
                    return callback(makeColumn("quesse").addTildeAbove(), tehta);
                } else if (character === "g") { // ñg
                    return callback(makeColumn("ungwe").addTildeAbove(), tehta);
                } else { // ñ.
                    return callback(makeColumn("nwalme"), tehta)(character);
                }
            };
        } else if (character === "t") { // t
            return function (character) {
                if (character === "t") { // tt
                    return callback(makeColumn("tinco").addTildeBelow(), tehta);
                } else if (character === "h") { // th
                    return callback(makeColumn("thule"), tehta);
                } else if (character === "c") { // tc
                    return function (character) {
                        if (character === "h") { // tch -> tinco calma
                            return callback(makeColumn("tinco"), tehta)("c")("h")("'");
                        } else {
                            return callback(makeColumn("tinco"), tehta)("c")(character);
                        }
                    };
                } else if (character === "s" && options.tsdz) { // ts
                    return callback(makeColumn("calma"), tehta);
                } else { // t.
                    return callback(makeColumn("tinco"), tehta)(character);
                }
            };
        } else if (character === "p") { // p
            return function (character) {
                // ph is simplified to f by the normalizer
                if (character === "p") { // pp
                    return callback(makeColumn("parma").addTildeBelow(), tehta);
                } else { // p.
                    return callback(makeColumn("parma"), tehta)(character);
                }
            };
        } else if (character === "c") { // c
            return function (character) {
                // cw should be handled either by following-w or a subsequent
                // vala
                if (character === "c") { // ch as in charm
                    return callback(makeColumn("calma"), tehta);
                } else if (character === "h") { // ch, ach-laut, as in bach
                    return Parser.countPrimes(function (primes) {
                        if (options.noAchLaut && !primes) {
                            return callback(makeColumn("calma"), tehta); // ch as in charm
                        } else {
                            return callback(makeColumn("hwesta"), tehta); // ch as in bach
                        }
                    });
                } else { // c.
                    return callback(makeColumn("quesse"), tehta)(character);
                }
            };
        } else if (character === "d") {
            return function (character) {
                if (character === "d") { // dd
                    return callback(makeColumn("ando").addTildeBelow(), tehta);
                } else if (character === "j") { // dj
                    return callback(makeColumn("anga"), tehta);
                } else if (character === "z" && options.tsdz) { // dz
                    return callback(makeColumn("anga"), tehta);
                } else if (character === "h") { // dh
                    return callback(makeColumn("anto"), tehta);
                } else { // d.
                    return callback(makeColumn("ando"), tehta)(character);
                }
            };
        } else if (character === "b") { // b
            return function (character) {
                // bh is simplified to v by the normalizer
                if (character === "b") { // bb
                    return callback(makeColumn("umbar").addTildeBelow(), tehta);
                } else { // b.
                    return callback(makeColumn("umbar"), tehta)(character);
                }
            };
        } else if (character === "g") { // g
            return function (character) {
                if (character === "g") { // gg
                    return callback(makeColumn("ungwe").addTildeBelow(), tehta);
                } else if (character === "h") { // gh
                    if (options.language === "blackSpeech") {
                        return callback(makeColumn("ungwe-extended"), tehta);
                    } else {
                        return callback(makeColumn("unque"), tehta);
                    }
                } else { // g.
                    return callback(makeColumn("ungwe"), tehta)(character);
                }
            };
        } else if (character === "f") { // f
            return function (character) {
                if (character === "f") { // ff
                    return callback(makeColumn("formen").addTildeBelow(), tehta);
                } else { // f.
                    return callback(makeColumn("formen"), tehta)(character);
                }
            };
        } else if (character === "v") { // v
            return callback(makeColumn("ampa"), tehta);
        } else if (character === "j") { // j
            return callback(makeColumn("anca"), tehta);
        } else if (character === "s") { // s
            return function (character) {
                if (character === "s") { // ss
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var column = makeColumn(tengwa).addTildeBelow();
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta);
                    });
                } else if (character === "h") { // sh
                    if (options.language === "blackSpeech") {
                        return callback(makeColumn("calma-extended"), tehta);
                    } else {
                        return callback(makeColumn("harma"), tehta);
                    }
                } else { // s.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var column = makeColumn(tengwa);
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta);
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
                        return callback(column, tehta);
                    });
                } else { // z.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "esse-nuquerna" : "esse";
                        var column = makeColumn(tengwa);
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta);
                    })(character);
                }
            };
        } else if (character === "h") { // h
            return function (character) {
                if (character === "w") { // hw
                    return callback(makeColumn("hwesta-sindarinwa"), tehta);
                } else { // h.
                    return callback(makeColumn("hyarmen"), tehta)(character);
                }
            };
        } else if (character === "r") { // r
            return function (character) {
                if (character === "r") { // rr
                    return callback(makeColumn("romen").addTildeBelow(), tehta);
                } else if (character === "h") { // rh
                    return callback(makeColumn("arda"), tehta);
                } else if (
                    Parser.isFinal(character) || (
                        options.medialOre &&
                        vowels.indexOf(character) === -1
                    )
                ) { // r final (optionally r before consonant)
                    return callback(makeColumn("ore"), tehta)(character);
                } else { // r.
                    return callback(makeColumn("romen"), tehta)(character);
                }
            };
        } else if (character === "l") {
            return function (character) {
                if (character === "l") { // ll
                    return callback(makeColumn("lambe").addTildeBelow(), tehta);
                } else if (character === "h") { // lh
                    return callback(makeColumn("alda"), tehta);
                } else { // l.
                    return callback(makeColumn("lambe"), tehta)(character);
                }
            };
        } else if (character === "i") { // i
            return callback(makeColumn("anna"), tehta);
        } else if (character === "u") { // u
            return callback(makeColumn("vala"), tehta);
        } else if (character === "w") { // w
            return function (character) {
                if (character === "h") { // wh
                    return callback(makeColumn("hwesta-sindarinwa"), tehta);
                } else { // w.
                    return callback(makeColumn("vala"), tehta)(character);
                }
            };
        } else if (character === "e" && (!tehta || tehta === "a")) { // ae or e after consonants
            return callback(makeColumn("yanta"), tehta);
        } else if (character === "ë") { // if "ë" makes it this far, it's a diaresis for english
            return callback(makeColumn("short-carrier").addAbove("e"));
        } else if (character === "y") {
            return Parser.countPrimes(function (primes) {
                if (primes === 0) {
                    return callback(makeColumn("wilya").addBelow("y"), tehta);
                } else if (primes === 1) {
                    return callback(makeColumn("long-carrier").addAbove("i"), tehta);
                } else {
                    return callback(makeColumn("ure").addError("Consonantal Y only has one variation"));
                }
            });
        } else if (shorterVowels[character]) {
            return callback(makeCarrier(character, options).addAbove(shorterVowels[character]), tehta);
        } else if (character === "'" && options.language === "english" && tehta === "e") {
            // final e' in english should be equivalent to diaresis
            return callback(makeColumn("short-carrier").addAbove("e"));
        } else if (character === "" && options.language === "english" && tehta === "e") {
            // tehta deliberately consumed in this one case, not passed forward
            return callback(makeColumn("short-carrier").addBelow("i-below"))(character);
        } else {
            return callback(null, tehta)(character);
        }
    };
}

exports.parseTengwaAnnotations = parseTengwaAnnotations;
function parseTengwaAnnotations(callback, column, length, options) {
    return parseFollowingAbove(function (column) {
        return parseFollowingBelow(function (column) {
            return parseFollowing(callback, column);
        }, column, length, options);
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

function parseFollowingBelow(callback, column, length, options) {
    return function (character) {
        if (character === "ë" && options.language !== "english") {
            character = "e";
        }
        if (character === "y" && column.canAddBelow("y")) {
            return callback(column.addBelow("y"));
        } else if (character === "e" && column.canAddBelow("i-below")) {
            return Parser.countPrimes(function (primes) {
                return function (character) {
                    if (Parser.isFinal(character) && options.language === "english" && length > 2) {
                        if (primes === 0) {
                            return callback(column.addBelow("i-below"))(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column)("e")(character);
                        }
                    } else {
                        if (primes === 0) {
                            return callback(column)("e")(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column.addBelow("i-below"))(character);
                        }
                    }
                };
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
                            return callback(column)(character);
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

