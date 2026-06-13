"use strict";

var Parser = require("./parser");

// Coordinates the annotation parsing pipeline: above (w), below (e/y), then following (s)
exports.parseTengwaAnnotations = parseTengwaAnnotations;
function parseTengwaAnnotations(callback, column, length, options) {
    return parseFollowingAbove(function (column) {
        return parseFollowingBelow(function (column) {
            return parseFollowing(callback, column);
        }, column, length, options);
    }, column);
}

// add a following-w above the current character if the next character is W and
// there is room for it.
function parseFollowingAbove(callback, column) {
    if (column.canAddAbove("w", "w")) {
        return function (character) {
            if (character === "w") {
                return callback(column.addAbove("w", {from: "e"}));
            } else {
                return callback(column)(character);
            }
        };
    } else {
        return callback(column);
    }
}

function parseFollowingBelow(callback, column, length, options) {
    return function (character) {
        if (character === "ë" && options.language !== "english") {
            character = "e";
        }
        if (options.language === "english" && character === "y" && column.canAddAbove("y-english")) {
            return callback(column.addAbove("y-english", {from: "y"}));
        } else if (character === "y" && column.canAddAbove("y-sindarin")) {
            return callback(column.addAbove("y-sindarin", {from: "y"}));
        } else if (character === "e" && column.canAddBelow("i-below")) {
            return Parser.countPrimes(function (primes) {
                return function (character) {
                    if (Parser.isFinal(character) && options.language === "english" && length > 2) {
                        if (primes === 0) {
                            return callback(
                                column.addBelow("i-below", {from: "e", silent: true})
                                    .varies()
                            )(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column)("e")(character);
                        }
                    } else {
                        if (primes === 0) {
                            return callback(column.varies())("e")(character);
                        } else {
                            if (primes > 1) {
                                column.addError("Following E has only one variation.");
                            }
                            return callback(column.addBelow("i-below", {from: "e", eilent: true}))(character);
                        }
                    }
                };
            });
        } else {
            return callback(column)(character);
        }
    };
}

function parseFollowing(callback, column) {
    return function (character) {
        if (character === "s") {
            if (column.canAddBelow("s")) {
                return Parser.countPrimes(function (primes, rewind) {
                    if (primes === 0) {
                        return callback(column.addBelow("s", {from: "s"}).varies());
                    } else if (primes) {
                        if (primes > 1) {
                            column.addError("Only one alternate form for following S.");
                        }
                        return rewind(callback(column)("s"));
                    }
                });
            } else {
                return Parser.countPrimes(function (primes, rewind) {
                    return function (character) {
                        if (Parser.isFinal(character)) { // end of word
                            if (column.canAddFollowing("s-final") && primes-- === 0) {
                                column.addFollowing("s-final", {from: "s"});
                            } else if (column.canAddFollowing("s-inverse") && primes -- === 0) {
                                column.addFollowing("s-inverse", {from: "s"});
                                if (column.canAddFollowing("s-final")) {
                                    column.varies();
                                }
                            } else if (column.canAddFollowing("s-extended") && primes-- === 0) {
                                column.addFollowing("s-extended", {from: "s"});
                                if (column.canAddFollowing("s-inverse")) {
                                    column.varies();
                                }
                            } else if (column.canAddFollowing("s-flourish") && primes-- === 0) {
                                column.addFollowing("s-flourish", {from: "s"});
                                if (column.canAddFollowing("s-extended")) {
                                    column.varies();
                                }
                            } else {
                                // rewind primes for subsequent alterations
                                var state = callback(column)("s");
                                while (primes-- > 0) {
                                    state = state("`");
                                }
                                return state(character);
                            }
                            return callback(column)(character);
                        } else {
                            return rewind(callback(column)("s"))(character);
                        }
                    };
                });
            }
        } else {
            return callback(column)(character);
        }
    };
}
