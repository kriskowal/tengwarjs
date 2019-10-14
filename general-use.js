
var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var Parser = require("./parser");
var makeDocumentParser = require("./document-parser");
var punctuation = require("./punctuation");
var parseNumber = require("./numbers");

exports.name = "Mode for general use";

var defaults = {};
exports.makeOptions = makeOptions;
function makeOptions(options) {
    options = options || defaults;
    // legacy
    if (options.blackSpeech) {
        options.language = "blackSpeech";
    }
    if (options.language === "blackSpeech") {
        options.language = "black-speech";
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
        reverseCurls: options.reverseCurls || options.language === "black-speech",
        // false: by default, o is forward, u is backward
        // true: o is backward, u is forward
        swapDotSlash: options.swapDotSlash,
        // false: by default, e is a slash, i is a dot
        // true: e is a dot, i is a slash
        medialOre: options.medialOre || options.language === "black-speech",
        // false: by default, ore only appears in final position
        // true: ore also appears before consonants, as in the ring inscription
        language: options.language,
        // by default, no change
        // "english": final e implicitly silent
        // "black speech": sh is calma-extended, gh is ungwe-extended, as in
        // the ring inscription
        // not "black-speech": sh is harma, gh is unque
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
    return font.transcribe(parse(text.toLowerCase(), options), options);
}

exports.encode = encode;
function encode(text, options) {
    options = makeOptions(options);
    return Notation.encode(parse(text.toLowerCase(), options), options);
}

var parse = exports.parse = makeDocumentParser(parseWord, makeOptions);

function parseWord(callback, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return scanWord(function (word, rewind) {
        if (options.language === "english") {
            if (word === "of") {
                return function (character) {
                    if (Parser.isBreak(character)) {
                        return scanWord(function (word, rewind) {
                            if (word === "the") {
                                return callback([
                                    makeOfThe(makeColumn)
                                ]);
                            } else if (word === "the`") {
                                return callback([
                                    makeOf(makeColumn),
                                    makeThePrime(makeColumn)
                                ]);
                            } else if (word === "the``") {
                                return callback([
                                    makeOf(makeColumn),
                                    makeThePrime(makeColumn)
                                ]);
                            } else {
                                return rewind(callback([
                                    makeOf(makeColumn)
                                ]));
                            }
                        });
                    } else {
                        return callback([makeOf(makeColumn)])(character);
                    }
                }
            } else if (word === "of`") {
                return scanWord(function (word, rewind) {
                    if (word === "the") {
                        return callback([
                            makeOfPrime(makeColumn),
                            makeThe(makeColumn)
                        ]);
                    } else if (word === "the`") {
                        return callback([
                            makeOfPrime(makeColumn),
                            makeThePrime(makeColumn)
                        ]);
                    } else if (word === "the``") {
                        return callback([
                            makeOfPrime(makeColumn),
                            makeThePrimePrime(makeColumn)
                        ]);
                    } else {
                        return rewind(callback([
                            makeOfPrime(makeColumn)
                        ]));
                    }
                });
            } else if (word === "the") {
                return callback([
                    makeThe(makeColumn)
                ]);
            } else if (word === "the`") {
                return callback([
                    makeThePrime(makeColumn)
                ]);
            } else if (word === "the``") {
                return callback([
                    makeThePrimePrime(makeColumn)
                ]);
            } else if (word === "of`the") {
                return callback([
                    makeOf(makeColumn),
                ])("t")("h")("e");
            } else if (word === "of`the`") {
                return callback([
                    makeOfPrime(makeColumn)
                ])("t")("h")("e")("`");
            } else if (word === "and") {
                return callback([
                    makeAnd(makeColumn)
                ]);
            } else if (word === "and`") {
                return callback([
                    makeAndPrime(makeColumn)
                ]);
            } else if (word === "and``") {
                return callback([
                    makeAndPrimePrime(makeColumn)
                ]);
            } else if (word === "we") {
                return callback([
                    makeColumn("vala", {from: "w"}),
                    makeColumn("short-carrier", {from: ""})
                        .addAbove("e", {from: "e"})
                        .varies()
                ]);
            } else if (word === "we`") { // Unattested, my invention - kriskowal
                return callback([
                    makeColumn("vala", {from: "w", diphthong: true})
                        .addBelow("y", {from: "ē"})
                ]);
            }
        }
        if (book[word]) {
            return callback(Notation.decodeWord(book[word], makeColumn), {
                from: word
            });
        } else {
            return callback(parseWordPiecewise(word, word.length, options), word);
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

// TODO Fix bug where "of", "the", and "and" decompose with following
// punctuation.
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

function makeOf(makeColumn) {
    return makeColumn("umbar-extended", {from: "of"})
        .varies();
}

function makeOfPrime(makeColumn) {
    return makeOf(makeColumn)
        .addAbove("o", {from: "o", silent: true})
        .varies(); // TODO is this supposed to be u above?
}

function makeOfPrimePrime(makeColumn) {
    return makeColumn("formen", {from: "f"})
        .addAbove("o", {from: "o"});
}

function makeThe(makeColumn) {
    return makeColumn("ando-extended", {from: "the"})
        .varies();
}

function makeThePrime(makeColumn) {
    return makeThe(makeColumn).addBelow("i-below", {from: ""})
        .varies();
}

function makeThePrimePrime(makeColumn) {
    return makeColumn("thule", {from: "th"}).addBelow("i-below", {from: "e", silent: true});
}

function makeOfThe(makeColumn) {
    return makeColumn("umbar-extended", {from: "of the"})
        .addTildeBelow({from: ""});
}

function makeAnd(makeColumn) {
    return makeColumn("ando", {from: "and"})
        .addTildeAbove({from: ""});
}

function makeAndPrime(makeColumn) {
    return makeAnd(makeColumn)
        .addBelow("i-below", {from: ""})
        .varies();
}

function makeAndPrimePrime(makeColumn) {
    return makeColumn("ando", {from: "d"})
        .addTildeAbove("n", {from: "n"})
        .addAbove("a", {from: "a"});
}

function parseColumn(callback, length, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;

    return parseTehta(function (tehta, tehtaFrom) {
        if (tehta === "y" && options.language === "english" && previous == null) {
            return callback([makeColumn("anna", {from: "y (initial)"})]);
        }
        return parseTengwa(function (column, tehta, tehtaFrom) {
            if (tehta) {
                if (options.reverseCurls) {
                    tehta = reverseCurls[tehta] || tehta;
                }
                if (options.swapDotSlash) {
                    tehta = swapDotSlash[tehta] || tehta;
                }
            }
            if (column) {
                if (tehta) {
                    if (column.tengwa === "silme" && tehta && options.sHook) {
                        return callback([
                            makeColumn("short-carrier", {from: ""})
                            .addAbove(tehta, {from: tehtaFrom})
                            .addBelow("s", {from: "s"})
                        ]);
                    } else if (tehta === "y") {
                        var columns = [column];
                        if (options.language === "english" && column.canAddAbove("y-english")) {
                            column.addAbove("y-english", {from: tehtaFrom});
                        } else if (column.canAddAbove("y-sindarin")) {
                            column.addAbove("y-sindarin", {from: tehtaFrom});
                        } else {
                            columns.push(makeColumn("anna", {from: "y"}));
                        }
                        return parseTengwaAnnotations(function (column) {
                            return callback(columns);
                        }, column, length, options);
                    } else if (canAddAboveTengwa(tehta) && column.canAddAbove(tehta)) {
                        column.addAbove(tehta, {from: tehtaFrom});
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
                            return callback([makeCarrier(tehta, tehtaFrom, options), column]);
                        }, column, length, options);
                    }
                } else {
                    return parseTengwaAnnotations(function (column) {
                        return callback([column]);
                    }, column, length, options);
                }
            } else if (tehta === "y") {
                var column;
                if (options.language === "english") {
                    column = makeColumn("short-carrier").addAbove("y-english", {from: "y"});
                } else {
                    column = makeColumn("short-carrier").addAbove("y-sindarin", {from: "y"});
                }
                return parseTengwaAnnotations(function (column) {
                    return callback([column]);
                }, column, length, options);
            } else if (tehta) {
                return parseTengwaAnnotations(function (carrier) {
                    return callback([carrier]);
                }, makeCarrier(tehta, tehtaFrom, options), length, options);
            } else {
                return function (character) {
                    if (Parser.isBreak(character)) {
                        return callback([]);
                    } else if (/\d/.test(character)) {
                        return parseNumber(callback, options)(character);
                    } else if (punctuation[character]) {
                        return callback([makeColumn(punctuation[character], {from: character})]);
                    } else {
                        return callback([
                            makeColumn("ure", {from: character})
                            .addError(
                                "Cannot transcribe " +
                                JSON.stringify(character) +
                                " in General Use Mode"
                            )
                        ]);
                    }
                };
            }
        }, options, tehta, tehtaFrom);
    }, options);

}

function makeCarrier(tehta, tehtaFrom, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    if (tehta === "á") {
        return makeColumn("wilya", {from: "a"})
            .addAbove("a", {from: "a"});
    } else if (shorterVowels[tehta]) {
        return makeColumn("long-carrier", {from: tehtaFrom})
            .addAbove(shorterVowels[tehta], {from: ""});
    } else {
        return makeColumn("short-carrier", {from: tehtaFrom})
            .addAbove(tehta, {from: ""});
    }
}

function parseTehta(callback, options) {
    return function (character) {
        var from = character;
        if (character === "ë" && options.language !== "english") {
            character = "e";
        }
        character = normalVowels[character] || character;
        if (character === "") {
            return callback();
        } else if (lengthenableVowels.indexOf(character) !== -1) {
            return function (nextCharacter) {
                // Doubling vowels as in the English word GREEN is generally
                // rendered orthographically, with two separate E tehtar.
                // However, in other languages, it is convenient to allow users
                // who do not have ready access to diacrtics on their keyboard
                // the ability to get a long vowel by doubling.
                if (options.language !== "english" && nextCharacter === character) { // doubled
                    return callback(longerVowels[character], character + nextCharacter);
                } else {
                    return callback(character, from)(nextCharacter);
                }
            };
        } else if (nonLengthenableVowels.indexOf(character) !== -1) {
            return callback(character, from);
        } else {
            return callback()(from);
        }
    };
}

var normalVowels = {"â": "á", "ê": "é", "î": "í", "ô": "ó", "û": "ú"};
var lengthenableVowels = "aeiou";
var longerVowels = {"a": "á", "e": "é", "i": "í", "o": "ó", "u": "ú"};
var nonLengthenableVowels = "aeióúy";
var tehtarThatCanBeAddedAbove = "aeiouóú";
var vowels = "aeëiouáéíóú";
var shorterVowels = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u"};
var reverseCurls = {"o": "u", "u": "o", "ó": "ú", "ú": "ó"};
var swapDotSlash = {"i": "e", "e": "i"};

function canAddAboveTengwa(tehta) {
    return tehtarThatCanBeAddedAbove.indexOf(tehta) !== -1;
}

function parseTengwa(callback, options, tehta, tehtaFrom) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "n") {
            return function (character) {
                if (character === "n") { // nn
                    if (options.doubleNasalsWithTildeBelow) {
                        return callback(
                            makeColumn("numen", {from: "n"})
                                .addTildeBelow({from: "n"}),
                            tehta,
                            tehtaFrom
                        );
                    } else {
                        return callback(
                            makeColumn("numen", {from: "n"})
                                .addTildeAbove({from: "n"}),
                            tehta,
                            tehtaFrom
                        );
                    }
                } else if (character === "t") { // nt
                    return function (character) {
                        if (character === "h") { // nth
                            return callback(
                                makeColumn("thule", {from: "th"})
                                    .addTildeAbove({from: "n"}),
                                tehta,
                                tehtaFrom
                            );
                        } else { // nt.
                            return callback(
                                makeColumn("tinco", {from: "t"})
                                    .addTildeAbove({from: "n"}),
                                tehta,
                                tehtaFrom
                            )(character);
                        }
                    };
                } else if (character === "d") { // nd
                    return callback(makeColumn("ando", {from: "d"}).addTildeAbove({from: "n"}), tehta, tehtaFrom);
                } else if (character === "c" || character === "k") { // nc -> ñc
                    return callback(makeColumn("quesse", {from: character}).addTildeAbove({from: "ñ"}), tehta, tehtaFrom);
                } else if (character === "g") { // ng -> ñg
                    return callback(makeColumn("ungwe", {from: "g"}).addTildeAbove({from: "ñ"}), tehta, tehtaFrom);
                } else if (character === "j") { // nj
                    return callback(makeColumn("anca", {from: "j"}).addTildeAbove({from: "n"}), tehta, tehtaFrom);
                } else if (character === "f") { // nf -> nv
                    return callback(makeColumn("numen", {from: "n"}), tehta, tehtaFrom)("v");
                } else  if (character === "w") { // nw -> ñw
                    return function (character) {
                        if (character === "a") { // nwa
                            return function (character) { // nwal
                                if (character === "l") {
                                    return callback(makeColumn("nwalme", {from: "n"}).addAbove("w", {from: "w"}), tehta, tehtaFrom)("a")(character);
                                } else { // nwa.
                                    return callback(makeColumn("numen", {from: "n"}).addAbove("w", {from: "w"}), tehta, tehtaFrom)("a")(character);
                                }
                            };
                        } else if (character === "nw`") { // nw/ prime -> ñw
                            return callback(makeColumn("nwalme", {from: "ñ"}).addAbove("w", {from: "w"}), tehta, tehtaFrom);
                        } else { // nw.
                            return callback(makeColumn("numen", {from: "n"}).addAbove("w", {from: "w"}), tehta, tehtaFrom)(character);
                        }
                    };
                } else { // n.
                    return callback(makeColumn("numen", {from: "n"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "m") { // m
            return function (character) {
                if (character === "m") { // mm
                    if (options.doubleNasalsWithTildeBelow) {
                        return callback(makeColumn("malta", {from: "m"}).addTildeBelow({from: "m"}), tehta, tehtaFrom);
                    } else {
                        return callback(makeColumn("malta", {from: "m"}).addTildeAbove({from: "m"}), tehta, tehtaFrom);
                    }
                } else if (character === "p") { // mp
                    return callback(makeColumn("parma", {from: "p"}).addTildeAbove({from: "m"}), tehta, tehtaFrom);
                } else if (character === "b") { // mb
                    return callback(makeColumn("umbar", {from: "b"}).addTildeAbove({from: "m"}), tehta, tehtaFrom);
                } else if (character === "f") { // mf
                    return callback(makeColumn("formen", {from: "f"}).addTildeAbove({from: "m"}), tehta, tehtaFrom);
                } else if (character === "v") { // mv
                    return callback(makeColumn("ampa", {from: "v"}).addTildeAbove({from: "m"}), tehta, tehtaFrom);
                } else { // m.
                    return callback(makeColumn("malta", {from: "m"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "ñ") { // ñ
            return function (character) {
                // ññ does not exist to the best of my knowledge
                // ñw is handled naturally by following w
                if (character === "c" || character === "k") { // ñc
                    return callback(makeColumn("quesse", {from: character}).addTildeAbove({from: "ñ"}), tehta, tehtaFrom);
                } else if (character === "g") { // ñg
                    return callback(makeColumn("ungwe", {from: "g"}).addTildeAbove({from: "ñ"}), tehta, tehtaFrom);
                } else { // ñ.
                    return callback(makeColumn("nwalme", {from: "ñ"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "t") { // t
            return function (character) {
                if (character === "t") { // tt
                    return callback(makeColumn("tinco", {from: "t"}).addTildeBelow({from: "t"}), tehta, tehtaFrom);
                } else if (character === "h") { // th
                    return callback(makeColumn("thule", {from: "th"}), tehta, tehtaFrom);
                } else if (character === "c") { // tc
                    return function (character) {
                        if (character === "h") { // tch -> tinco calma
                            return callback(makeColumn("tinco", {from: "t"}), tehta, tehtaFrom)("c")("h")("`");
                        } else {
                            return callback(makeColumn("tinco", {from: "t"}), tehta, tehtaFrom)("c")(character);
                        }
                    };
                } else if (character === "s" && options.tsdz) { // ts
                    return callback(makeColumn("calma", {from: "ts"}), tehta, tehtaFrom);
                } else { // t.
                    return callback(makeColumn("tinco", {from: "t"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "p") { // p
            return function (character) {
                if (character === "p") { // pp
                    return callback(makeColumn("parma", {from: "p"}).addTildeBelow({from: "p"}), tehta, tehtaFrom);
                } else if (character === "h") { // ph
                    return Parser.countPrimes(function (primes) {
                        var column;
                        if (primes === 0) {
                            column = makeColumn("parma-extended", {from: "ph"}).varies();
                        } else if (primes >= 1) {
                            column = makeColumn("formen", {from: "ph"});
                        }
                        if (primes > 1) {
                            column.addError("PH cluster only has two alternate representations.");
                        }
                        return callback(column, tehta, tehtaFrom);
                    });
                } else { // p.
                    return callback(makeColumn("parma", {from: "p"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "c") {
            return function (character2) {
                if (character2 == "h" && options.language !== "english") {
                    return callback(makeColumn("hwesta", {from: character + character2}), tehta, tehtaFrom);
                } else if (character2 === "k") {
                    return callback(makeColumn("quesse", {from: character2}).addTildeBelow({from: character}), tehta, tehtaFrom);
                } else if (character2 === "h" || character2 === "c") { // ch and cc
                    return callback(makeColumn("calma", {from: character + character2}), tehta, tehtaFrom);
                } else { // c.
                    return callback(makeColumn("quesse", {from: character}), tehta, tehtaFrom)(character2);
                }
            };
        } else if (character === "k") {
            return function (character2) {
                if (character2 === "h" && !options.noAchLaut) { // ach laut
                    return callback(makeColumn("hwesta", {from: character + character2}), tehta, tehtaFrom);
                } else { // c.
                    return callback(makeColumn("quesse", {from: character}), tehta, tehtaFrom)(character2);
                }
            };
        } else if (character === "q") {
            return callback(makeColumn("quesse", {from: character}), tehta, tehtaFrom);
        } else if (character === "x") {
            return callback(makeColumn("quesse", {from: "x (k-)"}).addBelow("s", {from: "x (-s)"}), tehta, tehtaFrom);
        } else if (character === "d") {
            return function (character) {
                if (character === "d") { // dd
                    return callback(makeColumn("ando", {from: "d"}).addTildeBelow({from: "d"}), tehta, tehtaFrom);
                } else if (character === "j") { // dj
                    return callback(makeColumn("anga", {from: "dj"}), tehta, tehtaFrom);
                } else if (character === "z" && options.tsdz) { // dz
                    // TODO annotate dz to indicate that options.tsdz affects this cluster
                    return callback(makeColumn("anga", {from: "dz"}), tehta, tehtaFrom);
                } else if (character === "h") { // dh
                    return callback(makeColumn("anto", {from: "dh"}), tehta, tehtaFrom);
                } else { // d.
                    return callback(makeColumn("ando", {from: "d"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "b") { // b
            return function (character) {
                if (character === "b") { // bb
                    return callback(makeColumn("umbar", {from: "b"}).addTildeBelow({from: "b"}), tehta, tehtaFrom);
                } else { // b.
                    return callback(makeColumn("umbar", {from: "b"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "g") { // g
            return function (character) {
                if (character === "g") { // gg
                    return callback(makeColumn("ungwe", {from: "g"}).addTildeBelow({from: "g"}), tehta, tehtaFrom);
                } else if (character === "h") { // gh
                    if (options.language === "black-speech") {
                        return callback(makeColumn("ungwe-extended", {from: "gh"}), tehta, tehtaFrom);
                    } else {
                        return callback(makeColumn("unque", {from: "gh"}), tehta, tehtaFrom);
                    }
                } else { // g.
                    return callback(makeColumn("ungwe", {from: "g"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "f") { // f
            return function (character) {
                if (character === "f") { // ff
                    return callback(makeColumn("formen", {from: "f"}).addTildeBelow({from: "f"}), tehta, tehtaFrom);
                } else { // f.
                    return callback(makeColumn("formen", {from: "f"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "v") { // v
            return callback(makeColumn("ampa", {from: "v"}), tehta, tehtaFrom);
        } else if (character === "j") { // j
            if (options.language === 'english') {
                return Parser.countPrimes(function (primes) {
                    if (primes === 0) {
                        return callback(makeColumn("anga", {from: "j"}).varies(), tehta, tehtaFrom); //HH Changed anca to anga
                    } else {
                        var column = callback(makeColumn("anca", {from: "j"}), tehta, tehtaFrom);
                        if (primes > 1) {
                            column.addError("J only has two English variants: 1. anga, as pronounced in JACK and 2. anca , as pronounced in measure.");
                        }
                        return column;
                    }
                });
            } else {
                return callback(makeColumn("anca", {from: "j"}), tehta, tehtaFrom);
            }
        } else if (character === "s") { // s
            return function (character) {
                if (character === "s") { // ss
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var tengwaFrom = primes > 0 ? "s′" : "s";
                        var column = makeColumn(tengwa, {from: tengwaFrom}).addTildeBelow({from: "s"});
                        if (primes === 0) {
                            column.varies();
                        }
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta, tehtaFrom);
                    });
                } else if (character === "h") { // sh
                    if (options.language === "black-speech") {
                        return callback(makeColumn("calma-extended", {from: "sh"}), tehta, tehtaFrom);
                    } else {
                        return callback(makeColumn("harma", {from: "sh"}), tehta, tehtaFrom);
                    }
                } else { // s.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "silme-nuquerna" : "silme";
                        var tengwaFrom = primes > 0 ? "s′" : "s";
                        var column = makeColumn(tengwa, {from: tengwaFrom});
                        if (primes === 0) {
                            column.varies();
                        }
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta, tehtaFrom);
                    })(character);
                }
            };
        } else if (character === "z") { // z
            return function (character) {
                if (character === "z") { // zz
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "esse-nuquerna" : "esse";
                        var column = makeColumn(tengwa, {from: "z"}).addTildeBelow({from: "z"});
                        if (primes === 0) {
                            column.varies();
                        }
                        if (primes > 1) {
                            column.addError("Esse does not have this many alternate forms.");
                        }
                        return callback(column, tehta, tehtaFrom);
                    });
                } else { // z.
                    return Parser.countPrimes(function (primes) {
                        var tengwa = primes > 0 ? "esse-nuquerna" : "esse";
                        var column = makeColumn(tengwa, {from: "z"});
                        if (primes === 0) {
                            column.varies();
                        }
                        if (primes > 1) {
                            column.addError("Silme does not have this many alternate forms.");
                        }
                        return callback(column, tehta, tehtaFrom);
                    })(character);
                }
            };
        } else if (character === "h") { // h
            return function (character) {
                if (character === "w") { // hw
                    return callback(makeColumn("hwesta-sindarinwa", {from: "hw"}), tehta, tehtaFrom);
                } else { // h.
                    return callback(makeColumn("hyarmen", {from: "h"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "r") { // r
            return function (character) {
                if (character === "r") { // rr
                    return callback(makeColumn("romen", {from: "r"}).addTildeBelow({from: "r"}), tehta, tehtaFrom);
                } else if (character === "h") { // rh
                    return callback(makeColumn("arda", {from: "rh"}), tehta, tehtaFrom);
                } else if (
                    Parser.isFinal(character) || (
                        options.medialOre &&
                        vowels.indexOf(character) === -1
                    )
                ) { // r final (optionally r before consonant)
                    return callback(makeColumn("ore", {from: "r", final: true}), tehta, tehtaFrom)(character);
                } else { // r.
                    return callback(makeColumn("romen", {from: "r"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "l") {
            return function (character) {
                if (character === "l") { // ll
                    return callback(makeColumn("lambe", {from: "l"}).addTildeBelow({from: "l"}), tehta, tehtaFrom);
                } else if (character === "h") { // lh
                    return callback(makeColumn("alda", {from: "lh"}), tehta, tehtaFrom);
                } else { // l.
                    return callback(makeColumn("lambe", {from: "l"}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "i") { // i
            return callback(makeColumn("anna", {from: "i", diphthong: true}), tehta, tehtaFrom);
        } else if (character === "u") { // u
            return callback(makeColumn("vala", {from: "u", diphthong: true}), tehta, tehtaFrom);
        } else if (character === "w") { // w
            return function (character) {
                if (character === "h") { // wh
                    return callback(makeColumn("hwesta-sindarinwa", {from: "wh"}), tehta, tehtaFrom);
                } else { // w.
                    return callback(makeColumn("vala", {from: "w", dipththong: true}), tehta, tehtaFrom)(character);
                }
            };
        } else if (character === "e" && (!tehta || tehta === "a")) { // ae or e after consonants
            return callback(makeColumn("yanta", {from: "e", diphthong: true}), tehta, tehtaFrom);
        } else if (character === "e" && (!tehta || tehta === "i")) { // ie or e after consonants
            return callback(makeColumn("yanta", {from: "e", diphthong: true}), tehta, tehtaFrom);
        } else if (character === "e" && (!tehta || tehta === "o")) { // oe or e after consonants
            return callback(makeColumn("yanta", {from: "e", diphthong: true}), tehta, tehtaFrom);
        } else if (character === "ë") { // if "ë" makes it this far, it's a diaresis for english
            return callback(makeColumn("short-carrier", {from: ""}).addAbove("e", {from: "e"}));
        } else if (character === "y") {
            return Parser.countPrimes(function (primes) {
                if (primes === 0) {
                  return callback(makeColumn("anna", {from: ""}), tehta, tehtaFrom);
                  // 21-9-19 HH edit return callback(makeColumn("wilya", {from: ""}).addBelow("y", {from: "y"}), tehta, tehtaFrom);
                } else if (primes === 1) {
                    return callback(makeColumn("long-carrier", {from: "y"}).addAbove("i", {from: ""}), tehta, tehtaFrom);
                } else {
                    return callback(makeColumn("ure", {from: "y"}).addError("Consonantal Y only has one variation"));
                }
            });
        } else if (shorterVowels[character]) {
            return callback(
                makeCarrier(character, character, options)
                    .addAbove(shorterVowels[character], {from: ""}),
                tehta,
                tehtaFrom
            );
        } else if (character === "`" && options.language === "english" && tehta === "e") {
            // final e/ in english should be equivalent to diaresis
            return callback(
                makeColumn("short-carrier", {from: ""})
                    .addAbove("e", {from: "e"})
            );
        } else if (character === "" && options.language === "english" && tehta === "e") {
            // tehta deliberately consumed in this one case, not passed forward
            return callback(
                makeColumn("short-carrier", {from: ""})
                    .addBelow("i-below", {from: "e", silent: true})
            )(character);
        } else {
            return callback(null, tehta, tehtaFrom)(character);
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
    if (column.canAddAbove("w", "w")) {
        return function (character) {
            if (character === "w") {
                return callback(column.addAbove("w", {from: "e"}));
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
        if (options.language === "english" && character === "y" && column.canAddAbove("y-english")) {
            return callback(column.addAbove("y-english", {from: "y"}));
        } else if (character === "y" && column.canAddAbove("y-sindarin")) {
            return callback(column.addAbove("y-sindarin", {from: "y"}));
        } else if (character === "e" && column.canAddBelow("i-below")) {
            return Parser.countPrimes(function (primes) {
                return function (character) {
                    if (Parser.isFinal(character) && options.language === "english" && length > 2) {
                        if (primes === 0) {
                            return callback(
                                column.addBelow("i-below", {from: "e", silent: true})
                                    .varies()
                            )(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column)("e")(character);
                        }
                    } else {
                        if (primes === 0) {
                            return callback(column.varies())("e")(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column.addBelow("i-below", {from: "e", eilent: true}))(character);
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
                        return callback(column.addBelow("s", {from: "s"}).varies());
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
                                column.addFollowing("s-final", {from: "s"});
                            } else if (column.canAddFollowing("s-inverse") && primes -- === 0) {
                                column.addFollowing("s-inverse", {from: "s"});
                                if (column.canAddFollowing("s-final")) {
                                    column.varies();
                                }
                            } else if (column.canAddFollowing("s-extended") && primes-- === 0) {
                                column.addFollowing("s-extended", {from: "s"});
                                if (column.canAddFollowing("s-inverse")) {
                                    column.varies();
                                }
                            } else if (column.canAddFollowing("s-flourish") && primes-- === 0) {
                                column.addFollowing("s-flourish", {from: "s"});
                                if (column.canAddFollowing("s-extended")) {
                                    column.varies();
                                }
                            } else {
                                // rewind primes for subsequent alterations
                                var state = callback(column)("s");
                                while (primes-- > 0) {
                                    state = state("`");
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

