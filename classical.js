"use strict";

var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var Parser = require("./parser");
var makeDocumentParser = require("./document-parser");
var punctuation = require("./punctuation");
var parseNumber = require("./numbers");

exports.name = "Classical Mode";

var defaults = {};
exports.makeOptions = makeOptions;
function makeOptions(options) {
    options = options || defaults;
    return {
        font: options.font || TengwarAnnatar,
        block: options.block,
        plain: options.plain,
        vilya: options.vilya,
        // false: (v: vala, w: wilya)
        // true: (v: vilya, w: ERROR)
        harma: options.harma,
        // between the original formation of the language,
        // but before the third age,
        // harma was renamed aha,
        // and meant breath-h in initial position
        classicalH: options.classicalH,
        classicalR: options.classicalR,
        // before the third age
        // affects use of "r" and "h"
        // without classic, we default to the mode from the namarie poem.
        // in the classical period, "r" was transcribed as "ore" only between
        // vowels.
        // in the third age, through the namarie poem, "r" is only "ore" before
        // consontants and at the end of words.
        swapDotSlash: options.swapDotSlash,
        // false: by default, e is a slash, i is a dot
        // true: e is a dot, i is a slash
        // TODO figure out "h"
        reverseCurls: options.reverseCurls,
        // false: by default, o is forward, u is backward
        // true: o is backward, u is forward
        iuRising: options.iuRising,
        // iuRising thirdAge: anna:y,u
        // otherwise: ure:i
        // in the third age, "iu" is a rising diphthong,
        // whereas all others are falling.  rising means
        // that they are stressed on the second sound, as
        // in "yule".  whether to use yanta or anna is
        // not attested.
        longHalla: options.longHalla,
        // TODO indicates that halla should be used before medial L and W to
        // indicate that these are pronounced with length.
        // initial hl and hw remain short.
        // TODO doubled dots for í
        // TODO triple dots for y
        // TODO simplification of a, noting non-a
        // TODO following W in this mode?
        // TODO namarië does not use double U or O curls
        // TODO namarië does not reverse esse for E tehta
        duodecimal: options.duodecimal
    };
};

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

function parseWord(callback, options, columns, previous) {
    columns = columns || [];
    return parseColumn(function (moreColumns) {
        if (!moreColumns.length) {
            return callback(columns);
        } else {
            return parseWord(
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
    return parseTengwa(function (columns) {
        var previous = columns.pop();
        return parseTehta(function (next) {
            var next = columns.concat(next).filter(Boolean)
            if (next.length) {
                return callback(next);
            } else {
                return function (character) {
                    if (Parser.isBreak(character)) {
                        return callback([])(character);
                    } else if (/\d/.test(character)) {
                        return parseNumber(callback, options)(character);
                    } else if (punctuation[character]) {
                        return callback([makeColumn(punctuation[character], {from: character})]);
                    } else {
                        return callback([makeColumn("ure", {}).addError(
                            "Cannot transcribe " + JSON.stringify(character) +
                            " in Classical Mode"
                        )]);
                    }
                };
            }
        }, options, previous);
    }, options, previous);
}

var vowels = "aeiouyáéíóú";

function parseTengwa(callback, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "n") { // n
            return function (character2) {
                if (character2 === "n") { // nn
                    return callback([makeColumn("numen", {from: "n"}).addTildeBelow({from: "n"})]);
                } else if (character2 === "t") { // nt
                    return callback([makeColumn("anto", {from: "nt"})]);
                } else if (character2 === "d") { // nd
                    return callback([makeColumn("ando", {from: "nd"})]);
                } else if (character2 === "g") { // ng
                    return function (character3) {
                        if (character3 === "w") { // ngw -> ñw
                            return callback([makeColumn("ungwe", {from: "ñgw"})]);
                        } else { // ng
                            return callback([makeColumn("anga", {from: "ñg"})])(character3);
                        }
                    };
                } else if (character2 === "c" || character2 == "k") { // nc or nk
                    return function (character3) {
                        if (character3 === "w") { // ncw
                            return callback([makeColumn("unque", {from: "ñ" + character2 + "w"})]);
                        } else { // nc
                            return callback([makeColumn("anca", {from: "ñ" + character2})])(character3);
                        }
                    };
                } else if (character2 === "q") {
                    return function (character3) {
                        if (character3 === "u") { // nqu
                            return callback([makeColumn("unque", {from: "nqu"})]);
                        } else {
                            return callback([makeColumn("unque", {from: "nq"})])(character3);
                        }
                    };
                } else if (character2 === "w" && previous == null) {
                    return callback([makeColumn("nwalme", {from: "nw"})]);
                } else {
                    return callback([makeColumn("numen", {from: "n"})])(character2);
                }
            };
        } else if (character === "m") {
            return function (character) {
                if (character === "m") { // mm
                    return callback([makeColumn("malta", {from: "m"}).addTildeBelow({from: "m"})]);
                } else if (character === "p") { // mp
                    return callback([makeColumn("ampa", {from: "mp"})]);
                } else if (character === "b") { // mb
                    return callback([makeColumn("umbar", {from: "mb"})]);
                } else {
                    return callback([makeColumn("malta", {from: "m"})])(character);
                }
            };
        } else if (character === "ñ") { // ñ
            return function (character) {
                if (character === "g") { // ñg
                    return function (character) {
                        if (character === "w") { // ñgw
                            return callback([makeColumn("ungwe", {from: "ñgw"})]);
                        } else { // ñg
                            return callback([makeColumn("anga", {from: "ñg"})])(character);
                        }
                    }
                } else if (character === "c") { // ñc
                    return function (character) {
                        if (character === "w") { // ñcw
                            return callback([makeColumn("unque", {from: "ñcw"})]);
                        } else { // ñc
                            return callback([makeColumn("anca", {from: "ñc"})]);
                        }
                    }
                } else {
                    return callback([makeColumn("noldo", {from: "ñ"})])(character);
                }
            };
        } else if (character === "t") {
            return function (character) {
                if (character === "t") { // tt
                    return function (character) {
                        if (character === "y") { // tty
                            return callback([makeColumn("tinco", {from: "t"}).addBelow("y-quenya", {from: "y"}).addTildeBelow({from: "t"})]);
                        } else { // tt
                            return callback([makeColumn("tinco", {from: "t"}).addTildeBelow({from: "t"})])(character);
                        }
                    };
                } else if (character === "y") { // ty
                    return callback([makeColumn("tinco", {from: "t"}).addBelow("y-quenya", {from: "y"})]);
                } else if (character === "h") { // th
                    return callback([makeColumn("thule", {from: "th"})]);
                } else if (character === "s") {
                    return function (character) {
                        // TODO s-inverse, s-extended, s-flourish
                        if (Parser.isFinal(character)) { // ts final
                            return callback([makeColumn("tinco", {from: "t"}).addFollowing("s", {from: "s"})])(character);
                        } else { // ts medial
                            return callback([
                                makeColumn("tinco", {from: "t"}),
                                makeColumn("silme", {from: "s"})
                            ])(character);
                        }
                    };
                } else { // t
                    return callback([makeColumn("tinco", {from: "t"})])(character);
                }
            };
        } else if (character === "p") {
            return function (character) {
                if (character === "p") {
                    return function (character) {
                        if (character === "y") { // ppy
                            return callback([makeColumn("parma", {from: "p"}).addBelow("y-quenya", {from: "y"}).addTildeBelow({from: "p"})]);
                        } else { // pp
                            return callback([makeColumn("parma", {from: "p"}).addTildeBelow({from: "p"})])(character);
                        }
                    };
                } else if (character === "y") { // py
                    return callback([makeColumn("parma", {from: "p"}).addBelow("y-quenya", {from: "y"})]);
                } else if (character === "s") { // ps
                    return function (character) {
                        if (Parser.isFinal(character)) { // ps final
                            return callback([makeColumn("parma", {from: "p"}).addFollowing("s", {from: "s"})])(character);
                        } else { // ps medial
                            return callback([
                                makeColumn("parma", {from: "p"}),
                                makeColumn("silme", {from: "s"})
                            ])(character);
                        }
                    };
                } else { // t
                    return callback([makeColumn("parma", {from: "p"})])(character);
                }
            };
        } else if (character === "c" || character === "k") {
            return function (character2) {
                if (character2 === "c" || character2 === "k") {
                    return callback([makeColumn("calma", {from: character}).addTildeBelow({from: character2})]);
                } else if (character2 === "s") {
                    return callback([makeColumn("calma", {from: character}).addBelow("s", {from: character2})]);
                } else if (character2 === "h") {
                    return callback([makeColumn("harma", {from: character + character2})]);
                } else if (character2 === "w") {
                    return callback([makeColumn("quesse", {from: character + character2})]);
                } else {
                    return callback([makeColumn("calma", {from: character})])(character2);
                }
            };
        } else if (character === "x") {
            return callback([makeColumn("calma", {from: "x (k-)"}).addFollowing("s", {from: "x (-s)"})])
        } else if (character === "q") {
            return function (character) {
                if (character === "u") {
                    return callback([makeColumn("quesse", {from: "q"})]);
                } else {
                    return callback([makeColumn("quesse", {from: "q"})])(character);
                }
            }
        } else if (character === "f") {
            return callback([makeColumn("formen", {from: "f"})]);
        } else if (character === "v") {
            if (options.vilya) {
                return callback([makeColumn("wilya", {from: "v", name: "vilya"})]);
            } else {
                return callback([makeColumn("vala", {from: "v", name: "vala"})]);
            }
        } else if (character === "w") {
            if (options.vilya) {
                return callback([])("u");
            } else {
                // TODO Fact-check this interpretation. It may be an error to
                // use w as a consonant depending on whether we're speaking
                // early or late classical.
                return callback([makeColumn("wilya", {from: "w", name: "vilya"})]);
            }
        } else if (character === "r") { // r
            return function (character) {
                if (character === "d") { // rd
                    return callback([makeColumn("arda", {from: "rd"})]);
                } else if (character === "h") { // rh -> hr
                    var error = "R should preceed H in the HR diagraph in Classical mode.";
                    return callback([
                        makeColumn("halla", {from: "h"}).addError(error),
                        makeColumn("romen", {from: "r"}).addError(error)
                    ]);
                } else if (options.classicalR) {
                    // pre-namarie style, ore when r between vowels
                    if (
                        previous &&
                        previous.above &&
                        !Parser.isFinal(character) &&
                        vowels.indexOf(character) !== -1
                    ) {
                        return callback([makeColumn("ore", {from: "r"})])(character);
                    } else {
                        return callback([makeColumn("romen", {from: "r"})])(character);
                    }
                } else {
                    // pre-consonant and word-final
                    if (Parser.isFinal(character) || vowels.indexOf(character) === -1) { // ore
                        return callback([makeColumn("ore", {from: "r"})])(character);
                    } else { // romen
                        return callback([makeColumn("romen", {from: "r"})])(character);
                    }
                }
            };
        } else if (character === "l") {
            return function (character) {
                if (character === "l") {
                    return function (character) {
                        if (character === "y") { // lly
                            return callback([makeColumn("lambe", {from: "l"}).addBelow("y-quenya", {from: "y"}).addTildeBelow({from: "l"})]);
                        } else { // ll
                            return callback([makeColumn("lambe", {from: "l"}).addTildeBelow({from: "y"})])(character);
                        }
                    }
                } else if (character === "y") { // ly
                    return callback([makeColumn("lambe", {from: "l"}).addBelow("y-quenya", {from: "y"})]);
                } else if (character === "h") { // lh -> hl
                    var error = "L should preceed H in the HL diagraph in Classical mode.";
                    return callback([
                        makeColumn("halla", {from: "h"}).addError(error),
                        makeColumn("lambe", {from: "l"}).addError(error)
                    ]);
                } else if (character === "d") { // ld
                    return callback([makeColumn("alda", {from: "ld"})]);
                } else if (character === "b") { // lb
                    // TODO ascertain why this is a special case and make a note.
                    return callback([makeColumn("lambe", {from: "l"}), makeColumn("umbar", {from: "b"})]);
                } else {
                    return callback([makeColumn("lambe", {from: "l"})])(character);
                }
            };
        } else if (character === "s") {
            return function (character) {
                if (character === "s") { // ss
                    return callback([makeColumn("esse", {from: "ss"})]);
                } else { // s.
                    return callback([makeColumn("silme", {from: "s"})])(character);
                }
                // Note that there is no sh phoneme in Classical Elvish languages
            };
        } else if (character === "h") {
            return function (character) {
                if (character === "l") { // hl
                    return callback([
                        makeColumn("halla", {from: "h"}),
                        makeColumn("lambe", {from: "l"})
                    ]);
                } else if (character === "r") {
                    return callback([
                        makeColumn("halla", {from: "h"}),
                        makeColumn("romen", {from: "r"})
                    ]);
                } else if (character === "w") { // hw
                    return callback([makeColumn("hwesta", {from: "hw"})]);
                } else if (character === "t") { // ht
                    // TODO find a reference and example that substantiates
                    // this interpretation. Did I invent this to make harma
                    // expressible?
                    return callback([makeColumn("harma", {from: "ht"})]);
                } else if (character === "y") { // hy
                    if (options.classicalH && !options.harma) { // oldest form
                        return callback([makeColumn("hyarmen", {from: "hy"})]);
                    } else { // post-aha, through to the third-age
                        return callback([makeColumn("hyarmen", {from: "hy"}).addBelow("y-quenya", {from: "y"})]);
                    }
                } else { // h
                    if (options.classicalH) {
                        if (options.harma) { // before harma became aha initially
                            if (previous) { // medial
                                return callback([makeColumn("halla", {from: "h"})])(character);
                            } else { // initial
                                return callback([makeColumn("harma", {from: "h"})])(character);
                            }
                        } else { // harmen renamed and resounded as aha in initial position
                            if (previous) { // medial
                                return callback([makeColumn("hyarmen", {from: "h"})])(character);
                            } else { // initial
                                return callback([makeColumn("halla", {from: "h"})])(character);
                            }
                        }
                    } else { // third age, namarië
                        return callback([makeColumn("hyarmen", {from: "h"})])(character);
                    }
                }
            };
        } else if (character === "d") {
            return callback([makeColumn("ando", {from: "d"}).addError("D cannot appear except after N, L, or R in Classical Mode")]);
        } else if (character === "b") {
            return callback([makeColumn("umbar", {from: "b"}).addError("B cannot appear except after M or L in Classical Mode")]);
        } else if (character === "g") {
            return callback([makeColumn("anga", {from: "g"}).addError("G cannot appear except after N or Ñ in Classical Mode")]);
        } else if (character === "j") {
            return callback([makeColumn("ure", {from: "j"}).addError("J cannot be transcribed in Classical Mode")]);
        } else {
            return callback([])(character);
        }
    };
}

function parseTehta(callback, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "a") {
            return function (character) {
                if (character === "a") {
                    return parseTehta(callback, options, previous)("á");
                } else if (character === "i") {
                    return callback([previous, makeColumn("yanta", {from: "i", diphthong: true}).addAbove("a", {from: "a"})]);
                } else if (character === "u") {
                    return callback([previous, makeColumn("ure", {from: "u", diphthong: true}).addAbove("a", {from: "a"})]);
                } else if (previous && previous.canAddAbove("a")) {
                    return callback([previous.addAbove("a", {from: "a"})])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", {from: "a"}).addAbove("a", {})])(character);
                }
            };
        } else if (character === "e" || character === "ë") {
            var tehta = swapDotSlash("e", options);
            return function (character) {
                if (character === "e") {
                    return parseTehta(callback, options, previous)("é");
                } else if (character === "u") {
                    return callback([previous, makeColumn("ure", {from: "u", diphthong: true}).addAbove(tehta, {from: "e"})]);
                } else if (previous && previous.canAddAbove("e")) {
                    return callback([previous.addAbove(tehta, {from: "e"})])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", {from: "e"}).addAbove(tehta, {})])(character);
                }
            };
        } else if (character === "i") {
            var iTehta = swapDotSlash("i", options);
            return function (character) {
                if (character === "i") {
                    return parseTehta(callback, options, previous)("í");
                } else if (character === "u") {
                    if (options.iuRising) {
                        return callback([previous, makeColumn("anna", {from: "i", diphthong: true}).addAbove(reverseCurls("u", options), {from: "u"}).addBelow("y-quenya", {from: "y"})]);
                    } else {
                        return callback([previous, makeColumn("ure", {from: "u", diphthong: true}).addAbove(iTehta, {from: "i"})]);
                    }
                } else if (previous && previous.canAddAbove(iTehta)) {
                    return callback([previous.addAbove(iTehta, {from: "i"})])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", {from: "i"}).addAbove(iTehta, {})])(character);
                }
            };
        } else if (character === "o") {
            return function (character) {
                if (character === "o") {
                    return parseTehta(callback, options, previous)("ó");
                } else if (character === "i") {
                    return callback([previous, makeColumn("yanta", {from: "i", diphthong: true}).addAbove(reverseCurls("o", options), {from: "o"})]);
                } else if (previous && previous.canAddAbove("o")) {
                    return callback([previous.addAbove(reverseCurls("o", options), {from: "o"})])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", {from: "o"}).addAbove(reverseCurls("o", options), {})])(character);
                }
            };
        } else if (character === "u") {
            return function (character) {
                if (character === "u") {
                    return parseTehta(callback, options, previous)("ú");
                } else if (character === "i") {
                    return callback([previous, makeColumn("yanta", {from: "i", diphthong: true}).addAbove(reverseCurls("u", options), {from: "u"})]);
                } else if (previous && previous.canAddAbove("u")) {
                    return callback([previous.addAbove(reverseCurls("u", options), {from: "u"})])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", {from: "u"}).addAbove(reverseCurls("u", options), {})])(character);
                }
            };
        } else if (character === "y") {
            if (previous && previous.canAddBelow("y-quenya")) {
                return parseTehta(callback, options, previous.addBelow("y-quenya", {from: "y"}));
            } else {
                var next = makeColumn("anna", {}).addBelow("y-quenya", {from: "y"});
                return parseTehta(function (moreColumns) {
                    return callback([previous].concat(moreColumns));
                }, options, next);
            }
        } else if (character === "á" || character === "â") {
            return callback([previous, makeColumn("long-carrier", {from: character}).addAbove("a", {})]);
        } else if (character === "é" || character === "ê") {
            return callback([previous, makeColumn("long-carrier", {from: character}).addAbove(swapDotSlash("e", options), {})]);
        } else if (character === "í" || character === "î") {
            return callback([previous, makeColumn("long-carrier", {from: character}).addAbove(swapDotSlash("i", options), {})]);
        } else if (character === "ó" || character === "ô") {
            if (previous && previous.canAddAbove("ó")) {
                return callback([previous.addAbove(reverseCurls("ó", options), {from: character})]);
            } else {
               return callback([previous, makeColumn("long-carrier", {from: character}).addAbove(reverseCurls("o", options), {})]);
            }
        } else if (character === "ú" || character === "û") {
            if (previous && previous.canAddAbove("ú")) {
                return callback([previous.addAbove(reverseCurls("ú", options), {from: character})]);
            } else {
                return callback([previous, makeColumn("long-carrier", {from: character}).addAbove(reverseCurls("u", options), {})]);
            }
        } else {
            return callback([previous])(character);
        }
    };
}

var curlReversals = {"o": "u", "u": "o", "ó": "ú", "ú": "ó"};
function reverseCurls(tehta, options) {
    if (options.reverseCurls) {
        tehta = curlReversals[tehta] || tehta;
    }
    return tehta;
}

var dotSlashSwaps = {"e": "i", "i": "e"};
function swapDotSlash(tehta, options) {
    if (options.swapDotSlash) {
        tehta = dotSlashSwaps[tehta] || tehta;
    }
    return tehta;
}

// Notes regarding "h":
//
// http://at.mansbjorkman.net/teng_quenya.htm#note_harma
// originally:
//  h represented ach-laut and was written with harma.
//  h initial transcribed as halla
//  h medial transcribed as harma
//  hy transcribed as hyarmen
// then harma became aha:
//  then h in initial position became a breath-h, still spelled with harma, but
//  renamed aha.
//  h initial transcribed as harma
//  h medial transcribed as hyarmen
//  hy transcribed as hyarmen with underposed y
// then, in the third age:
//  the h in every position became a breath-h
//  except before t, where it remained pronounced as ach-laut
//  h initial ???
//  h medial transcribed as harma
//  h transcribed as halla or hyarmen in other positions (needs clarification)
//
// ach-laut (_ch_, /x/ phonetically, {h} by tolkien)
//   original: harma in all positions
//   altered: harma initially, halla in all other positions
//   third-age: halla in all other positions
// hy (/ç/ phonetically)
//   original: hyarmen in all positions
//   altered: hyarmen with y below
//   third-age:
// h (breath h)
//   original: halla in all positions
//   altered: hyarmen medially
//   third-age:
//
// harma:
//   original: ach-laut found in all positions
//   altered: breath h initially (renamed aha), ach-laut medial
//   third-age: ach-laut before t, breath h all other places
// hyarmen:
//   original: represented {hy}, palatalized h, in all positions
//   altered: breath h medial, palatalized with y below
//   third-age: same
// halla:
//   original: breath-h, presuming existed only initially
//   altered: breath h initial
//   third-age: only used for hl and hr
//
// hr: halla romen
// hl: halla lambe
// ht: harma
// hy:
//   original: hyarmen
//   altered:
//     initial: ERROR
//     medial: hyarmen lower-y
//   third age: hyarmen lower-y
// ch: harma
// h initial:
//   original: halla
//   altered: XXX
//   third-age: harma
// h medial: hyarmen

