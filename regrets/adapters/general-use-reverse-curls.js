"use strict";
var GeneralUse = require("../../general-use");
module.exports = function encodeReverseCurls(text) {
    return GeneralUse.encode(text, { reverseCurls: true });
};
