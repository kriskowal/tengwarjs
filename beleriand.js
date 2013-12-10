
// TODO parse following "w"

var TengwarParmaite = require("./tengwar-parmaite");
var Parser = require("./parser");
var Notation = require("./notation");
var makeDocumentParser = require("./document-parser");
var normalize = require("./normalize");
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
                } else if (character === "c" || character === "g") { // n{c,g}
                    return parseTengwa(callback, options)("ñ")(character);
                } else if (character === "n") { // nn
                    return callback(makeColumn("numen"));
                } else { // n.
                    return callback(makeColumn("ore"))(character);
                }
            };
        } else if (character === "t") { // t
            return function (character) {
                if (character === "h") { // th
                    return callback(makeColumn("thule"));
                } else { // t.
                    return callback(makeColumn("tinco"))(character);
                }
            };
        } else if (character === "d") { // d
            return function (character) {
                if (character === "h") { // dh
                    return callback(makeColumn("anto"));
                } else { // d.
                    return callback(makeColumn("ando"))(character);
                }
            };
        } else if (character === "m") { // m
            return function (character) {
                if (
                    character === "p" || character === "b" ||
                    character === "f" || character === "v"
                ) {
                    return parseTengwa(function (column) {
                        return callback(column.addTildeAbove());
                    }, options)(character);
                } else if (character === "m") { // mm
                    return callback(makeColumn("malta"));
                } else { // m.
                    return callback(makeColumn("vala"))(character);
                }
            };
        } else if (character === "p") { // p
            return callback(makeColumn("parma"));
        } else if (character === "b") { // b
            return callback(makeColumn("umbar"));
        } else if (character === "f") { // f
            return function (character) {
                if (Parser.isFinal(character)) { // f final
                    return callback(makeColumn("ampa"))(character);
                } else {
                    return callback(makeColumn("formen"))(character);
                }
            };
        } else if (character === "v") { // v
            return callback(makeColumn("ampa"));
        } else if (character === "ñ") { // ñ
            return function (character) {
                if (character === "c" || character === "g") {
                    return parseTengwa(function (column) {
                        if (column.tengwa === "halla") {
                            column.addError("Lenited G (halla) should not be nasalized with prefix N");
                        }
                        return callback(column.addTildeAbove());
                    }, options)(character);
                } else { // ñ.
                    return callback(makeColumn("noldo"))(character);
                }
            };
        } else if (character === "c") { // c
            return function (character) {
                if (character === "h") { // ch
                    return function (character) {
                        if (character === "w") { // chw
                            return callback(makeColumn("hwesta"));
                        } else { // ch.
                            return callback(makeColumn("harma"))(character);
                        }
                    };
                } else if (character === "w") { // cw
                    return callback(makeColumn("quesse"));
                } else { // c.
                    return callback(makeColumn("calma"))(character);
                }
            };
        } else if (character === "g") {
            return function (character) {
                if (character === "h") { // gh
                    return function (character) {
                        if (character === "w") { // ghw
                            return callback(makeColumn("unque"));
                        } else { // gh.
                            return callback(makeColumn("anca"))(character);
                        }
                    };
                } else if (character === "w") { // gw
                    return callback(makeColumn("ungwe"));
                } else if (character === "'") { // g'
                    return callback(makeColumn("halla")); // gasdil
                } else { // g.
                    return callback(makeColumn("anga"))(character);
                }
            };
        } else if (character === "r") { // r
            return function (character) {
                if (character === "h") { // rh
                    return callback(makeColumn("arda"));
                } else {
                    return callback(makeColumn("romen"))(character);
                }
            };
        } else if (character === "l") { // l
            return function (character) {
                if (character === "h") { // lh
                    return callback(makeColumn("alda"));
                } else {
                    return callback(makeColumn("lambe"))(character);
                }
            };
        } else if (character === "s") { // s
            return callback(makeColumn("silme"));
        } else if (character === "a") { // a
            return function (character) {
                if (character === "i") { // ai
                    return callback(makeColumn("round-carrier").addAbove("í"));
                } else if (character === "u") { // au
                    return callback(makeColumn("round-carrier").addAbove("w"));
                } else if (character === "'") { // a'
                    return callback(makeColumn("round-carrier").addAbove("i"));
                } else if (character === "a") { // aa
                    return callback(makeColumn("round-carrier").addAbove("e"));
                } else { // a.
                    return callback(makeColumn("round-carrier"))(character);
                }
            };
        } else if (character === "e" || character === "ë") { // e
            return function (character) {
                if (character === "i") { // ei
                    return callback(makeColumn("yanta").addAbove("í"));
                } else if (character === "e") {
                    return callback(makeColumn("yanta").addAbove("e"));
                } else { // e.
                    return callback(makeColumn("yanta"))(character);
                }
            };
        } else if (character === "i") { // i
            return function (character) {
                if (character === "i") { // ii -> í
                    return parseColumn(callback, options)("í");
                } else {
                    return Parser.countPrimes(function (primes) {
                        if (primes === 0) {
                            return callback(makeColumn("short-carrier"));
                        } else if (primes === 1) {
                            return callback(makeColumn("short-carrier").addAbove("i"));
                        } else if (primes === 2) {
                            return callback(makeColumn("long-carrier").addAbove("i"));
                        } else if (primes === 3) {
                            return callback(makeColumn("long-carrier"));
                        } else {
                            return callback(makeColumn("long-carrier").addAbove("i").addError("I only has four variants between short or long and dotted or not."));
                        }
                    })(character);
                }
            };
        } else if (character === "o") {
            return function (character) {
                if (character === "o") { // oo
                    return callback(makeColumn("anna").addAbove("e"));
                } else {
                    return callback(makeColumn("anna"))(character);
                }
            };
        } else if (character === "u") {
            return function (character) {
                if (character === "i") {
                    return callback(makeColumn("ure").addAbove("í"));
                } else if (character === "u") {
                    return callback(makeColumn("ure").addAbove("e"));
                } else {
                    return callback(makeColumn("ure"))(character);
                }
            };
        } else if (character === "w") { // w
            return function (character) {
                if (character === "w") { // ww
                    return callback(makeColumn("wilya").addAbove("e"));
                } else { // w.
                    return callback(makeColumn("wilya"))(character);
                }
            };
        } else if (character === "y") {
            return function (character) {
                if (character === "y") { // yy
                    return callback(makeColumn("silme-nuquerna").addAbove("e"));
                } else { // y.
                    return callback(makeColumn("silme-nuquerna"))(character);
                }
            };
        } else if (character === "á") {
            return callback(makeColumn("round-carrier").addAbove("e"));
        } else if (character === "é") {
            return callback(makeColumn("yanta").addAbove("e"));
        } else if (character === "í") {
            return Parser.countPrimes(function (primes) {
                if (primes === 0) {
                    return callback(makeColumn("short-carrier").addAbove("e"));
                } else if (primes === 1) {
                    return callback(makeColumn("long-carrier").addAbove("e"));
                } else {
                    return callback(makeColumn("long-carrier").addAbove("e").addError("Í only has one variant."));
                }
            });
        } else if (character === "ó") {
            return callback(makeColumn("anna").addAbove("e"));
        } else if (character === "ú") {
            return callback(makeColumn("ure").addAbove("e"));
        } else if (character === "h") {
            return function (character) {
                //if (character === "m") { // TODO
                //    return callback(makeColumn("ore-nasalized"));
                if (character === "w") {
                    return callback(makeColumn("hwesta-sindarinwa"));
                } else {
                    return callback(makeColumn("hyarmen"))(character);
                }
            };
        } else if (character === "z") {
            return callback(makeColumn("silme").addError("Z does not appear in the mode of Beleriand"));
        } else if (punctuation[character]) {
            return callback(makeColumn(punctuation[character]));
        } else if (Parser.isBreak(character) || /\d/.test(character)) {
            return callback()(character);
        } else {
            return callback(makeColumn("anna").addError("Unexpected character: " + JSON.stringify(character)));
        }
    };
}

function parseFollowingS(callback, column) {
    return function (character) {
        if (character === "s") {
            if (column.canAddBelow("s")) {
                return callback(column.addBelow("s"));
            } else {
                return Parser.countPrimes(function (primes) {
                    return function (character) {
                        if (Parser.isFinal(character)) { // end of word
                            if (column.canAddFollowing("s-final") && primes-- === 0) {
                                column.addFollowing("s-final");
                            } else if (column.canAddFollowing("s-inverse") && primes -- === 0) {
                                column.addFollowing("s-inverse");
                            } else if (column.canAddFollowing("s-extended") && primes-- === 0) {
                                column.addFollowing("s-extended");
                            } else if (column.canAddFollowing("s-flourish")) {
                                column.addFollowing("s-flourish");
                                if (primes > 0) {
                                    column.addError(
                                        "Following S only has 3 alternate " +
                                        "flourishes."
                                    );
                                }
                            } else {
                                return callback(column)("s")(character);
                            }
                            return callback(column)(character);
                        } else {
                            return callback(column)("s")(character);
                        }
                    };
                });
            }
        } else {
            return callback(column)(character);
        }
    };
}

