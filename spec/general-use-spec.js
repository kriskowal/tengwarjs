
var GeneralUse = require("../general-use");
var tests = require("./general-use");

describe("general use", function () {
    Object.keys(tests).forEach(function (input) {
        it("should encode " + input, function () {
            expect(GeneralUse.encode(input)).toEqual(tests[input]);
        });
    });
});

