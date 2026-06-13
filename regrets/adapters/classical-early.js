"use strict";
var Classical = require("../../classical");
module.exports = function encodeClassical(text) {
    return Classical.encode(text, { classicalR: true, classicalH: true });
};
