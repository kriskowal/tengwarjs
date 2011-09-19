var T = require("./tengwar");

var tests = {

    // sindarin (sorted)
    "ainur": "a/anna numen u/ore",
    "aldost": "a/lambe ando o/silme-nuquerna tinco",
    "amon sûl": "a/malta o/numen space silme ú/lambe",
    "aragorn": "a/romen a/ungwe o/romen numen",
    "atto": "a/tinco/tilde-below o/short-carrier",
    "baranduiniant": "umbar a/romen a/ando/tilde-above u/anna yanta a/anto/tilde-above",
    "dagor bragolach": "ando a/ungwe o/ore space umbar romen a/ungwe o/lambe a/hwesta",
    "galadhrim": "ungwe a/lambe a/anto romen i/malta",
    "galadriel": "ungwe a/lambe a/ando romen i/short-carrier e/lambe",
    "gandalf": "ungwe a/ando/tilde-above a/lambe formen",
    "glorfindel": "ungwe lambe o/romen formen i/ando/tilde-above e/lambe",
    "gwaith iaur arnor": "ungwe/w a/anna thule space yanta a/vala ore space a/romen numen o/ore",
    "gwathló": "ungwe/w a/thule lambe o/long-carrier",
    "hwesta sindarinwa": "hwesta-sindarinwa e/silme-nuquerna tinco a/short-carrier space silme i/ando/tilde-above a/romen i/numen vala a/short-carrier",
    "iant": "yanta a/tinco/tilde-above",
    "iaur": "yanta a/vala ore",
    "isildur": "i/silme-nuquerna i/lambe ando u/ore",
    "lhûn": "alda ú/numen",
    "lothlórien": "lambe o/thule lambe ó/romen i/short-carrier e/numen",
    "mae govannen": "malta a/yanta space ungwe o/ampa a/numen/tilde-above e/numen",
    "mellon": "malta e/lambe/tilde-below o/numen",
    "mordor": "malta o/romen ando o/ore",
    "moria": "malta o/romen i/short-carrier a/short-carrier",
    "noldor": "nwalme o/lambe ando o/ore",
    "nwalme": "nwalme/w a/lambe malta e/short-carrier",
    "periannath": "parma e/romen i/short-carrier a/numen/tilde-above a/thule",
    "rhûn": "arda ú/numen",
    "tyelpe": "tinco/y e/lambe parma e/short-carrier",
    "varda": "ampa a/romen ando a/short-carrier",
    "á": "a/wilya",
    "ñoldor": "nwalme o/lambe ando o/ore",

    // quenya (sorted)
    "ardalambion": "a/romen ando a/lambe a/umbar/tilde-above i/short-carrier o/numen",
    "helcaraxë": "hyarmen e/lambe quesse a/romen a/quesse/s e/short-carrier",
    "hyarmen": "hyarmen/y a/romen malta e/numen",
    "istari": "i/silme-nuquerna tinco a/romen i/short-carrier",
    "sinome maruvan": "silme i/numen o/malta e/short-carrier space malta a/romen u/ampa a/numen",
    "sinome maruvan": "silme i/numen o/malta e/short-carrier space malta a/romen u/ampa a/numen",
    "telperion": "tinco e/lambe parma e/romen i/short-carrier o/numen",
    "yuldar": "í/short-carrier u/lambe ando a/ore",

    // english
    "hobbits": "hyarmen o/umbar/tilde-below i/tinco/s",
    "hobbits'": "hyarmen o/umbar/tilde-below i/tinco/s-inverse",
    "hobbits''": "hyarmen o/umbar/tilde-below i/tinco/s-extended",

    // old english
    "írensaga": "i/long-carrier romen e/numen silme a/ungwe a/short-carrier",

    // interesting clusters
    "xx": "quesse/s quesse/s",
    "tsts": "tinco silme tinco/s",
    "iqs": "i/quesse vala silme",
    "aty": "a/tinco/y",
    "is": "i/short-carrier/s",
    "allys": "a/lambe/tilde-below/y/s",
    "alyssa": "a/lambe/y silme/tilde-below a/short-carrier",




}

exports.tests = tests;

Object.keys(tests).forEach(function (input) {
    exports['test ' + input] = function (assert) {
        var oracle = tests[input].split(" space ").map(function (phrase) {
            return phrase.split(/\s+/).map(function (cluster) {
                return cluster.split("/").sort();
            });
        });;
        var actual = T.transcribeToEncoding(input).split(/\s+/).map(function (phrase) {
            return phrase.split(";").map(function (cluster) {
                return cluster.split(":").sort();
            });
        });
        assert.deepEqual(actual, oracle, 'transcribe');
    }
});

if (require.main === module)
    require("test").run(exports);
