
var Classical = require("../classical");
var tests = require("./classical");

describe("classical", function () {
    Object.keys(tests).forEach(function (input) {
        it("should encode " + input, function () {
            expect(Classical.encode(input)).toEqual(tests[input]);
        });
    });
});

