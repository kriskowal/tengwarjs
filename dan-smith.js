"use strict";

exports.tengwar = {
    // 1
    "tinco": "1", // t
    "parma": "q", // p
    "calma": "a", // c
    "quesse": "z", // qu
    // 2
    "ando" : "2", // nd
    "umbar": "w", // mb
    "anga" : "s", // ng
    "ungwe": "x", // ngw
    // 3
    "thúle" : "3", // th
    "formen": "e", // ph / f
    "harma" : "d", // h / ch
    "hwesta": "c", // hw / chw
    // 4
    "anto" : "4", // nt
    "ampa" : "r", // mp
    "anca" : "f", // nc
    "unque": "v", // nqu
    // 5
    "númen" : "5", // n
    "malta" : "t", // m
    "noldo" : "g", // ng
    "ñwalme": "b", // ngw / nw
    // 6
    "óre"  : "6", // r
    "vala" : "y", // v
    "anna" : "h", // -
    "wilya": "n", // w / v
    // 7
    "rómen": "7", // medial r
    "arda" : "u", // rd / rh
    "lambe": "j", // l
    "alda" : "m", // ld / lh
    // 8
    "silme":          "8", // s
    "silme-nuquerna": "i", // s
    "esse":           "k", // z
    "esse-nuquerna":  ",", // z
    // 9
    "hyarmen":           "9", // hyarmen
    "hwesta-sindarinwa": "o", // hwesta sindarinwa
    "yanta":             "l", // yanta
    "úre":               ".", // úre
    // 10
    "halla": "½", // halla
    "telco": "`",
    "ára": "~",
    "osse": "]",
    // I
    "thúletinco": "!",
    "formenparma": "Q",
    "harmacalma": "A",
    "hwestaquesse": "Z",
    "antoando": "@",
    "ampaumbar": "W",
    "ancaanga": "S",
    "unqueungwe": "X",
    // punctuation
    "colon": "ˆ",
    "apostrophe": "²",
    "hyphen": "¬",
    "semi-colon": "Â",
    "comma": "=",
    "full-stop": "-",
    "exclamation-point": "Á",
    "question-mark": "À",
    "open-bracket": "›",
    "close-bracket": "›",
    // open-paren and close-paren vary by font.
    "flourish-left": "Ğ",
    "flourish-right": "ğ",
    // numbers
    "0":  "ð",
    "1":  "ñ",
    "2":  "ò",
    "3":  "ó",
    "4":  "ô",
    "5":  "õ",
    "6":  "ö",
    "7":  "÷",
    "8":  "ø",
    "9":  "ù",
    "10": "ú",
    "11": "û"
};

exports.tehtar = {
    "a": "#EDC",
    "e": "$RFV",
    "i": "%TGB",
    "o": "^YHN",
    "u": [
        "&",
        "U",
        "J",
        "M",
        "Ā", // backward hooks, from the alt font to the custom font
        "ā",
        "Ă",
        "ă"
    ],
    //"á": "",
    "ó": [
        "Ą",
        "ą",
        "Ć",
        "ć"
    ],
    "ú": [
        "Ĉ",
        "ĉ",
        "Ċ",
        "ċ"
    ],
    "í": [
        "Ô",
        "Õ",
        "Ö",
        "×"
    ],
    "w": "èéêë", // TODO custom hooks for tengwar parmaite from the alternate font
    "y-english": "ØÙÚÛ",
    "y-sindarin": "ÔÕÖ×",
    "y-quenya": "ÌÍÎÏ´",
    "o-below": [
        "ä",
        "å",
        "æ",
        "ç",
        "|"
    ],
    "i-below": [
        "È",
        "É",
        "Ê",
        "Ë",
        "L"
    ],
    "s": {
        "special": true,
        "calma": "|",
        "quesse": "|",
        "telco": "}"
    },
    "s-final": {
        "special": true,
        "tinco": "+",
        "ando": "+",
        "númen": "+",
        "malta": "+",
        "lambe": "_"
    },
    "s-inverse": {
        "special": true,
        "tinco": "¡"
    },
    "s-extended": {
        "special": true,
        "tinco": "Ç"
    },
    "s-flourish": {
        "special": true,
        "tinco": "£",
        "lambe": "¥"
    },
    "tilde-above": "Pp",
    "tilde-below": [
        ":",
        ";",
        "°"
    ],
    "tilde-high-above": ")0",
    "tilde-far-below": "?/",
    "bar-above": "{[",
    "bar-below": [
        '"',
        "'",
        "ç" // cedilla
    ],
    "bar-high-above": "ìî",
    "bar-far-below": "íï"
};

