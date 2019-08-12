
var GeneralUse = require("../general-use");
var tests = require("./general-use");

describe("general use", function () {
    Object.keys(tests).forEach(function (language) {
        var languageTests = tests[language];
        describe(language, function () {
            Object.keys(languageTests).forEach(function (input) {
                it("should encode " + input, function () {
                    var expected = languageTests[input];
                    expect(GeneralUse.encode(input, {
                        language: language
                    })).toEqual(expected);
                });
            });
        });
    });
});

