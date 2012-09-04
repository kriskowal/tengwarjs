
var Parser = require("./parser");

// produces a document parser from a word parser in an arbitrary mode
module.exports = makeDocumentParser;
function makeDocumentParser(parseWord, makeOptions) {
    var parseLine = Parser.makeDelimitedParser(parseWord, parseSomeSpaces);
    var parseParagraph = Parser.makeDelimitedParser(parseLine, parseNewlineSpace);
    var parseSection = Parser.makeDelimitedParser(parseParagraph, parseNewlineSpace);
    var parseDocument = Parser.makeDelimitedParser(parseSection, parseNewlineSpaces);
    return Parser.makeParser(function (callback, options) {
        options = makeOptions(options);
        var state = parseDocument(callback, options);
        return state;
    });
}

var parseAnySpaces = Parser.makeParseAny(" ");
var parseSomeSpaces = Parser.makeParseSome(" ");
var parseNewline = Parser.makeExpect("\n");
var parseNewlines = Parser.makeParseSome("\n");

function parseNewlineSpace(callback) {
    return parseAnySpaces(function () {
        return parseNewline(function () {
            return parseAnySpaces(callback);
        });
    });
}

function parseNewlineSpaces(callback) {
    return parseAnySpaces(function () {
        return parseNewlines(function () {
            return parseAnySpaces(callback);
        });
    });
}
