"use strict";
var GeneralUse = require("../../general-use");
module.exports = function encodeBlackSpeech(text) {
    return GeneralUse.encode(text, { language: "black-speech" });
};
