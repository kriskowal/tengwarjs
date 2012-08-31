
var Classical = require("../classical");

var tests = {
    "ainaldo": "yanta:a;numen:a;alda:o",
    "aldost": "short-carrier:a;alda:o;silme;tinco",
    "hlóce": "halla;lambe:ó;calma:e", // attested
    "hríve": "halla;romen;long-carrier:i;vala:e", // attested
    "hyarmen": "hyarmen:a,y;ore;malta:e;numen",
    //"hyarmen(classical)": "hyarmen:a;romen;malta:e;numen",
    //"hyarmen(classical,aha)": "hyarmen:a,y;romen;malta:e;numen",
    "lambe": "lambe:a;umbar:e",
    "moria": "malta:o;romen:i;short-carrier:a",
    "silme": "silme-nuquerna:i;lambe;malta:e",
    "syi": "silme:y;short-carrier:i", //*
    "thúlë": "thule:ú;lambe:e",
    "tyelpe": "tinco:e,y;lambe;parma:e",
    "vanwa": "vala:a;numen;wilya:a",
    "yuldar": "anna:u,y;alda:a;ore",
};

describe("classical", function () {
    Object.keys(tests).forEach(function (input) {
        it("should encode " + input, function () {
            expect(Classical.encode(input)).toEqual(tests[input]);
        });
    });
});



