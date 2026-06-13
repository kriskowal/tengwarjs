"use strict";

var Bindings = require("./dan-smith");
var createFontTranscriber = require("./font-transcriber");

var tengwar = exports.tengwar = {
    ...Bindings.tengwar,
    "open-paren": "Œ", // alt "&#140;",
    "close-paren": "œ", // alt "&#156;",
};
var tehtar = exports.tehtar = Bindings.tehtar;

// The malta in tengwar annatar has a slightly upward curl on the baseline that
// prevents it from combining gracefully with the final sa-rince.
tehtar["s-final"].malta = null;

var positions = exports.positions = {

    "tinco": {
        "o": 3,
        "w": 3,
        "others": 2
    },
    "parma": {
        "o": 3,
        "w": 3,
        "others": 2
    },
    "calma": {
        "o": 3,
        "w": 3,
        "u": 3,
        "o-below": 1,
        "others": 2
    },
    "quesse": {
        "o": 3,
        "w": 3,
        "o-below": 1,
        "others": 2
    },

    "ando": {
        "wide": true,
        "e": 1,
        "o": 2,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "umbar": {
        "wide": true,
        "e": 1,
        "o": 2,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "anga": {
        "wide": true,
        "e": 1,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "ungwe": {
        "wide": true,
        "e": 1,
        "o": 1,
        "ó": 1,
        "ú": 1,
        "others": 0
    },

    "thule": {
        "others": 3
    },
    "formen": 3,
    "harma": {
        "e": 0,
        "o": 3,
        "u": 7,
        "ó": 2,
        "ú": 2,
        "w": 0,
        "others": 1
    },
    "hwesta": {
        "e": 0,
        "o": 3,
        "u": 7,
        "w": 0,
        "others": 1
    },

    "anto": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "ampa": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "anca": {
        "wide": true,
        "u": 7,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "unque": {
        "wide": true,
        "u": 7,
        "others": 0
    },

    "numen": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "malta": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "noldo": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "nwalme": {
        "wide": true,
        "ó": 1,
        "ú": 1,
        "others": 0
    },

    "ore": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "others": 1
    },
    "vala": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "others": 1
    },
    "anna": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 2,
        "ú": 2,
        "others": 1
    },
    "wilya": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "others": 1
    },

    "romen": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 2,
        "ú": 2,
        "y-quenya": 3,
        "o-below": null,
        "i-below": 3,
        "others": 1
    },
    "arda": {
        "a": 1,
        "e": 3,
        "i": 1,
        "o": 3,
        "u": 3,
        "í": 1,
        "ó": 2,
        "ú": 2,
        "y-quenya": 3,
        "o-below": null,
        "i-below": 3,
        "others": 0
    },
    "lambe": {
        "wide": true,
        "e": 1,
        "y-quenya": 4,
        "ó": 1,
        "ú": 1,
        "o-below": null,
        "i-below": 4,
        "others": 0
    },
    "alda": {
        "wide": true,
        "o-below": null,
        "others": 1
    },

    "silme": {
        "y-quenya": 3,
        "o-below": 2,
        "i-below": 2,
        "others": null
    },
    "silme-nuquerna": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 1
    },
    "esse": {
        "y-quenya": null,
        "others": null
    },
    "esse-nuquerna": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "others": 1
    },

    "hyarmen": 3,
    "hwesta-sindarinwa": {
        "o": 2,
        "u": 2,
        "ó": 1,
        "ú": 2,
        "others": 0
    },
    "yanta": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 2,
        "ú": 2,
        "others": 1
    },
    "ure": {
        "e": 3,
        "o": 3,
        "u": 3,
        "ó": 3,
        "ú": 3,
        "others": 1
    },

    // should not occur:
    "halla": {
        "i-below": 3,
        "others": null
    },
    "short-carrier": 3,
    "long-carrier": {
        "y-quenya": null,
        "o-below": null,
        "i-below": null,
        "others": 3
    },
    "round-carrier": 3,

    "thuletinco": 3,
    "formenparma": 3,
    "harmacalma": {
        "o": 3,
        "u": 7,
        "ó": 2,
        "ú": 2,
        "others": 1
    },
    "hwestaquesse": {
        "o": 0,
        "u": 7,
        "others": 1
    },

    "antoando": {
        "wide": true,
        "e": 1,
        "o": 2,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "ampaumbar": {
        "wide": true,
        "e": 1,
        "o": 2,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "ancaanga": {
        "wide": true,
        "e": 1,
        "ó": 1,
        "ú": 1,
        "others": 0
    },
    "unqueungwe": {
        "wide": true,
        "e": 1,
        "o": 1,
        "ó": 1,
        "ú": 1,
        "others": 0
    }
};

// Annatar has no longVowels check and uses "" as tehta fallback
var transcriber = createFontTranscriber(exports, {
    longVowels: "",
    tehtaFallback: ""
});

exports.transcribe = transcriber.transcribe;
exports.transcribeColumn = transcriber.transcribeColumn;
exports.tehtaForTengwa = transcriber.tehtaForTengwa;
exports.makeColumn = transcriber.makeColumn;
