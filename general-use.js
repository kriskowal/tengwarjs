
var Render = require("./render");
var makeColumn = require("./column");

// TODO rewrite using the parser technique from classical.js

exports.transcribe = transcribe;
function transcribe(text) {
    return Render.transcribe(parse(text));
}

exports.encode = encode;
function encode(text) {
    return Render.encode(parse(text));
}

exports.parse = parse;
function parse(latin) {
    latin = latin.replace(/[,:] +/g, ",");
    return latin.split(/\n\n\n+/).map(function (section) {
        return section.split(/\n\n/).map(function (paragraph) {
            return paragraph.split(/\n/).map(function (line) {
                return line.split(/\s+/).map(function (word) {
                    var columns = []
                    word.replace(/([\wáéíóúÁÉÍÓÚëËâêîôûÂÊÎÔÛ']+)|(\W+)/g, function ($, word, others) {
                        try {
                            columns.push.apply(columns, parseWord(word || others));
                        } catch (x) {
                            console.log(parseWord(word || others), word || others);
                        }
                    });
                    return columns;
                });
            });
        });
    });
}

function parseWord(latin) {
    latin = latin
    .toLowerCase()
    .replace(substitutionsRe, function ($, key) {
        return Render.decode(Mode.substitutions[key]);
    });
    if (Mode.words[latin])
        return Render.decode(Mode.words[latin]);
    var columns = [];
    var length;
    var first = true;
    var maybeFinal;
    while (latin.length) {
        if (latin[0] != "s")
            maybeFinal = undefined;
        length = latin.length;
        latin = latin
        .replace(transcriptionsRe, function ($, vowel, tengwa, w, y, s, prime) {
            //console.log(latin, [vowel, tengwa, w, y, s]);
            w = w || ""; s = s || ""; y = y || "";
            var value = Mode.transcriptions[tengwa];
            tengwa = value.split(":")[0];
            var tehtar = value.split(":").slice(1).join(":");
            var voweled = value.split(":").filter(function (term) {
                return Mode.vowelTranscriptions[term];
            }).length;
            if (vowel) {
                if (!voweled) {
                    // flip if necessary
                    if (
                        Render.tehtaForTengwa(tengwa, vowel) === null &&
                        Render.tehtaForTengwa(tengwa + "-nuquerna", vowel) !== null
                    ) {
                        value = [tengwa + "-nuquerna"]
                        .concat(tehtar)
                        .concat([vowel])
                        .filter(function (part) {
                            return part;
                        }).join(":");
                    } else {
                        value += ":" + vowel;
                    }
                } else {
                    columns.push(parseWord(vowel));
                }
                voweled = true;
            }
            if (w && !voweled) {
                value += ":w";
                w = "";
                voweled = true;
            }
            if (y) {
                value += ":y";
                y = "";
            }
            // must go last because it has a non-zero width
            if (s && !w) {
                var length = prime.length;
                var possibilities = [
                    "s",
                    "s-inverse",
                    "s-extended",
                    "s-flourish"
                ].filter(function (tehta) {
                    return Render.tehtaForTengwa(tengwa, tehta);
                });
                while (possibilities.length && length) {
                    possibilities.shift();
                    length--;
                }
                if (possibilities.length) {
                    if (value.split(":").indexOf("quesse") >= 0) {
                        value = value + ":" + possibilities.shift();
                        s = "";
                    } else {
                        maybeFinal = value + ":" + possibilities.shift();
                    }
                }
            }
            columns.push(value);
            first = false;
            return w + y + s;
        });
        if (length === latin.length) {
            length = latin.length;
            latin = latin.replace(vowelTranscriptionsRe, function ($, vowel) {
                var value = Mode.vowelTranscriptions[vowel];
                columns.push(value);
                return "";
            });
            if (length === latin.length) {
                //throw new Error("Can't transcribe " + latin.slice(1));
                if (Mode.punctuation[latin[0]])
                    columns.push(Mode.punctuation[latin[0]]);
                latin = latin.slice(1);
            }
        }
    }
    if (columns.length) {
        if (maybeFinal && columns[columns.length - 1] == "silme") {
            columns.pop();
            columns.pop();
            columns.push(maybeFinal);
        }
        columns.push(columns.pop().replace("romen", "ore"));
    }
    /*
    * failed attempt to distinguish yanta spelling of consonantal i
    * automatically in iant, iaur, and ioreth but not in galadriel,
    * moria
    columns = columns.map(function (part, i) {
        if (i === columns.length - 1)
            return part;
        if (part !== "short-carrier:i")
            return part;
        if (columns[i + 1].split(":").filter(function (term) {
            return term === "a";
        }).length) {
            return "yanta";
        } else {
            return part;
        }
    });
    */
    /*
    // abandoned trick to replace "is" with short-carrier with s hook
    columns = columns.map(function (part, i) {
        //console.log(part);
        if (part === "silme-nuquerna:i")
            return "short-carrier:s";
        return part;
    });
    */
    return Render.decodeWord(columns.join(";"));
}

// king's letter, general use
var Mode = {
    "substitutions": {
        "k": "c",
        "x": "cs",
        "qu": "cw",
        "q": "cw",
        "ë": "e",
        "â": "á",
        "ê": "é",
        "î": "í",
        "ô": "ó",
        "û": "ú"
    },
    "transcriptions": {

        // consonants
        "t": "tinco",
        "nt": "tinco:tilde-above",
        "tt": "tinco:tilde-below",

        "p": "parma",
        "mp": "parma:tilde-above",
        "pp": "parma:tilde-below",

        "ch'": "calma", // ch is palatal fricative, as in bach
        "nch'": "calma:tilde-above",

        "c": "quesse",
        "nc": "quesse:tilde-above",

        "d": "ando",
        "nd": "ando:tilde-above",
        "dd": "ando:tilde-below",

        "b": "umbar",
        "mb": "umbar:tilde-above",
        "bb": "umbar:tilde-below",

        "j": "anca",
        "nj": "anca:tilde-above",

        "g": "ungwe",
        "ng": "ungwe:tilde-above",
        "gg": "ungwe:tilde-below",

        "th": "thule",
        "nth": "thule:tilde-above",

        "f": "formen",
        "ph": "formen",
        "mf": "formen:tilde-above",
        "mph": "formen:tilde-above",

        "sh": "harma",

        "h": "hyarmen",
        "ch": "hwesta",
        "hw": "hwesta-sindarinwa",
        "wh": "hwesta-sindarinwa",

        "gh": "unque",
        "ngh": "unque:tilde-above",

        "dh": "anto",
        "ndh": "anto:tilde-above",

        "v": "ampa",
        "bh": "ampa",
        "mv": "ampa:tilde-above",
        "mbh": "ampa:tilde-above",

        "n": "numen",
        "nn": "numen:tilde-above",

        "m": "malta",
        "mm": "malta:tilde-above",

        "ng": "nwalme",
        "ñ": "nwalme",
        "nwal": "nwalme:w;lambe:a",

        "r": "romen",
        "rr": "romen:tilde-below",
        "rh": "arda",

        "l": "lambe",
        "ll": "lambe:tilde-below",
        "lh": "alda",

        "s": "silme",
        "ss": "silme:tilde-below",

        "z": "esse",

        "á": "wilya:a",
        "é": "long-carrier:e",
        "í": "long-carrier:i",
        "ó": "long-carrier:o",
        "ú": "long-carrier:u",
        "w": "vala",

        "ai": "anna:a",
        "oi": "anna:o",
        "ui": "anna:u",
        "au": "vala:a",
        "eu": "vala:e",
        "iu": "vala:i",
        "ae": "yanta:a",

    },
    "vowelTranscriptions": {

        "a": "short-carrier:a",
        "e": "short-carrier:e",
        "i": "short-carrier:i",
        "o": "short-carrier:o",
        "u": "short-carrier:u",

        "á": "wilya:a",
        "é": "long-carrier:e",
        "í": "long-carrier:i",
        "ó": "short-carrier:ó",
        "ú": "short-carrier:ú",

        "w": "vala",
        "y": "short-carrier:í"

    },

    "words": {
        "iant": "yanta;tinco:tilde-above:a",
        "iaur": "yanta;vala:a;ore",
        "baranduiniant": "umbar;romen:a;ando:tilde-above:a;anna:u;yanta;anto:tilde-above:a",
        "ioreth": "yanta;romen:o;thule:e",
        "noldo": "nwalme;lambe:o;ando;short-carrier:o",
        "noldor": "nwalme;lambe:o;ando;ore:o",
        "is": "short-carrier:i:s"
    },

    "punctuation": {
        "-": "comma",
        ",": "comma",
        ":": "comma",
        ";": "full-stop",
        ".": "full-stop",
        "!": "exclamation-point",
        "?": "question-mark",
        "(": "open-paren",
        ")": "close-paren",
        ">": "flourish-left",
        "<": "flourish-right"
    },

    "annotations": {
        "tinco": {"tengwa": "t"},
        "parma": {"tengwa": "p"},
        "calma": {"tengwa": "c"},
        "quesse": {"tengwa": "c"},
        "ando": {"tengwa": "d"},
        "umbar": {"tengwa": "b"},
        "anga": {"tengwa": "ch"},
        "ungwe": {"tengwa": "g"},
        "thule": {"tengwa": "th"},
        "formen": {"tengwa": "f"},
        "hyarmen": {"tengwa": "h"},
        "hwesta": {"tengwa": "kh"},
        "unque": {"tengwa": "gh"},
        "anto": {"tengwa": "dh"},
        "anca": {"tengwa": "j"},
        "ampa": {"tengwa": "v"},
        "numen": {"tengwa": "n"},
        "malta": {"tengwa": "m"},
        "nwalme": {"tengwa": "ñ"},
        "romen": {"tengwa": "r"},
        "ore": {"tengwa": "-r"},
        "lambe": {"tengwa": "l"},
        "silme": {"tengwa": "s"},
        "silme-nuquerna": {"tengwa": "s"},
        "esse": {"tengwa": "z"},
        "esse-nuquerna": {"tengwa": "z"},
        "harma": {"tengwa": "sh"},
        "alda": {"tengwa": "lh"},
        "arda": {"tengwa": "rh"},
        "wilya": {"tengwa": "a"},
        "vala": {"tengwa": "w"},
        "anna": {"tengwa": "i"},
        "vala": {"tengwa": "w"},
        "yanta": {"tengwa": "e"},
        "hwesta-sindarinwa": {"tengwa": "wh"},
        "s": {"following": "s"},
        "s-inverse": {"following": "s<sub>2</sub>"},
        "s-extended": {"following": "s<sub>3</sub>"},
        "s-flourish": {"following": "s<sub>4</sub>"},
        "long-carrier": {"tengwa": "´"},
        "short-carrier": {},
        "tilde-above": {"above": "nmñ-"},
        "tilde-below": {"below": "2"},
        "a": {"tehta-above": "a"},
        "e": {"tehta-above": "e"},
        "i": {"tehta-above": "i"},
        "o": {"tehta-above": "o"},
        "u": {"tehta-above": "u"},
        "ó": {"tehta-above": "ó"},
        "ú": {"tehta-above": "ú"},
        "í": {"tehta-above": "y"},
        "y": {"tehta-below": "y"},
        "w": {"tehta-above": "w"},
        "full-stop": {"tengwa": "."},
        "exclamation-point": {"tengwa": "!"},
        "question-mark": {"tengwa": "?"},
        "comma": {"tengwa": "-"},
        "open-paren": {"tengwa": "("},
        "close-paren": {"tengwa": ")"},
        "flourish-left": {"tengwa": "“"},
        "flourish-right": {"tengwa": "”"}
    }
};

var transcriptionsRe = new RegExp("^([aeiouóú]?'?)(" +
    Object.keys(Mode.transcriptions).sort(function (a, b) {
        return b.length - a.length;
    }).join("|") +
")(w?)(y?)(s?)('*)", "ig");
var vowelTranscriptionsRe = new RegExp("^(" +
    Object.keys(Mode.vowelTranscriptions).join("|") +
")", "ig");
var substitutionsRe = new RegExp("(" +
    Object.keys(Mode.substitutions).join("|") +
")", "ig");

