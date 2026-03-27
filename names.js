"use strict";

// At present, this data has not been audited, validated, normalized or used in
// any way.
// It has been constructed ad hoc from:
// http://at.mansbjorkman.net/teng_names.htm

// In general the structure is:
// Object<name:String, classical:Description>
// Description: {
//     phone: String, // phonetic transliteration description in context (late Classical as the root)
//     render: String, // normal transliteration
//     meaning: String, // meaning in English HTML
//     explain: String, // explanation in English for any or all other properties
//     y: "above" | "below" | null, // intrinsic double dot position
//     yed: String, // name of corresponding tengwa without the y
//     gondor: Description, // overriding description for the mode of Gondor
//     ace: Description, // overriding description for the mode described in ACE
//     original: Description, // overriding description for the early Classical mode
//     beleriand: Description, // overriding description for the mode of Beleriand
// }

module.exports = {

    tinco: {
        phone: "t",
        meaning: "metal",
        gondor: {
            name: "tó"
        }
    },
    parma: {
        phone: "p",
        meaning: "book",
        gondor: {
            name: "pí"
        }
    },
    calma: {
        phone: "c/k",
        meaning: "lamp",
        render: "c",
        gondor: {
            name: "ché"
        }
    },
    quesse: {
        phone: "qu/kw",
        meaning: "feather",
        gondor: {
            name: "cá"
        }
    },

    ando: {
        phone: "nd",
        meaning: "gate",
        gondor: {
            name: "dó"
        }
    },
    umbar: {
        phone: "mb",
        meaning: "fate",
        ace: {
            name: "ampano",
            meaning: "building",
            phone: "mp"
        },
        gondor: {
            name: "bí"
        }
    },
    anga: {
        phone: "ng",
        meaning: "iron",
        ace: {
            name: "ancale",
            meaning: "sun",
            phone: "nc"
        },
        gondor: {
            name: "jé"
        }
    },
    ungwe: {
        phone: "ngw",
        meaning: "spider’s web",
        ace: {
            name: "anquale",
            meaning: "agony",
            phone: "nqu"
        },
        gondor: {
            name: "gá"
        }
    },

    thúle: {
        name: "thúle",
        phone: "th",
        meaning: "spirit",
        alt: {
            name: "súle",
            phone: "s"
        },
        ace: {
            name: "silmë",
            phone: "th",
            meaning: "silver light"
        },
        gondor: {
            name: "thó"
        }
    },
    formen: {
        name: "formen",
        meaning: "north",
        phone: "f",
        ace: {
            name: "finwë"
        },
        gondor: {
            name: "fí"
        }
    },
    aha: {
        name: "aha",
        meaning: "rage",
        phone: "h",
        alt: {
            name: "harma",
            meaning: "treasure",
            explain: "replaced aha in later Quenya"
        },
        ace: {
            name: "híse",
            meaning: "mist"
        },
        gondor: {
            name: "shé"
        }
    },
    hwesta: {
        meaning: "breeze",
        phone: "hw",
        gondor: {
            name: "aha / oha",
            explain: "Jim Allen / R Stencel"

        }
    },

    anto: {
        meaning: "mouth",
        phone: "nt",
        ace: {
            name: "asto",
            meaning: "dust",
            phone: "st"
        },
        gondor: {
            name: "adho"
        }
    },
    ampa: {
        meaning: "hook",
        phone: "mp",
        gondor: {
            phone: "v",
            name: "ivi"
        }
    },
    anca: {
        meaning: "jaws",
        phone: "nc",
        ace: {
            name: "ohta",
            meaning: "war",
            phone: "ht"
        },
        gondor: {
            name: "izhe"
        }
    },
    unque: {
        meaning: "a hollow",
        phone: "nqu",
        ace: {
            name: "usque",
            meaning: "reek",
            phone: "squ"
        },
        gondor: {
            name: "agha"
        }
    },

    númen: {
        name: "númen",
        meaning: "west",
        phone: "n",
        gondor: {
            name: "nó"
        }
    },
    malta: {
        meaning: "gold",
        phone: "m",
        ace: {
            name: "umbar",
            meaning: "fate",
            phone: "mb"
        },
        gondor: {
            name: "mí"
        }
    },
    noldo: {
        meaning: "deep-elf",
        phone: "ñ/ŋ",
        alt: {
            name: "ñoldo",
            explain: "<i>ñ</i> eventually merged with <i>n</i>"
        },
        ace: {
            name: "anga",
            meaning: "iron",
            phone: "ng"
        },
        gondor: {
            name: "nyé"
        }
    },
    ñwalme: {
        meaning: "torment",
        phone: "nw",
        original: {
            phone: "ñw/ŋw-"
        },
        ace: {
            name: "ungwe",
            meaning: "gloom",
            phone: "ngw"
        },
        gondor: {
            name: "ngá"
        }
    },

    óre: {
        name: "óre",
        meaning: "heart (inner mind)",
        phone: "-r-",
        explain: "weak, medial <i>r</i>",
        ace: {
            name: "númen",
            meaning: "west",
            phone: "n"
        },
        gondor: {
            name: "ar"
        }
    },
    vala: {
        name: "angelic power",
        phone: "v",
        ace: {
            name: "manwë",
            phone: "m"
        },
        gondor: {
            name: "wí"
        }
    },
    anna: {
        meaning: "gift",
        phone: "-",
        explain: "absent consonant",
        ace: {
            name: "ñolwe",
            meaning: "wisdom",
            phone: "ñ/ŋ"
        },
        gondor: {
            name: "yé"
        }
    },
    vilya: {
        meaning: "sky",
        phone: "v/-w-",
        explain: "probably used for <i>v/w</i>, but may also represent medial <i>w</i>",
        original: {
            name: "wilya",
        },
        ace: {
            name: "wingë",
            meaning: "foam",
            eventually: {
                name: "vingë"
            }
        },
        gondor: {
            name: "’á"
        }
    },

    rómen: {
        name: "rómen",
        meaning: "east",
        phone: "r",
        ace: {
            name: "rana",
            meaning: "moon"
        },
        gondor: {
            name: "aro"
        }
    },
    arda: {
        meaning: "region",
        phone: "rd",
        gondor: {
            name: "rhó"
        }
    },
    lambe: {
        meaning: "tongue (language)",
        phone: "l",
        ace: {
            name: "lamba"
        },
        gondor: {
            name: "alo"
        }
    },
    alda: {
        meaning: "tree",
        phone: "ld",
        gondor: {
            name: "lhó"
        }
    },

    silme: {
        name: "silmë",
        meaning: "light",
        phone: "s",
        ace: {
            name: "silpion"
        },
        gondor: {
            name: "só"
        }
    },
    "silme-nuquerna": {
        name: "silmë nuquerna",
        meaning: "<i>silmë</i> reversed",
        phone: "s",
        ace: {
            name: "roma",
            meaning: "horn",
            phone: "r"
        },
        gondor: {
            name: "ós"
        }
    },
    esse: {
        meaning: "name",
        phone: "z",
        changedFrom: {
            name: "áre",
            developedFrom: {
                name: "áze"
            }
        },
        gondor: {
            name: "azo"
        }
    },
    "esse-nuqeurna": {
        meaning: "<i>essë</i> reversed",
        phone: "z",
        changedFrom: {
            name: "áre nuquerna",
            meaning: "<i>áre</i> reversed",
            developedFrom: {
                name: "áze nuquerna",
                meaning: "<i>áze</i> reversed"
            }
        },
        gondor: {
            name: "oza"
        }
    },

    hyarmen: {
        meaning: "south",
        phone: "hy/h",
        developedFrom: {
            phone: "hy"
        },
        ace: {
            name: "hyalma",
            meaning: "shell"
        },
        gondor: {
            name: "há"
        }
    },
    "hwesta-sindarinwa": {
        meaning: "grey-elven <i>hwesta</i>",
        phone: "hw",
        ace: {
            name: "hwindë",
            meaning: "eddy"
        },
        gondor: {
            name: "whí"
        }
    },
    yanta: {
        meaning: "bridge",
        phone: "y",
        explain: "consonantal <i>i</i>",
        ace: {
            name: "yatta",
            meaning: "isthmus"
        },
        gondor: {
            name: "ai"
        }
    },
    úre: {
        name: "úre",
        phone: "u",
        meaning: "heat",
        gondor: {
            name: "au"
        }
    },

    halla: {
        meaning: "tall",
        phone: "h",
        beleriand: {
            phone: "-",
            explain: "a hiatus caused by a lenited (reduced to silent) <i>g</i>, called a “gasdil” stopgap"
        }
    },
    vaia: {
        ace: {
            meaning: "envelope",
            phone: "v",
            explain: "presumed to be pronounced <i>v</i>",
            developedFrom: {
                name: "waia",
                phone: "w",
                explain: "presumed to be pronounced <i>w</i>",
            }
        }
    },

    tyelpe: {
        yed: "tinco",
        y: "above",
        meaning: "silver",
        phone: "ty"
    },
    indyo: {
        yed: "ando",
        y: "above",
        meaning: "grandson",
        phone: "ndy"
    },
    istyar: {
        yed: "thúle",
        y: "below",
        meaning: "wizard, lore-master",
        phone: "sty"
    },
    intya: {
        yed: "anto",
        y: "below",
        meaning: "guess, notion",
        phone: "nty",
        ace: {
            name: "istyar",
            y: "above",
            meaning: "scholar, learnèd-man",
            phone: "sty"
        }
    },
    ehtyar: {
        ace: {
            yed: "anca",
            y: "above",
            meaning: "spearman",
            phone: "hty",
            explain: "Note that this character, unlike all others in the series, is based on a tengwa of the velar <i>calmatéma</i> rather than the dental <i>tincotéma</i>"
        }
    },
    nyelle: {
        yed: "númen",
        y: "above",
        meaning: "bell",
        phone: "ny",
        ace: {
            name: "indyo",
            phone: "ndy",
            meaning: "grandchild, descendant"
        }
    },
    arya: {
        yed: "óre/rómen",
        y: "above",
        meaning: "day",
        ace: {
            name: "nyelle",
            yed: "óre",
            y: "above",
            meaning: "bell"
        }
    },
    alya: {
        yed: "lambe",
        y: "above",
        meaning: "rich",
        phone: "ly"
    },

    telco: {
        meaning: "leg",
        phone: "-",
        explain: "carrier for short vowels"
    },
    ara: {
        meaning: "dawn",
        phone: "á",
        explain: "carrier for long vowels, implicitly <i>á</i> when carrying nothing"
    },
    ire: {
        ied: "ara",
        phone: "í",
        explain: "alternate name for ara when carrying a long <i>i</i>"
    },
    anar: {
        explain: "alternate name for telco when carrying nothing",
        phone: "a"
    },
    elwe: {
        meaning: "the name of one <i>elda</i>",
        explain: "alternate name for telco when carrying nothing",
        phone: "e"
    },
    ingwe: {
        meaning: "the name of one <i>elda</i>",
        explain: "alternate name for telco when carrying short <i>i</i>",
        phone: "i"
    },
    osse: {
        meaning: "terror",
        explain: "The name is associated with a mode where the tengwa stands for <i>o</i>",
        beleriand: {
            phone: "a"
        }
    },

    e: {
        name: "tecco",
        meaning: "stroke"
    },
    i: {
        name: "amatixë",
        meaning: "over-dot"
    },
    "i-below": {
        name: "unutixë",
        meaning: "under-dot"
    },
    s: {
        name: "sa rincë",
        meaning: "s-flourish",
        noldor: {
            name: "gammas",
            meaning: "s-hook"
        }
    },
    "?": {
        name: "thinnas",
        meaning: "shortness"
    }

};

