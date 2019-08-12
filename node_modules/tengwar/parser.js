
var punctuation = require("./punctuation");

// builds a string parser from a streaming character parser
exports.makeParser = makeParser;
function makeParser(production, errorHandler) {
    var errorHandler = errorHandler || function (error, text) {
        throw new Error(error + " while parsing " + JSON.stringify(text));
    };
    return function (text /*, ...args*/) {
        // the parser is a monadic state machine.
        // each state is represented by a function that accepts
        // a character.  parse functions accept a callback (for forwarding the
        // result) and return a state.
        text = text.trim();
        var result;
        var state = production.apply(null, [function (_result) {
            result = _result;
            return expectEof(function (error) {
                return errorHandler(error, text);
            });
        }].concat(Array.prototype.slice.call(arguments, 1)));
        // drive the state machine
        Array.prototype.forEach.call(text, function (letter, i) {
            state = state(letter);
        });
        // break break break
        while (!result) {
            state = state(""); // EOF
        }
        return result;
    };
}

function expectEof(errback) {
    return function (character) {
        if (character !== "") {
            errback("Unexpected " + JSON.stringify(character));
        }
        return function noop() {
            return noop;
        };
    };
}

exports.makeExpect = makeExpect;
function makeExpect(expected) {
    return function (callback) {
        return function (character) {
            if (character === expected) {
                return callback(character);
            } else {
                return callback()(character);
            }
        };
    };
}

exports.makeParseSome = makeParseSome;
function makeParseSome(parseOne) {
    var parseSome = function (callback) {
        return parseOne(function (one) {
            if (one != null) {
                return parseRemaining(callback, [one]);
            } else {
                return callback([]);
            }
        });
    };
    var parseRemaining = makeParseAny(parseOne);
    return parseSome;
}

exports.makeParseAny = makeParseAny;
function makeParseAny(parseOne) {
    return function parseRemaining(callback, any) {
        any = any || [];
        return parseOne(function (one) {
            if (one != null) {
                return parseRemaining(callback, any.concat([one]));
            } else {
                return callback(any);
            }
        });
    };
}

exports.makeDelimitedParser = makeDelimitedParser;
function makeDelimitedParser(parsePrevious, parseDelimiter) {
    return function parseSelf(callback, options, terms) {
        terms = terms || [];
        return parsePrevious(function (term) {
            if (!term.length) {
                return callback(terms);
            } else {
                terms = terms.concat([term]);
                return parseDelimiter(function (delimiter) {
                    if (delimiter) {
                        return parseSelf(callback, options, terms);
                    } else {
                        return callback(terms);
                    }
                });
            }
        }, options);
    }
}

// used by parsers to determine whether the cursor is on a word break
exports.isBreak = isBreak;
function isBreak(character) {
    return character === " " || character === "\n" || character === "";
}

exports.isFinal = isFinal;
function isFinal(character) {
    return isBreak(character) || punctuation[character];
}

// used by multiple modes
exports.countPrimes = countPrimes;
function countPrimes(callback, primes, rewind) {
    primes = primes || 0;
    rewind = rewind || function (state) {
        return state;
    };
    return function (character) {
        if (character === "'") {
            return countPrimes(callback, primes + 1, function (state) {
                return rewind(state)("'");
            });
        } else {
            return callback(primes, rewind)(character);
        }
    };
}

