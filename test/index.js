
var Beleriand = require("../beleriand");
var BeleriandTests = require("./beleriand");
var Classical = require("../classical");
var ClassicalTests = require("./classical");
var GeneralUse = require("../general-use");
var GeneralUseTests = require("./general-use");
var Fonts = require("../fonts");
var NumberTests = require("./numbers");

function equal(label, actual, expected) {
    if (expected !== actual) {
        console.log('# %s', label);
        console.log('%j expected', expected);
        console.log('%j actual', actual);
        process.exitCode = 1;
    }
}

Object.entries(GeneralUseTests).forEach(function ([fontName, tests]) {
    Object.entries(tests).forEach(function ([language, tests]) {
        Object.entries(tests).forEach(function ([input, expected]) {
            equal(
                `general use, ${fontName}, ${language}: ${input}`, 
                GeneralUse.encode(input, {
                    language: language
                }),
                expected,
            );
        });
    });
});

Object.entries(ClassicalTests).forEach(function ([input, expected]) {
    equal(
        `classical ${input}`,
        Classical.encode(input),
        expected,
    );
});

Object.entries(BeleriandTests).forEach(function ([input, expected]) {
    equal(
        `beleriand ${input}`,
        Beleriand.encode(input),
        expected,
    );
});

[GeneralUse, Classical, Beleriand].forEach(function (mode) {
    Object.entries(Fonts).forEach(function ([fontName, font]) {
        Object.entries(NumberTests).forEach(function ([base, tests]) {
            var options = {
                font: font,
                duodecimal: base === "duodecimal"
            };
            Object.entries(tests.encode).forEach(function ([input, expected]) {
                equal(
                    `${mode.name}, ${fontName}, ${base}: ${input}`,
                    mode.encode(input, options),
                    expected,
                );
            });
            Object.entries(tests.transcribe[fontName]).forEach(function ([input, expected]) {
                equal(
                    `${mode.name}, ${fontName}, ${base} marks: ${input}`,
                    mode.transcribe(input, options),
                    expected,
                );
            });
        });
    });
});

if (!process.exitCode) {
    console.log('PASS');
} else {
    console.log('FAIL');
}
