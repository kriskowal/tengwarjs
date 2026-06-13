"use strict";
var GeneralUse = require("../../general-use");
module.exports = function transcribePlain(text) {
    return GeneralUse.transcribe(text, { plain: true });
};
