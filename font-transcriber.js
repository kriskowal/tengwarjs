"use strict";

var Alphabet = require("./alphabet");
var makeFontColumn = require("./column");

/**
 * Factory function that creates shared transcription logic for Tengwar font modules.
 * Both tengwar-annatar and tengwar-parmaite have identical transcribe/transcribeColumn
 * functions and nearly identical tehtaForTengwa/tehtaKeyForTengwa functions.
 * This factory eliminates that duplication.
 *
 * @param {Object} fontExports - The font module's exports object (must have tengwar, tehtar, positions)
 * @param {Object} config - Font-specific configuration
 * @param {string} [config.longVowels=""] - Vowels that should return null from tehtaKeyForTengwa
 * @param {*} [config.tehtaFallback=""] - Fallback value when no tehta glyph is found ("" for annatar, null for parmaite)
 */
module.exports = function createFontTranscriber(fontExports, config) {
    config = config || {};
    var tengwarMap = fontExports.tengwar;
    var tehtarMap = fontExports.tehtar;
    var positionsMap = fontExports.positions;
    var longVowels = config.longVowels || "";
    var tehtaFallback = config.tehtaFallback !== undefined ? config.tehtaFallback : "";

    function transcribe(sections, options) {
        options = options || {};
        var block = options.block || false;
        var beginParagraph = block ? "<p>" : "";
        var delimitParagraph = "<br>";
        var endParagraph = block ? "</p>" : "";
        return sections.map(function (section) {
            return section.map(function (paragraph) {
                return beginParagraph + paragraph.map(function (line) {
                    return line.map(function (word) {
                        return word.map(function (column) {
                            return transcribeColumn(column, options);
                        }).join("");
                    }).join(" ");;
                }).join(delimitParagraph + "\n") + endParagraph;
            }).join("\n\n");
        }).join("\n\n\n");
    }

    function transcribeColumn(column, options) {
        options = options || {};
        var plain = options.plain || false;
        var tengwa = column.tengwa || "anna";
        var tehtarList = [];
        if (column.above) tehtarList.push(column.above);
        if (column.below) tehtarList.push(column.below);
        if (column.tildeBelow) tehtarList.push("tilde-below");
        if (column.tildeAbove) tehtarList.push("tilde-above");
        if (column.following) tehtarList.push(column.following);
        var html = tengwarMap[tengwa] + tehtarList.map(function (tehta) {
            return tehtaForTengwa(tengwa, tehta);
        }).join("");
        if (column.errors && !plain) {
            html = "<abbr class=\"error\" title=\"" + column.errors.join("\n").replace(/"/g, "&quot;") + "\">" + html + "</abbr>";
        }
        return html;
    }

    function tehtaForTengwa(tengwa, tehta) {
        var tehtaKey = tehtaKeyForTengwa(tengwa, tehta);
        if (tehtaKey == null)
            return null;
        return (
            tehtarMap[tehta][tengwa] ||
            tehtarMap[tehta][tehtaKey] ||
            tehtaFallback
        );
    }

    function tehtaKeyForTengwa(tengwa, tehta) {
        if (!tehtarMap[tehta])
            return null;
        if (longVowels.indexOf(tehta) !== -1)
            return null;
        if (tehtarMap[tehta].special)
            return tehtarMap[tehta][tengwa] || null;
        if (Alphabet.barsAndTildes.indexOf(tehta) !== -1) {
            if (tengwa === "lambe" || tengwa === "alda" && tehtarMap[tehta].length >= 2)
                return 2;
            return positionsMap[tengwa].wide ? 0 : 1;
        }
        if (positionsMap[tengwa] == null)
            return null;
        if (positionsMap[tengwa][tehta] === null)
            return null;
        if (positionsMap[tengwa][tehta] != null)
            return positionsMap[tengwa][tehta];
        if (positionsMap[tengwa].others != null)
            return positionsMap[tengwa].others;
        return positionsMap[tengwa];
    }

    function makeColumn(tengwa, tengwarFrom) {
        return makeFontColumn(fontExports, tengwa, tengwarFrom);
    }

    return {
        transcribe: transcribe,
        transcribeColumn: transcribeColumn,
        tehtaForTengwa: tehtaForTengwa,
        makeColumn: makeColumn
    };
};
