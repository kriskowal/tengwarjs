
var Beleriand = require("../beleriand");
var tests = require("./beleriand");

describe("beleriand", function () {
    Object.keys(tests).forEach(function (input) {
        it("should encode " + input, function () {
            expect(Beleriand.encode(input, {
            })).toEqual(tests[input]);
        });
    });
});

