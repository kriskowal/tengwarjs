"use strict";

// TODO parse following "w"

var TengwarParmaite = require("./tengwar-parmaite");
var Parser = require("./parser");
var Notation = require("./notation");
var makeDocumentParser = require("./document-parser");
var punctuation = require("./punctuation");
var parseNumber = require("./numbers");

exports.name = "Mode of Beleriand";

var defaults = {};
exports.makeOptions = makeOptions;
function makeOptions(options) {
    options = options || defaults;
    return {
        font: options.font || TengwarParmaite,
        block: options.block,
        plain: options.plain,
        duodecimal: options.duodecimal
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

function parseWord(callback, options, columns) {
    columns = columns || [];
    return parseColumn(function (column) {
        if (column) {
            return parseWord(
                callback,
                options,
                columns.concat([column])
            );
        } else {
            return function (character) {
                if (/\d/.test(character)) {
                    return parseNumber(function (number) {
                        return parseWord(callback, options, columns.concat(number));
                    }, options)(character);
                } else {
                    return callback(columns)(character);
                }
            };
        }
    }, options);
}

function parseColumn(callback, options) {
    return parseTengwa(function (column) {
        if (column) {
            return parseFollowingS(callback, column);
        } else {
            return callback();
        }
    }, options);
}

function parseTengwa(callback, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "n") { // n
            return function (character) {
                if (character === "t" || character === "d") { // n{t,d}
                    return parseTengwa(function (column) {
                        return callback(column.addTildeAbove());
                    }, options)(character);
                } else if (character === "c" || character === "k" || character === "g") { // n{c,k,g}
                    return parseTengwa(callback, options)("ñ")(character);
                } else if (character === "n") { // nn
                    return callback(makeColumn("numen", {from : "nn"}));
                } else { // n.
                    return callback(makeColumn("ore", {from: "n"}))(character);
                }
            };
        } else if (character === "t") { // t
            return function (character) {
                if (character === "h") { // th
                    return callback(makeColumn("thule", {from: "th"}));
                } else { // t.
                    return callback(makeColumn("tinco", {from: "t"}))(character);
                }
            };
        } else if (character === "d") { // d
            return function (character) {
                if (character === "h") { // dh
                    return callback(makeColumn("anto", {from: "dh"}));
                } else { // d.
                    return callback(makeColumn("ando", {from: "d"}))(character);
                }
            };
        } else if (character === "m") { // m
            return function (character) {
                if (
                    character === "p" || character === "b" ||
                    character === "f" || character === "v"
                ) {
                    return parseTengwa(function (column) {
                        return callback(column.addTildeAbove({from: character}));
                    }, options)(character);
                } else if (character === "m") { // mm
                    return callback(makeColumn("malta", {from: "mm"}));
                } else { // m.
                    return callback(makeColumn("vala", {from: "m"}))(character);
                }
            };
        } else if (character === "p") { // p
            return callback(makeColumn("parma", {from: "p"}));
        } else if (character === "b") { // b
            return callback(makeColumn("umbar", {from: "b"}));
        } else if (character === "f") { // f
            return function (character) {
                if (Parser.isFinal(character)) { // f final
                    return callback(makeColumn("ampa", {from: "f", final: true}))(character);
                } else {
                    return callback(makeColumn("formen", {from: "f", medial: true}))(character);
                }
            };
        } else if (character === "v") { // v
            return callback(makeColumn("ampa", {from: "v"}));
        } else if (character === "ñ") { // ñ
            return function (character) {
                if (character === "c" || character === "k" || character === "g") {
                    return parseTengwa(function (column) {
                        if (column.tengwa === "halla") {
                            column.addError("Lenited G (halla) should not be nasalized with prefix N");
                        }
                        return callback(column.addTildeAbove({from: character}));
                    }, options)(character);
                } else { // ñ.
                    return callback(makeColumn("noldo", {from: "ñ"}))(character);
                }
            };
        } else if (character === "c" || character === "k") { // c or k
            return function (character2) {
                if (character2 === "h") { // ch or kh
                    return function (character3) {
                        if (character3 === "w") { // chw or khw
                            return callback(makeColumn("hwesta", {from: character + "hw"}));
                        } else { // ch. or kh.
                            return callback(makeColumn("harma", {from: character + "h"}))(character3);
                        }
                    };
                } else if (character2 === "w") { // cw
                    return callback(makeColumn("quesse", {from: character + "w"}));
                } else { // c.
                    return callback(makeColumn("calma", {from: character}))(character2);
                }
            };
        } else if (character === "x") {
            return callback(makeColumn("calma", {from: "x (k-)"}).addBelow("s", {from: "x (-s)"}));
        } else if (character === "q") {
            return function (character) {
                if (character == "u" || character == "w") {
                    return callback(makeColumn("quesse", {from: "q" + character}));
                } else {
                    return callback(makeColumn("quesse", {from: "q"}))(character);
                }
            };
        } else if (character === "g") {
            return function (character) {
                if (character === "h") { // gh
                    return function (character) {
                        if (character === "w") { // ghw
                            return callback(makeColumn("unque", {from: "ghw"}));
                        } else { // gh.
                            return callback(makeColumn("anca", {from: "gh"}))(character);
                        }
                    };
                } else if (character === "w") { // gw
                    return callback(makeColumn("ungwe", {from: "gw"}));
                } else if (character === "/") { // g/
                    return callback(makeColumn("halla", {from: "g"})); // gasdil
                } else { // g.
                    return callback(makeColumn("anga", {from: "g"}).varies())(character);
                }
            };
        } else if (character === "r") { // r
            return function (character) {
                if (character === "h") { // rh
                    return callback(makeColumn("arda", {from: "rh"}));
                } else {
                    return callback(makeColumn("romen", {from: "r"}))(character);
                }
            };
        } else if (character === "l") { // l
            return function (character) {
                if (character === "h") { // lh
                    return callback(makeColumn("alda", {from: "lh"}));
                } else {
                    return callback(makeColumn("lambe", {from: "l"}))(character);
                }
            };
        } else if (character === "s") { // s
            return callback(makeColumn("silme", {from: "s"}));
        } else if (character === "a") { // a
            return function (character) {
                if (character === "i") { // ai
                    return callback(makeColumn("round-carrier", {from: "a", diphthong: true}).addAbove("í", {from: "i"}));
                } else if (character === "u") { // au
                    return callback(makeColumn("round-carrier", {from: "a", diphthong: true}).addAbove("w", {from: "u"}));
                } else if (character === "/") { // a/
                    return callback(makeColumn("round-carrier", {from: "a"}).addAbove("i", {from: "a"}));
                } else if (character === "a") { // aa
                    return callback(makeColumn("round-carrier", {from: "a", long: true}).addAbove("e", {from: "a"}));
                } else { // a.
                    return callback(makeColumn("round-carrier", {from: "a"}).varies())(character);
                }
            };
        } else if (character === "e" || character === "ë") { // e
            return function (character) {
                if (character === "i") { // ei
                    return callback(makeColumn("yanta", {from: "e"}).addAbove("í", {from: "i"}));
                } else if (character === "e") {
                    return callback(makeColumn("yanta", {from: "e", long: true}).addAbove("e", {from: "e"}));
                } else { // e.
                    return callback(makeColumn("yanta", {from: "e"}))(character);
                }
            };
        } else if (character === "i") { // i
            return function (character) {
                if (character === "i") { // ii -> í
                    return parseColumn(callback, options)("í");
                } else {
                    return Parser.countPrimes(function (primes) {
                        if (primes === 0) {
                            return callback(makeColumn("short-carrier", {from: "i"}).varies());
                        } else if (primes === 1) {
                            return callback(makeColumn("short-carrier", {from: "i"}).addAbove("i", {from: ""}).varies());
                        } else if (primes === 2) {
                            return callback(makeColumn("long-carrier", {from: "i", long: true}).addAbove("i", {from: ""}).varies());
                        } else if (primes === 3) {
                            return callback(makeColumn("long-carrier", {from: "i", long: true}));
                        } else {
                            return callback(makeColumn("long-carrier").addAbove("i").addError("I only has four variants between short or long and dotted or not."));
                        }
                    })(character);
                }
            };
        } else if (character === "o") {
            return function (character) {
                if (character === "o") { // oo
                    return callback(makeColumn("anna", {from: "o"}).addAbove("e", {from: "o"}));
                } else {
                    return callback(makeColumn("anna", {from: "o"}))(character);
                }
            };
        } else if (character === "u") {
            return function (character) {
                if (character === "i") {
                    return callback(makeColumn("ure", {from: "u", diphthong: true}).addAbove("í", {from: "i"}));
                } else if (character === "u") {
                    return callback(makeColumn("ure", {from: "u", long: true}).addAbove("e", {from: "u"}));
                } else {
                    return callback(makeColumn("ure", {from: "u"}))(character);
                }
            };
        } else if (character === "w") { // w
            return function (character) {
                if (character === "w") { // ww
                    return callback(makeColumn("wilya", {from: "w"}).addAbove("e", {from: "w"}));
                } else { // w.
                    return callback(makeColumn("wilya", {from: "w"}))(character);
                }
            };
        } else if (character === "y") {
            return function (character) {
                if (character === "y") { // yy
                    return callback(makeColumn("silme-nuquerna", {from: "y"}).addAbove("e", {from: "y"}));
                } else { // y.
                    return callback(makeColumn("silme-nuquerna", {from: "y"}))(character);
                }
            };
        } else if (character === "á" || character === "â") {
            return callback(makeColumn("round-carrier", {from: character, long: true}).addAbove("e", {}));
        } else if (character === "é" || character === "ê") {
            return callback(makeColumn("yanta", {from: character, long: true}).addAbove("e", {}));
        } else if (character === "í" || character === "î") {
            return Parser.countPrimes(function (primes) {
                if (primes === 0) {
                    return callback(makeColumn("short-carrier", {from: character, long: true}).addAbove("e", {}).varies());
                } else if (primes === 1) {
                    return callback(makeColumn("long-carrier", {from: character, long: true}).addAbove("e", {}));
                } else {
                    return callback(makeColumn("long-carrier", {from: character, long: true}).addAbove("e", {}).addError(character + " has only has one variant."));
                }
            });
        } else if (character === "ó" || character === "ô") {
            return callback(makeColumn("anna", {from: character, long: true}).addAbove("e", {}));
        } else if (character === "ú" || character === "û") {
            return callback(makeColumn("ure", {from: character, long: true}).addAbove("e", {}));
        } else if (character === "h") {
            return function (character) {
                //if (character === "m") { // TODO
                //    return callback(makeColumn("ore-nasalized"));
                if (character === "w") {
                    return callback(makeColumn("hwesta-sindarinwa", {from: "hw"}));
                } else {
                    return callback(makeColumn("hyarmen", {from: "h"}))(character);
                }
            };
        } else if (character === "z") {
            return callback(makeColumn("silme", {from: "z"}).addError("Z does not appear in the mode of Beleriand"));
        } else if (punctuation[character]) {
            return callback(makeColumn(punctuation[character], {from: character}));
        } else if (Parser.isBreak(character) || /\d/.test(character)) {
            return callback()(character);
        } else {
            return callback(makeColumn("anna", {from: character}).addError("Unexpected character: " + JSON.stringify(character)));
        }
    };
}

function parseFollowingS(callback, column) {
    return function (character) {
        if (character === "s") {
            if (column.canAddBelow("s")) {
                return callback(column.addBelow("s", {from: "s"}));
            } else {
                return Parser.countPrimes(function (primes) {
                    return function (character) {
                        if (Parser.isFinal(character)) { // end of word
                            if (column.canAddFollowing("s-final") && primes-- === 0) {
                                column.addFollowing("s-final", {from: "s"});
                            } else if (column.canAddFollowing("s-inverse") && primes -- === 0) {
                                column.addFollowing("s-inverse");
                            } else if (column.canAddFollowing("s-extended") && primes-- === 0) {
                                column.addFollowing("s-extended", {from: "s"});
                            } else if (column.canAddFollowing("s-flourish")) {
                                column.addFollowing("s-flourish", {from: "s"});
                                if (primes > 0) {
                                    column.addError(
                                        "Following S only has 3 alternate " +
                                        "flourishes."
                                    );
                                }
                            } else {
                                return callback(column)("s", {from: "s"})(character);
                            }
                            return callback(column)(character);
                        } else {
                            return callback(column)("s", {from: "s"})(character);
                        }
                    };
                });
            }
        } else {
            return callback(column)(character);
        }
    };
}

