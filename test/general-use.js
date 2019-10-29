
module.exports = {

    parmaite: {

        any: {
            // punctuation
            "()": "open-paren;close-paren",
            "[]": "open-bracket;close-bracket",
            ",:.": "comma;colon;full-stop",
            "-": "hyphen",
            "'": "apostrophe",
        },

    },

    annatar: {

        any: {

            // punctuation
            "()": "open-paren;close-paren",
            "[]": "open-bracket;close-bracket",
            ",:.": "comma;colon;full-stop",
            "-": "hyphen",
            "'": "apostrophe",

            // Regression test for #9
            "vs.": "ampa;silme;full-stop",

            // interesting clusters
            "Alyssa": "lambe:a;silme-nuquerna:y-sindarin,tilde-below;short-carrier:a",
            "allys": "lambe:a,tilde-below;silme-nuquerna:y-sindarin",
            "iqs": "quesse:i,s",
            "ls": "lambe:s-final",
            "ls`": "lambe:s-flourish",
            "tsts": "tinco;silme;tinco:s-final",
            "xx": "quesse:s;quesse:s",

            // long vowels
            "á": "anna:a",
            "aa": "anna:a",
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
            "Alyssa": "lambe:a;silme-nuquerna:y-english,tilde-below;short-carrier:a",
            "Jack": "anga;quesse:a,tilde-below",
            "cake": "quesse;quesse:a,i-below",
            "cakes": "quesse;quesse:a;silme-nuquerna:e",
            "cats.": "quesse;tinco:a,s-final;full-stop", // regression
            "finwe": "formen;short-carrier:i;numen:w,i-below", // invalid input
            "finwë": "formen;short-carrier:i;numen:w;short-carrier:e",
            "font": "formen;tinco:o,tilde-above",
            "green": "ungwe;romen;short-carrier:e;numen:e",
            "happy": "hyarmen;parma:a,tilde-below;short-carrier:y-english",
            "helcaraxe": "hyarmen;lambe:e;quesse;romen:a;quesse:a,s;short-carrier:i-below", // invalid input
            "helcaraxë": "hyarmen;lambe:e;quesse;romen:a;quesse:a,s;short-carrier:e",
            "hobbits": "hyarmen;umbar:o,tilde-below;tinco:i,s-final",
            "hobbits`": "hyarmen;umbar:o,tilde-below;tinco:i,s-inverse",
            "hobbits``": "hyarmen;umbar:o,tilde-below;tinco:i,s-extended",
            "hobbits```": "hyarmen;umbar:o,tilde-below;tinco:i,s-flourish",
            "onyx": "numen:o;quesse:y-english,s",
            "phone": "formenparma;numen:o,i-below",
            "style": "silme;tinco:y-english;lambe:i-below",
            "these": "thule;silme-nuquerna:e;short-carrier:i-below",
            "these`": "thule;silme-nuquerna:e;short-carrier:e", // invalid input
            "yellow": "anna;lambe:e,tilde-below;vala:o",
            "yes": "anna;silme-nuquerna:e",

            // for code coverage
            "ie": "yanta:i",
            "oe": "yanta:o",
            "x": "quesse:s",
            "y": "anna",
            "yippy": "anna;parma:i,tilde-below;short-carrier:y-english",

            // abbreviated words
            "of": "ampaumbar",
            "the": "antoando",
            "of the": "ampaumbar:tilde-below",
            "of`the": "ampaumbar antoando",
            "and": "ando:tilde-above",
            "and`": "ando:i-below,tilde-above"

        },

        oldEnglish: {
            "írensaga": "long-carrier:i;romen;numen:e;silme;ungwe:a;short-carrier:a"
        },

        sindarin: {
            // King's Letter
            "Elessar Telcontar: Aragorn Arathornion Edhelharn, aran Gondor ar Hîr i Mbair Annui, anglennatha i Varanduiniant erin dolothen Ethuil, egor ben genediad Drannail erin Gwirith edwen.":
                "lambe:e;silme-nuquerna:e,tilde-below;ore:a " +
                "tinco;lambe:e;quesse;tinco:o,tilde-above;ore:a;colon " +
                "romen:a;ungwe:a;romen:o;numen " +
                "romen:a;thule:a;romen:o;numen;short-carrier:i;numen:o " +
                "anto:e;alda:e;romen:a;numen;comma romen:a;numen:a " +
                "ungwe;ando:o,tilde-above;ore:o ore:a hyarmen;long-carrier:i;ore short-carrier:i " +
                "umbar:tilde-above;anna:a;ore numen:a,tilde-above;anna:u;comma " +
                "ungwe:a,tilde-above;lambe;numen:e,tilde-above;thule:a;short-carrier:a " +
                "short-carrier:i " +
                "ampa;romen:a;ando:a,tilde-above;anna:u;numen;short-carrier:i;tinco:a,tilde-above " +
                "romen:e;numen:i ando;lambe:o;thule:o;numen:e thule:e;anna:u;lambe;comma " +
                "ungwe:e;ore:o umbar;numen:e ungwe;numen:e;ando:e;short-carrier:i;ando:a " +
                "ando;romen;numen:a,tilde-above;anna:a;lambe romen:e;numen:i " +
                "ungwe:w;romen:i;thule:i ando:e;vala;numen:e;full-stop",

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
            "hír": "hyarmen;long-carrier:i;ore",
            "hîr": "hyarmen;long-carrier:i;ore",
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
            "tyelpe": "tinco:y-sindarin;lambe:e;parma;short-carrier:e",
            "varda": "ampa;romen:a;ando;short-carrier:a",
            "y": "short-carrier:y-sindarin",
            "á": "anna:a",
            "ñoldor": "nwalme;lambe:o;ando;ore:o",
        },

        blackSpeech: {
            // in order of appearance in the ring poem
            "ash": "harmacalma:a",
            "nazg": "numen;esse-nuquerna:a;ungwe",
            "durbatulûk": "ando;ore:o;umbar;tinco:a;lambe:o;quesse:ó", // swap o and u, medial ore before consonant
            "gimbatul": "ungwe;umbar:i,tilde-above;tinco:a;lambe:o",
            "thrakatulûk": "thule;romen;quesse:a;tinco:a;lambe:o;quesse:ó",
            "agh": "unqueungwe:a",
            "burzumishi": "umbar;ore:o;esse;malta:o;harmacalma:i;short-carrier:i",
            "krimpatul": "quesse;romen;parma:i,tilde-above;tinco:a;lambe:o",
        },

    },

};
