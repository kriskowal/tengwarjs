
module.exports = {

    any: {

        // interesting clusters
        "xx": "quesse:s;quesse:s",
        "tsts": "tinco;silme;tinco:s-final",
        "iqs": "quesse:i,s",
        "aty": "tinco:a,y",
        "allys": "lambe:a,y,s-final,tilde-below",
        "alyssa": "lambe:a,y;silme:tilde-below;short-carrier:a",
        "ls": "lambe:s-final",
        "ls`": "lambe:s-flourish",

        // long vowels
        "á": "wilya:a",
        "aa": "wilya:a",
        "é": "long-carrier:e",
        "ee": "long-carrier:e",
        "í": "long-carrier:i",
        "ii": "long-carrier:i",
        "ó": "long-carrier:o",
        "oo": "long-carrier:o",
        "ú": "long-carrier:u",
        "uu": "long-carrier:u",

        // final-e modification for non-english
        "cake`": "quesse;quesse:a,i-below",

    },

    english: {

        // english (appropriate mode) (sorted)
        "cake": "quesse;quesse:a,i-below",
        "cakes": "quesse;quesse:a;silme-nuquerna:e",
        "cats.": "quesse;tinco:a,s-final;full-stop", // regression
        "finwe": "formen;short-carrier:i;numen:w,i-below", // invalid input
        "finwë": "formen;short-carrier:i;numen:w;short-carrier:e",
        "font": "formen;tinco:o,tilde-above",
        "green": "ungwe;romen;long-carrier:e;numen",
        "helcaraxe": "hyarmen;lambe:e;quesse;romen:a;quesse:a,s;short-carrier:i-below", // invalid input
        "helcaraxë": "hyarmen;lambe:e;quesse;romen:a;quesse:a,s;short-carrier:e",
        "hobbits": "hyarmen;umbar:o,tilde-below;tinco:i,s-final",
        "hobbits`": "hyarmen;umbar:o,tilde-below;tinco:i,s-inverse",
        "hobbits``": "hyarmen;umbar:o,tilde-below;tinco:i,s-extended",
        "hobbits```": "hyarmen;umbar:o,tilde-below;tinco:i,s-flourish",
        "phone": "parma-extended;numen:o,i-below",
        "there": "thule;romen:e,i-below",
        "these": "thule;silme-nuquerna:e;short-carrier:i-below",
        "these`": "thule;silme-nuquerna:e;short-carrier:e",

        // for code coverage
        "y": "anna",
        "x": "quesse:s",

        // abbreviated words
        "of": "umbar-extended",
        "the": "ando-extended",
        "of the": "umbar-extended:tilde-below",
        "of`the": "umbar-extended ando-extended",
        "and": "ando:tilde-above",
        "and`": "ando:i-below,tilde-above"

    },

    oldEnglish: {
        "írensaga": "long-carrier:i;romen;numen:e;silme;ungwe:a;short-carrier:a"
    },

    sindarin: {
        // (sorted)
        "Aragorn Arathorn:\nTelcontar, Elessar": "romen:a;ungwe:a;romen:o;numen romen:a;thule:a;romen:o;numen;colon\ntinco;lambe:e;quesse;tinco:o,tilde-above;ore:a;comma lambe:e;silme-nuquerna:e,tilde-below;ore:a",
        "ainur": "anna:a;numen;ore:u",
        "aldost": "lambe:a;ando;silme-nuquerna:o;tinco",
        "amon sûl": "malta:a;numen:o silme;lambe:ú",
        "aragorn": "romen:a;ungwe:a;romen:o;numen",
        "atto": "tinco:a,tilde-below;short-carrier:o",
        "barad dûr": "umbar;romen:a;ando:a ando;ore:ú",
        "baranduiniant": "umbar;romen:a;ando:a,tilde-above;anna:u;yanta;anto:a,tilde-above",
        "dagor bragolach": "ando;ungwe:a;ore:o umbar;romen;ungwe:a;lambe:o;hwesta:a",
        "galadhrim": "ungwe;lambe:a;anto:a;romen;malta:i",
        "galadriel": "ungwe;lambe:a;ando:a;romen;yanta:i;lambe",
        "gandalf": "ungwe;ando:a,tilde-above;lambe:a;formen",
        "glorfindel": "ungwe;lambe;romen:o;formen;ando:i,tilde-above;lambe:e",
        "gwaith iaur arnor": "ungwe:w;anna:a;thule yanta;vala:a;ore romen:a;numen;ore:o",
        "gwathló": "ungwe:w;thule:a;lambe;long-carrier:o",
        "hwesta sindarinwa": "hwesta-sindarinwa;silme-nuquerna:e;tinco;short-carrier:a silme;ando:i,tilde-above;romen:a;short-carrier:i;numen:w;short-carrier:a",
        "iant": "yanta;tinco:a,tilde-above",
        "iaur": "yanta;vala:a;ore",
        "isildur": "silme-nuquerna:i;lambe:i;ando;ore:u",
        "lhûn": "alda;numen:ú",
        "lothlórien": "lambe;thule:o;lambe;romen:ó;yanta:i;numen",
        "mae govannen": "malta;yanta:a ungwe;ampa:o;numen:a,tilde-above;numen:e",
        "mellon": "malta;lambe:e,tilde-below;numen:o",
        "mordor": "malta;romen:o;ando;ore:o",
        "moria": "malta;romen:o;short-carrier:i;short-carrier:a",
        "noldor": "nwalme;lambe:o;ando;ore:o",
        "periannath": "parma;romen:e;short-carrier:i;numen:a,tilde-above;thule:a",
        "rhûn": "arda;numen:ú",
        "tyelpe": "tinco:y;lambe:e;parma;short-carrier:e",
        "varda": "ampa;romen:a;ando;short-carrier:a",
        "á": "wilya:a",
        "ñoldor": "nwalme;lambe:o;ando;ore:o",
    },

    blackSpeech: {
        // in order of appearance in the ring poem
        "ash": "calma-extended:a",
        "nazg": "numen;esse-nuquerna:a;ungwe",
        "durbatulûk": "ando;ore:o;umbar;tinco:a;lambe:o;quesse:ó", // swap o and u, medial ore before consonant
        "gimbatul": "ungwe;umbar:i,tilde-above;tinco:a;lambe:o",
        "thrakatulûk": "thule;romen;quesse:a;tinco:a;lambe:o;quesse:ó",
        "agh": "ungwe-extended:a",
        "burzumishi": "umbar;ore:o;esse;malta:o;calma-extended:i;short-carrier:i",
        "krimpatul": "quesse;romen;parma:i,tilde-above;tinco:a;lambe:o"
    },

    quenya: {
        // (improper mode) (sorted)
        "ardalambion": "romen:a;ando;lambe:a;umbar:a,tilde-above;short-carrier:i;numen:o",
        "ëa": "short-carrier:e;short-carrier:a",
        "helcaraxë": "hyarmen;lambe:e;quesse;romen:a;quesse:a,s;short-carrier:e",
        "hyarmen": "hyarmen:y;romen:a;malta;numen:e",
        "istari": "silme-nuquerna:i;tinco;romen:a;short-carrier:i",
        "sinome maruvan": "silme;numen:i;malta:o;short-carrier:e malta;romen:a;ampa:u;numen:a",
        "telperion": "tinco;lambe:e;parma;romen:e;short-carrier:i;numen:o",
        "yuldar": "anna;lambe:u;ando;ore:a",
        "y`uldar": "long-carrier:i;lambe:u;ando;ore:a",
    }

};

