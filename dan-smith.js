
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
    "thule" : "3", // th
    "formen": "e", // ph / f
    "harma" : "d", // h / ch
    "hwesta": "c", // hw / chw
    // 4
    "anto" : "4", // nt
    "ampa" : "r", // mp
    "anca" : "f", // nc
    "unque": "v", // nqu
    // 5
    "numen" : "5", // n
    "malta" : "t", // m
    "noldo" : "g", // ng
    "nwalme": "b", // ngw / nw
    // 6
    "ore"  : "6", // r
    "vala" : "y", // v
    "anna" : "h", // -
    "wilya": "n", // w / v
    // 7
    "romen": "7", // medial r
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
    "ure":               ".", // ure
    // 10
    "halla": "½", // halla
    "short-carrier": "`",
    "long-carrier": "~",
    "round-carrier": "]",
    // I
    "tinco-extended": "!",
    "parma-extended": "Q",
    "calma-extended": "A",
    "quesse-extended": "Z",
    "ando-extended": "@",
    "umbar-extended": "W",
    "anga-extended": "S",
    "ungwe-extended": "X",
    // punctuation
    "comma": "=",
    "full-stop": "-",
    "exclamation-point": "Á",
    "question-mark": "À",
    "open-paren": "&#140;",
    "close-paren": "&#156;",
    "flourish-left": "&#286;",
    "flourish-right": "&#287;",
    // numbers
    "0":  "&#240",
    "1":  "&#241",
    "2":  "&#242",
    "3":  "&#243",
    "4":  "&#244",
    "5":  "&#245",
    "6":  "&#246",
    "7":  "&#247",
    "8":  "&#248",
    "9":  "&#249",
    "10": "&#250",
    "11": "&#251"
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
        "&#256;", // backward hooks, from the alt font to the custom font
        "&#257;",
        "&#258;",
        "&#259;"
    ],
    //"á": "",
    "ó": [
        "&#260;",
        "&#261;",
        "&#262;",
        "&#263;"
    ],
    "ú": [
        "&#264;",
        "&#265;",
        "&#266;",
        "&#267;"
    ],
    "í": [
        "&#212;",
        "&#213;",
        "&#214;",
        "&#215;"
    ],
    "w": "èéêë", // TODO custom hooks for tengwar parmaite from the alternate font
    "y": "ÌÍÎÏ´",
    "o-below": [
        "ä",
        "&#229;", // a ring above
        "æ",
        "ç",
        "|"
    ],
    "i-below": [
        "&#200;",
        "&#201;",
        "&#202;",
        "&#203;",
        "&#76"
    ],
    "s": {
        "special": true,
        "calma": "|",
        "quesse": "|",
        "short-carrier": "}"
    },
    "s-final": {
        "special": true,
        "tinco": "+",
        "ando": "+",
        "numen": "+",
        "lambe": "_"
    },
    "s-inverse": {
        "special": true,
        "tinco": "¡"
    },
    "s-extended": {
        "special": true,
        "tinco": "&#199;"
    },
    "s-flourish": {
        "special": true,
        "tinco": "&#163;",
        "lambe": "&#165;"
    },
    "tilde-above": "Pp",
    "tilde-below": [
        ":",
        ";",
        "&#176;"
    ],
    "tilde-high-above": ")0",
    "tilde-far-below": "?/",
    "bar-above": "{[",
    "bar-below": [
        '"',
        "'",
        "&#184;" // cedilla
    ],
    "bar-high-above": "ìî",
    "bar-far-below": "íï"
};

