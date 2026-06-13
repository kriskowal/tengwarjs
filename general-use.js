"use strict";

var TengwarAnnatar = require("./tengwar-annatar");
var Notation = require("./notation");
var makeDocumentParser = require("./document-parser");
var generalUseParser = require("./general-use-parser");

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
        // "black speech": sh is harmacalma, gh is unqueungwe, as in
        // the ring inscription
        // not "black-speech": sh is harma, gh is unque
        noAchLaut: options.noAchLaut,
        // false: "kh" is interpreted as ach-laut, as in "bach".
        // true: "kh" is interpreted as merely "k", as in "khan".
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

var parse = exports.parse = makeDocumentParser(generalUseParser.parseTengwarWord, makeOptions);

exports.parseTengwaAnnotations = generalUseParser.parseTengwaAnnotations;
