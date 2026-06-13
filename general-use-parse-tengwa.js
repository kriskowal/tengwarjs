"use strict";

var Parser = require("./parser");

var vowels = "aeëiouáéíóú";
var shorterVowels = {"á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u"};

exports.parseTengwa = parseTengwa;
exports.makeCarrier = makeCarrier;

function makeCarrier(tehta, tehtaFrom, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    if (tehta === "á") {
        return makeColumn("anna", {from: "a"})
            .addAbove("a", {from: "a"});
    } else if (shorterVowels[tehta]) {
        return makeColumn("long-carrier", {from: tehtaFrom})
            .addAbove(shorterVowels[tehta], {from: ""});
    } else {
        return makeColumn("short-carrier", {from: tehtaFrom})
            .addAbove(tehta, {from: ""});
    }
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
                            column = makeColumn("formenparma", {from: "ph"}).varies();
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
                if (character2 === "h") { // kh is ach laut
                    if (!options.noAchLaut) {
                        return callback(makeColumn("hwesta", {from: character + character2}), tehta, tehtaFrom);
                    } else { // kh is just k
                        return callback(makeColumn("quesse", {from: character}), tehta, tehtaFrom);
                    }
                } else { // c. or k.
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
                        return callback(makeColumn("unqueungwe", {from: "gh"}), tehta, tehtaFrom);
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
                        return callback(makeColumn("harmacalma", {from: "sh"}), tehta, tehtaFrom);
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
            return function (character2) {
                if (character2 === "") {
                    // final e` in english should be equivalent to diaresis.
                    // tehta deliberately consumed in this case, not passed forward.
                    return callback(
                        makeColumn("short-carrier", {from: ""})
                            .addAbove("e", {from: "e"})
                    );
                } else {
                    // tehta deliberately consumed in this case, not passed forward.
                    return callback(
                        makeColumn("short-carrier", {from: ""})
                            .addBelow("i-below", {from: "e", silent: true})
                    )(character)(character2);
                }
            };
        } else if (character === "" && options.language === "english" && tehta === "e") {
            // tehta deliberately consumed in this case, not passed forward.
            return callback(
                makeColumn("short-carrier", {from: ""})
                    .addBelow("i-below", {from: "e", silent: true})
            )(character);
        } else {
            return callback(null, tehta, tehtaFrom)(character);
        }
    };
}
