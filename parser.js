
module.exports = function makeParser(production, errorHandler) {
    var errorHandler = errorHandler || function (error) {
        throw new Error(error);
    };
    return function (text /*, ...args*/) {

        // the parser is a monadic state machine.
        // each state is represented by a function that accepts
        // a character.  parse functions accept a callback (for forwarding the
        // result) and return a state.
        var result;
        var state = production.apply(null, [function (_result) {
            result = _result;
            return expectEof(errorHandler);
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

