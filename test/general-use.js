
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
            "Alyssa": "lambe:a;silme-nuquerna:y-sindarin,tilde-below;telco:a",
            "allys": "lambe:a,tilde-below;silme-nuquerna:y-sindarin",
            "iqs": "quesse:i,s",
            "ls": "lambe:s-final",
            "ls`": "lambe:s-flourish",
            "tsts": "tinco;silme;tinco:s-final",
            "xx": "quesse:s;quesse:s",

            // long vowels
            "á": "anna:a",
            "aa": "anna:a",
            "é": "ára:e",
            "ee": "ára:e",
            "í": "ára:i",
            "ii": "ára:i",
            "ó": "ára:o",
            "oo": "ára:o",
            "ú": "ára:u",
            "uu": "ára:u",

            // final-e modification for non-english
            "cake`": "quesse;quesse:a,i-below",
        },

        english: {

            // english (appropriate mode) (sorted)
            "Alyssa": "lambe:a;silme-nuquerna:y-english,tilde-below;telco:a",
            "Jack": "anga;quesse:a,tilde-below",
            "axe": "quesse:a,s;telco:i-below",
            "cake": "quesse;quesse:a,i-below",
            "cakes": "quesse;quesse:a;silme-nuquerna:e",
            "cats.": "quesse;tinco:a,s-final;full-stop", // regression
            "finwe": "formen;telco:i;númen:w,i-below", // invalid input
            "finwë": "formen;telco:i;númen:w;telco:e",
            "font": "formen;tinco:o,tilde-above",
            "green": "ungwe;rómen;telco:e;númen:e",
            "happy": "hyarmen;parma:a,tilde-below;telco:y-english",
            "helcaraxe": "hyarmen;lambe:e;quesse;rómen:a;quesse:a,s;telco:i-below", // invalid input
            "helcaraxë": "hyarmen;lambe:e;quesse;rómen:a;quesse:a,s;telco:e",
            "hobbits": "hyarmen;umbar:o,tilde-below;tinco:i,s-final",
            "hobbits`": "hyarmen;umbar:o,tilde-below;tinco:i,s-inverse",
            "hobbits``": "hyarmen;umbar:o,tilde-below;tinco:i,s-extended",
            "hobbits```": "hyarmen;umbar:o,tilde-below;tinco:i,s-flourish",
            "onyx": "númen:o;quesse:y-english,s",
            "phone": "formenparma;númen:o,i-below",
            "style": "silme;tinco:y-english;lambe:i-below",
            "these": "thúle;silme-nuquerna:e;telco:i-below",
            "these`": "thúle;silme-nuquerna:e;telco:e", // invalid input
            "yellow": "anna;lambe:e,tilde-below;vala:o",
            "yes": "anna;silme-nuquerna:e",

            // for code coverage
            "e": "telco:i-below", // final e is silent
            "e`": "telco:e", // effectively a diaeresis
            "en": "númen:e", // medial e is voiced
            "ie": "yanta:i", // ie treated as diphthong regardless of pronunciation
            "ne": "númen;telco:i-below", // tehta carried forward, still silent when final
            "oe": "yanta:o",
            "x": "quesse:s",
            "y": "anna",
            "yippy": "anna;parma:i,tilde-below;telco:y-english",

            // abbreviated words
            "of": "ampaumbar",
            "the": "antoando",
            "of the": "ampaumbar:tilde-below",
            "of`the": "ampaumbar antoando",
            "and": "ando:tilde-above",
            "and`": "ando:i-below,tilde-above"

        },

        oldEnglish: {
            "írensaga": "ára:i;rómen;númen:e;silme;ungwe:a;telco:a"
        },

        sindarin: {
            // King's Letter
            "Elessar Telcontar: Aragorn Arathornion Edhelharn, aran Gondor ar Hîr i Mbair Annui, anglennatha i Varanduiniant erin dolothen Ethuil, egor ben genediad Drannail erin Gwirith edwen.":
                "lambe:e;silme-nuquerna:e,tilde-below;óre:a " +
                "tinco;lambe:e;quesse;tinco:o,tilde-above;óre:a;colon " +
                "rómen:a;ungwe:a;rómen:o;númen " +
                "rómen:a;thúle:a;rómen:o;númen;telco:i;númen:o " +
                "anto:e;alda:e;rómen:a;númen;comma rómen:a;númen:a " +
                "ungwe;ando:o,tilde-above;óre:o óre:a hyarmen;ára:i;óre telco:i " +
                "umbar:tilde-above;anna:a;óre númen:a,tilde-above;anna:u;comma " +
                "ungwe:a,tilde-above;lambe;númen:e,tilde-above;thúle:a;telco:a " +
                "telco:i " +
                "ampa;rómen:a;ando:a,tilde-above;anna:u;númen;telco:i;tinco:a,tilde-above " +
                "rómen:e;númen:i ando;lambe:o;thúle:o;númen:e thúle:e;anna:u;lambe;comma " +
                "ungwe:e;óre:o umbar;númen:e ungwe;númen:e;ando:e;telco:i;ando:a " +
                "ando;rómen;númen:a,tilde-above;anna:a;lambe rómen:e;númen:i " +
                "ungwe:w;rómen:i;thúle:i ando:e;vala;númen:e;full-stop",

            // (sorted)
            "Aragorn Arathorn:\nTelcontar, Elessar": "rómen:a;ungwe:a;rómen:o;númen rómen:a;thúle:a;rómen:o;númen;colon\ntinco;lambe:e;quesse;tinco:o,tilde-above;óre:a;comma lambe:e;silme-nuquerna:e,tilde-below;óre:a",
            "ainur": "anna:a;númen;óre:u",
            "aldost": "lambe:a;ando;silme-nuquerna:o;tinco",
            "amon sûl": "malta:a;númen:o silme;lambe:ú",
            "aragorn": "rómen:a;ungwe:a;rómen:o;númen",
            "atto": "tinco:a,tilde-below;telco:o",
            "barad dûr": "umbar;rómen:a;ando:a ando;óre:ú",
            "baranduiniant": "umbar;rómen:a;ando:a,tilde-above;anna:u;yanta;anto:a,tilde-above",
            "dagor bragolach": "ando;ungwe:a;óre:o umbar;rómen;ungwe:a;lambe:o;hwesta:a",
            "galadhrim": "ungwe;lambe:a;anto:a;rómen;malta:i",
            "galadriel": "ungwe;lambe:a;ando:a;rómen;yanta:i;lambe",
            "gandalf": "ungwe;ando:a,tilde-above;lambe:a;formen",
            "glorfindel": "ungwe;lambe;rómen:o;formen;ando:i,tilde-above;lambe:e",
            "gwaith iaur arnor": "ungwe:w;anna:a;thúle yanta;vala:a;óre rómen:a;númen;óre:o",
            "gwathló": "ungwe:w;thúle:a;lambe;ára:o",
            "hwesta sindarinwa": "hwesta-sindarinwa;silme-nuquerna:e;tinco;telco:a silme;ando:i,tilde-above;rómen:a;telco:i;númen:w;telco:a",
            "hír": "hyarmen;ára:i;óre",
            "hîr": "hyarmen;ára:i;óre",
            "iant": "yanta;tinco:a,tilde-above",
            "iaur": "yanta;vala:a;óre",
            "isildur": "silme-nuquerna:i;lambe:i;ando;óre:u",
            "lhûn": "alda;númen:ú",
            "lothlórien": "lambe;thúle:o;lambe;rómen:ó;yanta:i;númen",
            "mae govannen": "malta;yanta:a ungwe;ampa:o;númen:a,tilde-above;númen:e",
            "mellon": "malta;lambe:e,tilde-below;númen:o",
            "mordor": "malta;rómen:o;ando;óre:o",
            "moria": "malta;rómen:o;telco:i;telco:a",
            "noldor": "ñwalme;lambe:o;ando;óre:o",
            "periannath": "parma;rómen:e;telco:i;númen:a,tilde-above;thúle:a",
            "rhûn": "arda;númen:ú",
            "tyelpe": "tinco:y-sindarin;lambe:e;parma;telco:e",
            "varda": "ampa;rómen:a;ando;telco:a",
            "y": "telco:y-sindarin",
            "á": "anna:a",
            "ñoldor": "ñwalme;lambe:o;ando;óre:o",
        },

        blackSpeech: {
            // in order of appearance in the ring poem
            "ash": "harmacalma:a",
            "nazg": "númen;esse-nuquerna:a;ungwe",
            "durbatulûk": "ando;óre:o;umbar;tinco:a;lambe:o;quesse:ó", // swap o and u, medial óre before consonant
            "gimbatul": "ungwe;umbar:i,tilde-above;tinco:a;lambe:o",
            "thrakatulûk": "thúle;rómen;quesse:a;tinco:a;lambe:o;quesse:ó",
            "agh": "unqueungwe:a",
            "burzumishi": "umbar;óre:o;esse;malta:o;harmacalma:i;telco:i",
            "krimpatul": "quesse;rómen;parma:i,tilde-above;tinco:a;lambe:o",
        },

    },

};
