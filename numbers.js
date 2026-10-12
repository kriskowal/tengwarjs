"use strict";

var Parser = require("./parser");

var array_ = Array.prototype;

module.exports = parseNumber;
function parseNumber(callback, options) {
    return parseDigits(function (digits) {
        if (digits) {
            return parseConvert(callback, digits.join(""), options);
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

function parseConvert(callback, number, options) {
    return Parser.countPrimes(function (primes) {
        return callback(convert(number, primes, options));
    });
}

function convert(string, alt, options) {
    var error;
    var radix;
    var duodecimal = options.duodecimal;
    var font = options.font;
    var makeColumn = font.makeColumn;
    if (alt == 0) {
        radix = duodecimal ? 12 : 10;
    } else {
        radix = duodecimal ? 10 : 12;
        error = alt > 1;
    }
    var number = parseInt(string, 10);
    // Numerals are written units first (Quettar Special Publication No. 1, p. 15).
    var string = number.toString(radix).split("").reverse();
    return string.map(function (character) {
        var column = makeColumn(""+parseInt(character, 12));
        if (radix === 10) {
            column.addAbove("i");
        } else {
            column.addBelow("i-below");
        }
        if (error) {
            column.addError("Numbers can only be parsed in either decimal or dudecimal.");
        }
        return column;
    });
}

var parseDigits = Parser.makeParseSome(parseDigit);

