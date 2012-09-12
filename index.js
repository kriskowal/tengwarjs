
exports.transcribe = function (text, mode, font, options) {
    options = mode.makeOptions(options);
    options.font = font;
    return mode.transcribe(text, options);
};

exports.encode = function (text, mode, font, options) {
    options = mode.makeOptions(options);
    options.font = font;
    return mode.encode(text, options);
};

