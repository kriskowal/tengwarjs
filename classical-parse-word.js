"use strict";

var Parser = require("./parser");
var parseTengwa = require("./classical-parse-tengwa").parseTengwa;
var reverseCurls = require("./classical-parse-tengwa").reverseCurls;
var swapDotSlash = require("./classical-parse-tengwa").swapDotSlash;

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

exports.parseWord = parseWord;
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

var punctuation = require("./punctuation");
var parseNumber = require("./numbers");
