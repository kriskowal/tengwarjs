
var GeneralUse = require("../general-use");
var tests = require("./general-use");

describe("general use", function () {
    Object.entries(tests).forEach(function ([fontName, tests]) {
        Object.entries(tests).forEach(function ([language, tests]) {
            describe(language, function () {
                Object.entries(tests).forEach(function ([input, expected]) {
                    it("should encode " + input, function () {
                        expect(GeneralUse.encode(input, {
                            language: language
                        })).toEqual(expected);
                    });
                });
            });
        });
    });
});

