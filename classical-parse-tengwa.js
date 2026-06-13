"use strict";

var Parser = require("./parser");

var vowels = "aeiouyáéíóú";

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

exports.parseTengwa = parseTengwa;
exports.reverseCurls = reverseCurls;
exports.swapDotSlash = swapDotSlash;

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
