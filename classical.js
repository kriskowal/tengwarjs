"use strict";

var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var makeDocumentParser = require("./document-parser");
var parseWord = require("./classical-parse-word").parseWord;

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
