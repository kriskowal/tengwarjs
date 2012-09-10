
var Parser = require("./parser");

var array_ = Array.prototype;

module.exports = parseNumber;
function parseNumber(callback, options) {
    var font = options.font;
    var makeColumn = font.makeColumn;
    return parseDigits(function (digits) {
        if (digits) {
            return parseConvert(callback, digits.join(""), makeColumn);
        } else {
            return callback();
        }
    });
}

var digits = "0123456789";
var parseDigit = function (callback) {
    return function (character) {
        if (character !== "" && digits.indexOf(character) !== -1) {
            return callback(character);
        } else {
            return callback()(character);
        }
    };
};

function parseConvert(callback, number, makeColumn) {
    return Parser.countPrimes(function (primes) {
        return callback(convert(number, primes, makeColumn));
    });
}

function convert(string, primes, makeColumn) {
    var error;
    var radix;
    if (primes == 0) {
        radix = 10;
    } else {
        radix = 12;
        error = primes > 1;
    }
    var number = parseInt(string, 10);
    var string = number.toString(radix).split("");
    return string.map(function (character) {
        var column = makeColumn(""+parseInt(character, 12));
        if (error) {
            column.addError("Numbers can only be parsed in either decimal or dudecimal.");
        }
        return column;
    });
}

var parseDigits = Parser.makeParseSome(parseDigit);

