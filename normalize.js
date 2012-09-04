
//  This module adapts streams of characters sent to one parser into a
//  simplified normal form piped to another.  Internally, a stream is
//  represented as a function that accepts the next character and returns a new
//  stream.
//
//      stream("a")("b")("c") -> stream
//
//  The input ends with an empty character.
//
//       stream("") -> stream
//
//  Functions that return streams and produce a syntax node accept a
//  callback that like a stream is required to return the initial stream state.
//
//       parseAbc(function (result) {
//           console.log(result);
//           return expectEof();
//       })("a")("b")("c")("")
//

var Parser = require("./parser");
var makeTrie = require("./trie");
var makeParserFromTrie = require("./trie-parser");
var array_ = Array.prototype;

//  The `normalize` function accepts a stream and returns a stream.  The
//  character sequence sent to the returned stream will be converted to a
//  normal form, where each character is lower-case and various clusters of
//  characters will be converted to a "normal" phonetic form so the subsequent
//  parser only has to deal with one input for each phonetic output.
//
//      normalize(parseWord(callback))("Q")("u")("x")
//
//  In this example, the callback would receive "cwcs", the normal form of
//  "Qux".
//
module.exports = normalize;
function normalize(callback) {
    return toLowerCase(simplify(callback));
};

// This is a parser adapter that always returns the same state, but internally
// tracks the state of the wrapped parser.  Each time the adapter receives a
// character, it converts it to lower case and uses that character to advance
// the state.
function toLowerCase(callback) {
    return function passthrough(character) {
        callback = callback(character.toLowerCase());
        return passthrough;
    };
}

// the keys of this table are characters and clusters of characters that must
// be simplified to the corresponding values before pumping them into an
// adapted parser.  The adapted parser therefore only needs to handle the
// normal phoneitc form of the cluster.
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

// This generates a data structure that can be walked by a parser, where each
// node corresponds to having parsed a certain prefix and follows to each
// common suffix.  If the parser is standing at a particular node of the trie
// and receives a character that does not match any of the subsequent subtrees,
// it "produces" the corresponding value at that node.
var trie = makeTrie(table);

var simplify = makeParserFromTrie(
    trie,
    function makeProducer(string) {
        // producing string involves advancing the state by individual
        // characters.
        return function (callback) {
            return Array.prototype.reduce.call(string, function (callback, character) {
                return callback(character);
            }, callback);
        };
    },
    function callback(callback) {
        // after a match has been emitted, loop back for another
        return simplify(callback);
    },
    function fallback(callback) {
        // if we reach a character that is not accounted for in the table, pass
        // it through without alternation, then start scanning for matches
        // again
        return function (character) {
            return simplify(callback(character));
        };
    }
);

