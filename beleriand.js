"use strict";

// TODO parse following "w"

var TengwarParmaite = require("./tengwar-parmaite");
var Notation = require("./notation");
var makeDocumentParser = require("./document-parser");
var beleriandParser = require("./beleriand-parser");

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

var parse = exports.parse = makeDocumentParser(beleriandParser.parseTengwarWord, makeOptions);
