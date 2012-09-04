
var Parser = require("./parser");
var makeTrie = require("./trie");
var makeParserFromTrie = require("./trie-parser");
var array_ = Array.prototype;

module.exports = normalize;
function normalize(callback) {
    return toLowerCase(simplify(callback));
};

function toLowerCase(callback) {
    return function passthrough(character) {
        callback = callback(character.toLowerCase());
        return passthrough;
    };
}

var table = {
    "k": "c",
    "x": "cs",
    "q": "cw",
    "qu": "cw",
    "p": "p",
    "ph": "f",
    "b": "b",
    "bh": "v",
    "ë": "e",
    "â": "á",
    "ê": "é",
    "î": "í",
    "ô": "ó",
    "û": "ú"
};

var trie = makeTrie(table);

var simplify = makeParserFromTrie(
    trie,
    function makeProducer(string) {
        return function (callback) {
            return Array.prototype.reduce.call(string, function (callback, character) {
                return callback(character);
            }, callback);
        };
    },
    function callback(callback) {
        return simplify(callback);
    },
    function fallback(callback) {
        return function (character) {
            return simplify(callback(character));
        };
    }
);

