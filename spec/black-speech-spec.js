
var GeneralUse = require("../general-use");
var tests = require("./black-speech");

describe("black speech", function () {
    Object.keys(tests).forEach(function (input) {
        it("should encode " + input, function () {
            expect(GeneralUse.encode(input, {
                blackSpeech: true
            })).toEqual(tests[input]);
        });
    });
});

