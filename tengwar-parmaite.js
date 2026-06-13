"use strict";

var Bindings = require("./dan-smith");
var createFontTranscriber = require("./font-transcriber");

var tengwar = exports.tengwar = {
    ...Bindings.tengwar,
    "open-paren": "=",
    "close-paren": "=",
};
var tehtar = exports.tehtar = Bindings.tehtar;

var positions = exports.positions = {

    "tinco": 2,
    "parma": 2,
    "calma": {
        "y-quenya": 1,
        "o-below": 1,
        "others": 2
    },
    "quesse": {
        "y-quenya": 1,
        "o-below": 1,
        "others": 2
    },

    "ando": {
        "wide": true,
        "others": 0
    },
    "umbar": {
        "wide": true,
        "others": 0
    },
    "anga": {
        "wide": true,
        "others": 0
    },
    "ungwe": {
        "wide": true,
        "others": 0
    },

    "thule": {
        "a": 3,
        "w": 3,
        "y-sindarin": 3,
        "others": 2
    },
    "formen": {
        "a": 3,
        "w": 3,
        "í": 3,
        "y-sindarin": 3,
        "others": 2
    },
    "harma": {
        "a": 0,
        "e": 0,
        "w": 0,
        "í": 0,
        "y-sindarin": 0,
        "others": 1
    },
    "hwesta": {
        "a": 0,
        "e": 0,
        "w": 0,
        "y-sindarin": 0,
        "others": 1
    },

    "anto": {
        "wide": true,
        "others": 0
    },
    "ampa": {
        "wide": true,
        "others": 0
    },
    "anca": {
        "wide": true,
        "others": 0
    },
    "unque": {
        "wide": true,
        "others": 0
    },

    "numen": {
        "wide": true,
        "others": 0
    },
    "malta": {
        "wide": true,
        "others": 0
    },
    "noldo": {
        "wide": true,
        "others": 0
    },
    "nwalme": {
        "wide": true,
        "others": 0
    },

    "ore": {
        "a": 1,
        "e": 2,
        "i": 1,
        "o": 2,
        "u": 3,
        "others": 1
    },
    "vala": {
        "a": 1,
        "e": 2,
        "i": 2,
        "o": 2,
        "w": 1,
        "y-quenya": 1,
        "y-sindarin": 2,
        "y-english": 2,
        "í": 2,
        "i-below": 1,
        "others": 3
    },
    "anna": {
        "a": 1,
        "w": 3,
        "others": 2
    },
    "wilya": {
        "i": 2,
        "í": 2,
        "y-english": 2,
        "y-sindarin": 2,
        "others": 1
    },

    "romen": {
        "a": 1,
        "e": 1,
        "i": 2,
        "o": 1,
        "u": 1,
        "y-quenya": 3,
        "o-below": null,
        "i-below": 3,
        "others": 1
    },
    "arda": {
        "a": 1,
        "e": 1,
        "i": 2,
        "o": 1,
        "u": 1,
        "w": 1,
        "í": 2,
        "y-quenya": 3,
        "y-sindarin": 2,
        "y-english": 2,
        "o-below": null,
        "i-below": 3,
        "others": 0
    },
    "lambe": {
        "wide": true,
        "e": 1,
        "y-quenya": 4,
        "w": 0,
        "o-below": null,
        "i-below": 4,
        "others": 0
    },
    "alda": {
        "wide": true,
        "w": 0,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },

    "silme": {
        "y-quenya": 2,
        "o-below": 2,
        "i-below": 2,
        "others": null
    },
    "silme-nuquerna": {
        "e": 2,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },
    "esse": {
        "others": null
    },
    "esse-nuquerna": {
        "e": 2,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },

    "hyarmen": {
        "y-quenya": 1,
        "o-below": 1,
        "i-below": 1,
        "others": 3
    },
    "hwesta-sindarinwa": {
        "w": 1,
        "y-quenya": 1,
        "o-below": 1,
        "i-below": 1,
        "others": 0
    },
    "yanta": {
        "a": 1,
        "others": 2
    },
    "ure": {
        "a": 1,
        "others": 2
    },

    "halla": {
        "i-below": 3,
        "o-below": 3,
        "others": null
    },
    "short-carrier": {
        "y-quenya": null,
        "others": 3
    },
    "long-carrier": {
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 3
    },
    "round-carrier": 2,

    "thuletinco": {
        "a": 3,
        "w": 3,
        "y-quenya": 3,
        "y-sindarin": 3,
        "í": 3,
        "o-below": 3,
        "others": 2
    },
    "formenparma": {
        "a": 3,
        "w": 3,
        "y-quenya": 3,
        "y-sindarin": 3,
        "í": 3,
        "o-below": 3,
        "others": 2
    },
    "harmacalma": {
        "i": 1,
        "w": 1,
        "y-quenya": 0,
        "í": 0,
        "i-below": 1,
        "o-below": 1,
        "others": 0
    },
    "hwestaquesse": {
        "i": 1,
        "w": 1,
        "y-quenya": 0,
        "í": 0,
        "i-below": 1,
        "o-below": 1,
        "others": 0
    },

    "antoando": {
        "wide": true,
        "others": 0
    },
    "ampaumbar": {
        "wide": true,
        "others": 0
    },
    "ancaanga": {
        "wide": true,
        "others": 0
    },
    "unqueungwe": {
        "wide": true,
        "others": 0
    }

};

// Parmaite uses longVowels check and null as tehta fallback
var transcriber = createFontTranscriber(exports, {
    longVowels: "áéóú",
    tehtaFallback: null
});

exports.transcribe = transcriber.transcribe;
exports.transcribeColumn = transcriber.transcribeColumn;
exports.tehtaForTengwa = transcriber.tehtaForTengwa;
exports.makeColumn = transcriber.makeColumn;
