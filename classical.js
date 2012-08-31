
var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var makeParser = require("./parser");
var normalize = require("./normalize");
var punctuation = require("./punctuation");

var defaults = {};
function makeOptions(options) {
    options = options || defaults;
    return {
        font: options.font || TengwarAnnatar,
        vilya: options.vilya,
        // false: (v: vala, w: wilya)
        // true: (v: vilya, w: ERROR)
        harma: options.harma,
        // between the original formation of the language,
        // but before the third age,
        // harma was renamed aha,
        // and meant breath-h in initial position
        classical: options.classical,
        // before the third age
        // affects use of "r" and "h"
        // without classic, we default to the mode from the namarie poem.
        // in the classical period, "r" was transcribed as "ore" only between
        // vowels.
        // in the third age, through the namarie poem, "r" is only "ore" before
        // consontants and at the end of words.
        // TODO figure out "h"
        iuRising: options.isRising,
        // iuRising thirdAge: anna:y,u
        // otherwise: ure:i
        // in the third age, "iu" is a rising diphthong,
        // whereas all others are falling.  rising means
        // that they are stressed on the second sound, as
        // in "yule".  whether to use yanta or anna is
        // not attested.
        longHalla: options.longHalla
        // TODO indicates that halla should be used before medial L and W to
        // indicate that these are pronounced with length.
        // initial hl and hw remain short.
        // TODO doubled dots for í
        // TODO triple dots for y
        // TODO simplification of a, noting non-a
        // TODO following W in this mode?
    };
};

exports.transcribe = transcribe;
function transcribe(text, options) {
    options = makeOptions(options);
    var font = options.font;
    return font.transcribe(parse(text, options));
}

exports.encode = encode;
function encode(text, options) {
    options = makeOptions(options);
    return Notation.encode(parse(text, options));
}

// TODO convert to parse tree
exports.parse = parse;
function parse(text, options) {
    options = makeOptions(options);
    var font = options.font;
    var makeColumn = font.makeColumn;
    return text.split(/\n\n\n+/).map(function (section) {
        return section.split(/\n\n/).map(function (paragraph) {
            return paragraph.split(/\n/).map(function (line) {
                var words = [];
                var word = [];
                line.toLowerCase().replace(
                    /([\wáéíóúëâêîôûñ']+)|(.)/g,
                    function ($, contiguous, other) {
                        if (contiguous) {
                            try {
                                word.push.apply(word, parseWord(normalize(contiguous), options));
                            } catch (exception) {
                                word.push(makeColumn().addError("Cannot transcribe " + JSON.stringify(contiguous) + " because " + exception.message));
                            }
                        } else if (punctuation[other]) {
                            word.push(makeColumn(punctuation[other]));
                        } else if (other === " ") {
                            words.push(word);
                            word = [];
                        } else {
                            word.push(makeColumn().addError("Cannot transcribe " + JSON.stringify(other)));
                        }
                    }
                );
                if (word.length) {
                    words.push(word);
                }
                return words;
            });
        });
    });
}

// original mode: (classical)
// interim: (classical + wilya? + aha? + longHalla?)
// third age: (iuRising?) default

var parseWord = makeParser(function (callback, options) {
    return parseWordTail(callback, options, []);
});

// state machine

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
    return parseTengwa(function (columns) {
        var previous = columns.pop();
        return parseTehta(function (next) {
            return callback(columns.concat(next).filter(Boolean));
        }, options, previous);
    }, options, previous);
}

var vowels = "aeiouyáéíóú";

function parseTengwa(callback, options, previous) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return function (character) {
        if (character === "n") { // n
            return function (character) {
                if (character === "n") { // nn
                    return callback([makeColumn("numen").addTildeBelow()]);
                } else if (character === "t") { // nt
                    return callback([makeColumn("tinco")]);
                } else if (character === "d") { // nd
                    return callback([makeColumn("ando")]);
                } else if (character === "g") { // ng
                    return function (character) {
                        if (character === "w") { // ngw -> ñw
                            return callback([makeColumn("ungwe")]);
                        } else { // ng
                            return callback([makeColumn("anga")])(character);
                        }
                    };
                } else if (character === "c") { // nc
                    return function (character) {
                        if (character === "w") { // ncw
                            return callback([makeColumn("unque")]);
                        } else { // nc
                            return callback([makeColumn("anca")])(character);
                        }
                    };
                } else {
                    return callback([makeColumn("numen")])(character);
                }
            };
        } else if (character === "m") {
            return function (character) {
                if (character === "m") { // mm
                    return callback([makeColumn("malta").addTildeBelow()]);
                } else if (character === "p") { // mp
                    return callback([makeColumn("ampa")]);
                } else if (character === "b") { // mb
                    return callback([makeColumn("umbar")]);
                } else {
                    return callback([makeColumn("malta")])(character);
                }
            };
        } else if (character === "ñ") { // ñ
            return function (character) {
                if (character === "g") { // ñg
                    return function (character) {
                        if (character === "w") { // ñgw
                            return callback([makeColumn("ungwe")]);
                        } else { // ñg
                            return callback([makeColumn("anga")])(character);
                        }
                    }
                } else if (character === "c") { // ñc
                    return function (character) {
                        if (character === "w") { // ñcw
                            return callback([makeColumn("unque")]);
                        } else { // ñc
                            return callback([makeColumn("anca")]);
                        }
                    }
                } else {
                    return callback([makeColumn("noldo")])(character);
                }
            };
        } else if (character === "t") {
            return function (character) {
                if (character === "t") { // tt
                    return function (character) {
                        if (character === "y") { // tty
                            return callback([makeColumn("tinco").addBelow("y").addTildeBelow()]);
                        } else { // tt
                            return callback([makeColumn("tinco").addTildeBelow()])(character);
                        }
                    };
                } else if (character === "y") { // ty
                    return callback([makeColumn("tinco").addBelow("y")]);
                } else if (character === "h") {
                    return callback([makeColumn("thule")]);
                } else if (character === "s") {
                    return function (character) {
                        // TODO s-inverse, s-extended, s-flourish
                        if (character === "") { // ts final
                            return callback([makeColumn("tinco").addFollowing("s")])(character);
                        } else { // ts medial
                            return callback([
                                makeColumn("tinco"),
                                makeColumn("silme")
                            ])(character);
                        }
                    };
                } else { // t
                    return callback([makeColumn("tinco")])(character);
                }
            };
        } else if (character === "p") {
            return function (character) {
                if (character === "p") {
                    return function (character) {
                        if (character === "y") {
                            return callback([makeColumn("parma").addBelow("y").addTildeBelow()]);
                        } else {
                            return callback([makeColumn("parma").addTildeBelow()])(character);
                        }
                    };
                } else if (character === "y") { // py
                    return callback([makeColumn("parma").addBelow("y")]);
                } else if (character === "s") { // ps
                    return function (character) {
                        if (character === "") { // ps final
                            return callback([makeColumn("parma").addFollowing("s")])(character);
                        } else { // ps medial
                            return callback([
                                makeColumn("parma"),
                                makeColumn("silme")
                            ])(character);
                        }
                    };
                } else { // t
                    return callback([makeColumn("parma")])(character);
                }
            };
        } else if (character === "c") {
            return function (character) {
                if (character === "c") {
                    return callback([makeColumn("calma").addTildeBelow()]);
                } else if (character === "s") {
                    return callback([makeColumn("calma").addBelow("s")]);
                } else if (character === "h") {
                    return callback([makeColumn("harma")]);
                } else if (character === "w") {
                    return callback([makeColumn("quesse")]);
                } else {
                    return callback([makeColumn("calma")])(character);
                }
            };
        } else if (character === "f") {
            return callback([makeColumn("formen")]);
        } else if (character === "v") {
            if (options.vilya) {
                return callback([makeColumn("wilya")]); // vilya
            } else {
                return callback([makeColumn("vala")]);
            }
        } else if (character === "w") {
            if (options.vilya) {
                return callback([])("u");
            } else {
                return callback([makeColumn("wilya")]);
            }
        } else if (character === "r") { // r
            return function (character) {
                if (character === "d") { // rd
                    return callback([makeColumn("arda")]);
                } else if (character === "h") { // rh -> hr
                    var error = "R should preceed H in the HR diagraph in Classical mode.";
                    return callback([
                        makeColumn("halla").addError(error),
                        makeColumn("romen").addError(error)
                    ]);
                } else if (options.classical) {
                    // pre-namarie style, ore when r between vowels
                    if (
                        previous &&
                        previous.above &&
                        character !== "" &&
                        vowels.indexOf(character) !== -1
                    ) {
                        return callback([makeColumn("ore")])(character);
                    } else {
                        return callback([makeColumn("romen")])(character);
                    }
                } else {
                    // pre-consonant and word-final
                    if (character === "" || vowels.indexOf(character) === -1) { // ore
                        return callback([makeColumn("ore")])(character);
                    } else { // romen
                        return callback([makeColumn("romen")])(character);
                    }
                }
            };
        } else if (character === "l") {
            return function (character) {
                if (character === "l") {
                    return function (character) {
                        if (character === "y") {
                            return callback([makeColumn("lambe").addBelow("y").addTildeBelow()]);
                        } else {
                            return callback([makeColumn("lambe").addTildeBelow()])(character);
                        }
                    }
                } else if (character === "y") {
                    return callback([makeColumn("lambe").addBelow("y")]);
                } else if (character === "h") { // lh -> hl
                    var error = "L should preceed H in the HL diagraph in Classical mode.";
                    return callback([
                        makeColumn("halla").addError(error),
                        makeColumn("lambe").addError(error)
                    ]);
                } else if (character === "d") {
                    return callback([makeColumn("alda")]);
                } else if (character === "b") {
                    return callback([makeColumn("lambe"), makeColumn("umbar")]);
                } else {
                    return callback([makeColumn("lambe")])(character);
                }
            };
        } else if (character === "s") {
            return function (character) {
                if (character === "s") { // ss
                    return callback([makeColumn("esse")]);
                } else {
                    return callback([makeColumn("silme")])(character);
                }
            };
        } else if (character === "h") {
            return function (character) {
                if (character === "l") {
                    return callback([
                        makeColumn("halla"),
                        makeColumn("lambe")
                    ]);
                } else if (character === "r") {
                    return callback([
                        makeColumn("halla"),
                        makeColumn("romen")
                    ]);
                } else if (character === "w") {
                    return callback([makeColumn("hwesta")]);
                } else if (character === "t") {
                    return callback([makeColumn("harma")]);
                } else if (character === "y") {
                    if (options.classical && options.harma) { // oldest form
                        return callback([makeColumn("hyarmen")]);
                    } else { // post-aha, through to the third-age
                        return callback([makeColumn("hyarmen").addBelow("y")]);
                    }
                } else {
                    if (options.classical) {
                        if (options.harma) { // before harma became aha initially
                            return callback([makeColumn("harma")])(character);
                        } else { // harmen renamed and resounded as aha in initial position
                            if (previous) { // medial
                                return callback([makeColumn("hyarmen")])(character);
                            } else { // initial
                                return callback([makeColumn("harma")])(character);
                            }
                        }
                    } else { // third age, namarië
                        return callback([makeColumn("hyarmen")])(character);
                    }
                }
            };
        } else if (character === "d") {
            return callback([makeColumn("ando").addError("D cannot appear except after N, L, or R")]);
        } else if (character === "b") {
            return callback([makeColumn("umbar").addError("B cannot appear except after M or L")]);
        } else if (character === "g") {
            return callback([makeColumn("anga").addError("G cannot appear except after N or Ñ")]);
        } else if (character === "j") {
            return callback([makeColumn().addError("J cannot be transcribed in Classical Mode")]);
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
                if (character === "i") {
                    return callback([previous, makeColumn("yanta", "a")]);
                } else if (character === "u") {
                    return callback([previous, makeColumn("ure", "a")]);
                } else if (previous && previous.canAddAbove()) {
                    previous.addAbove("a");
                    return callback([previous])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", "a")])(character);
                }
            };
        } else if (character === "e") {
            return function (character) {
                if (character === "u") {
                    return callback([previous, makeColumn("ure", "e")]);
                } else if (previous && previous.canAddAbove()) {
                    previous.addAbove("e");
                    return callback([previous])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", "e")])(character);
                }
            };
        } else if (character === "i") {
            return function (character) {
                if (character === "u") {
                    if (options.iuRising) {
                        return callback([previous, makeColumn("anna", "u").addBelow("y")]);
                    } else {
                        return callback([previous, makeColumn("ure", "i")]);
                    }
                } else if (previous && previous.canAddAbove()) {
                    previous.addAbove("i");
                    return callback([previous])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", "i")])(character);
                }
            };
        } else if (character === "o") {
            return function (character) {
                if (character === "i") {
                    return callback([previous, makeColumn("yanta", "o")]);
                } else if (previous && previous.canAddAbove()) {
                    previous.addAbove("o");
                    return callback([previous])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", "o")])(character);
                }
            };
        } else if (character === "u") {
            return function (character) {
                if (character === "i") {
                    return callback([previous, makeColumn("yanta", "u")]);
                } else if (previous && previous.canAddAbove()) {
                    previous.addAbove("u");
                    return callback([previous])(character);
                } else {
                    return callback([previous, makeColumn("short-carrier", "u")])(character);
                }
            };
        } else if (character === "y") {
            if (previous && previous.canAddBelow()) {
                return callback([previous.addBelow("y")]);
            } else {
                var next = makeColumn("anna").addBelow("y");
                return parseTehta(function (moreColumns) {
                    return callback([previous].concat(moreColumns));
                }, options, next);
            }
        } else if (character === "á") {
            return callback([previous, makeColumn("long-carrier", "a")]);
        } else if (character === "é") {
            return callback([previous, makeColumn("long-carrier", "e")]);
        } else if (character === "í") {
            return callback([previous, makeColumn("long-carrier", "i")]);
        } else if (character === "ó") {
            if (previous && previous.canAddAbove()) {
                previous.addAbove('ó');
                return callback([previous]);
            } else {
               return callback([previous, makeColumn("long-carrier", "o")]);
            }
        } else if (character === "ú") {
            if (previous && previous.canAddAbove()) {
                previous.addAbove('ú');
                return callback([previous]);
            } else {
                return callback([previous, makeColumn("long-carrier", "u")]);
            }
        } else {
            return callback([previous])(character);
        }
    };
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

