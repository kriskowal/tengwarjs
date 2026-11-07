"use strict";

exports.tengwar = [
    ["tinco", "parma", "calma", "quesse"],
    ["ando", "umbar", "anga", "ungwe"],
    ["thúle", "formen", "harma", "hwesta"],
    ["anto", "ampa", "anca", "unque"],
    ["númen", "malta", "noldo", "ñwalme"],
    ["óre", "vala", "anna", "wilya"],
    ["rómen", "arda", "lambe", "alda"],
    ["silme", "silme-nuquerna", "esse", "esse-nuquerna"],
    ["hyarmen", "hwesta-sindarinwa", "yanta", "úre"],
    ["halla", "telco", "ára", "osse"],
    ["thúletinco", "formenparma", "harmacalma", "hwestaquesse"],
    ["antoando", "ampaumbar", "ancaanga", "unqueungwe"]
];

exports.tehtarAbove = [
    "a", "e", "i", "o", "u",
    "á", "é", "í", "ó", "ú",
    "w",
    "y-english", "y-sindarin",
];

exports.tehtarBelow = [
    "y-quenya",
    "s", "o-below", "i-below",
];

exports.tehtarFollowing = [
    "s-final", "s-inverse", "s-extended", "s-flourish"
];

exports.barsAndTildes = [
    "tilde-above",
    "tilde-below",
    "tilde-high-above",
    "tilde-far-below",
    "bar-above",
    "bar-below",
    "bar-high-above",
    "bar-far-below"
];

exports.tehtar = [].concat(
    exports.tehtarAbove,
    exports.tehtarBelow,
    exports.tehtarFollowing,
    exports.barsAndTildes
);

exports.aliases = {
    "vilya": "wilya",
    "aha": "harma",
    "gasdil": "halla"
};

