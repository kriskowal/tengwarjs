
var array_ = Array.prototype;

module.exports = function parseNumber(text, radix, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return array_.map.call(parseInt(text, radix).toString(radix), function (character) {
        return makeColumn("#" + character);
    });
};

