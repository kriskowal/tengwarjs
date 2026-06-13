"use strict";

// Test wrapper for index.js that provides named mode and font parameters
// The index.js exports transcribe(text, mode, font, options) and encode(text, mode, font, options)
// where mode/font are module references. This wrapper converts string names to module refs.

var Index = require("../index");
var Modes = require("../modes");
var Fonts = require("../fonts");

exports.transcribe = function (text, modeName, fontName, options) {
    var mode = Modes[modeName] || Modes["general-use"];
    var font = Fonts[fontName] || Fonts["annatar"];
    return Index.transcribe(text, mode, font, options);
};

exports.encode = function (text, modeName, fontName, options) {
    var mode = Modes[modeName] || Modes["general-use"];
    var font = Fonts[fontName] || Fonts["annatar"];
    return Index.encode(text, mode, font, options);
};
