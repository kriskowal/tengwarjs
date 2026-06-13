"use strict";

var Notation = require("./notation");
var Parser = require("./parser");
var punctuation = require("./punctuation");
var parseNumber = require("./numbers");
var parseTengwa = require("./general-use-parse-tengwa").parseTengwa;
var makeCarrier = require("./general-use-parse-tengwa").makeCarrier;
var parseTengwaAnnotations = require("./general-use-parse-following").parseTengwaAnnotations;

// Vowel and tehta constants
var caretVowels = "âêîôû";
var acuteVowels = "áéíóú";
var shortVowels = "aeiou";
var nonLengthenableVowels = "áéíóúy";
var tehtarThatCanBeAddedAbove = "aeiouóú";
var curlReversals = {"o": "u", "u": "o", "ó": "ú", "ú": "ó"};
var dotSlashSwaps = {"i": "e", "e": "i"};

function canAddAboveTengwa(tehta) {
    return tehtarThatCanBeAddedAbove.indexOf(tehta) !== -1;
}

exports.parseWord = parseWord;
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
    return makeColumn("ampaumbar", {from: "of"})
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
    return makeColumn("antoando", {from: "the"})
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
    return makeColumn("ampaumbar", {from: "of the"})
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
                    tehta = curlReversals[tehta] || tehta;
                }
                if (options.swapDotSlash) {
                    tehta = dotSlashSwaps[tehta] || tehta;
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
                        return callback([])(character);
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

function parseTehta(callback, options) {
    return function (character) {
        if (character === "") {
            return callback();
        }

        var from = character;
        if (character === "ë" && options.language !== "english") {
            character = "e";
        }

        var caretIndex = caretVowels.indexOf(character);
        if (caretIndex !== -1) {
            character = acuteVowels[caretIndex];
        }

        var shortIndex = shortVowels.indexOf(character);
        if (shortIndex !== -1) {
            return function (nextCharacter) {
                // Doubling vowels as in the English word GREEN is generally
                // rendered orthographically, with two separate E tehtar.
                // However, in other languages, it is convenient to allow users
                // who do not have ready access to diacrtics on their keyboard
                // the ability to get a long vowel by doubling.
                if (options.language !== "english" && nextCharacter === character) { // doubled
                    return callback(acuteVowels[shortIndex], character + nextCharacter);
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
