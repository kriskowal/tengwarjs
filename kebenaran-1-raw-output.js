#!/usr/bin/env node
// kebenaran-1-raw-output.js — Capture raw output of all entry functions
// Run from tengwarjs project root
"use strict";

var GeneralUse = require("./general-use");
var Classical = require("./classical");
var Beleriand = require("./beleriand");
var Notation = require("./notation");

var results = {};

// General Use encode
results["general-use-encode"] = {
    entry: "encode",
    outputs: [
        { input: "hello", output: GeneralUse.encode("hello", {}) },
        { input: "aragorn", output: GeneralUse.encode("aragorn", {}) },
        { input: "mellon", output: GeneralUse.encode("mellon", {}) },
        { input: "namarie", output: GeneralUse.encode("namarie", {}) },
        { input: "frodo", output: GeneralUse.encode("frodo", {}) }
    ]
};

// General Use Black Speech encode
results["general-use-encode-black-speech"] = {
    entry: "encode (black-speech)",
    outputs: [
        { input: "ash nazg", output: GeneralUse.encode("ash nazg", { language: "black-speech" }) },
        { input: "durbatuluk", output: GeneralUse.encode("durbatuluk", { language: "black-speech" }) },
        { input: "gimbatul", output: GeneralUse.encode("gimbatul", { language: "black-speech" }) }
    ]
};

// General Use Reverse Curls encode
results["general-use-encode-reverse-curls"] = {
    entry: "encode (reverseCurls)",
    outputs: [
        { input: "hello", output: GeneralUse.encode("hello", { reverseCurls: true }) },
        { input: "orodruin", output: GeneralUse.encode("orodruin", { reverseCurls: true }) }
    ]
};

// General Use transcribe plain
results["general-use-transcribe-plain"] = {
    entry: "transcribe (plain)",
    outputs: [
        { input: "hello", output: GeneralUse.transcribe("hello", { plain: true }) },
        { input: "aragorn", output: GeneralUse.transcribe("aragorn", { plain: true }) }
    ]
};

// Classical encode
results["classical-encode"] = {
    entry: "encode",
    outputs: [
        { input: "namarie", output: Classical.encode("namarie", {}) },
        { input: "elbereth", output: Classical.encode("elbereth", {}) },
        { input: "tinco", output: Classical.encode("tinco", {}) }
    ]
};

// Classical early encode
results["classical-encode-early"] = {
    entry: "encode (classical early)",
    outputs: [
        { input: "namarie", output: Classical.encode("namarie", { classicalR: true, classicalH: true }) },
        { input: "hwesta", output: Classical.encode("hwesta", { classicalR: true, classicalH: true }) }
    ]
};

// Beleriand encode
results["beleriand-encode"] = {
    entry: "encode",
    outputs: [
        { input: "mellon", output: Beleriand.encode("mellon", {}) },
        { input: "barad dur", output: Beleriand.encode("barad dur", {}) },
        { input: "dagor", output: Beleriand.encode("dagor", {}) }
    ]
};

var fs = require("fs");
fs.writeFileSync("regrets/KEBENARAN_1_raw_output.json", JSON.stringify(results, null, 2), "utf8");
console.log("KEBENARAN 1 saved to regrets/KEBENARAN_1_raw_output.json");
