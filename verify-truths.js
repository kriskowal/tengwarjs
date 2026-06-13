#!/usr/bin/env node
// verify-truths.js — Verify KEBENARAN 1 and KEBENARAN 2 are semantically identical
"use strict";

var fs = require("fs");

var k1 = JSON.parse(fs.readFileSync("regrets/KEBENARAN_1_raw_output.json", "utf8"));
var k2 = JSON.parse(fs.readFileSync("regrets/KEBENARAN_2_fingerprints.json", "utf8"));

var mismatches = 0;

for (var clusterId in k1) {
    if (!k2.fingerprints[clusterId]) {
        console.log("❌ " + clusterId + ": missing from KEBENARAN 2");
        mismatches++;
        continue;
    }

    // Compare: the first output in KEBENARAN 1 should match the OUTPUT in KEBENARAN 2
    var k1FirstOutput = k1[clusterId].outputs[0].output;
    var k2Output = JSON.parse(k2.fingerprints[clusterId].output);

    if (JSON.stringify(k1FirstOutput) !== JSON.stringify(k2Output)) {
        console.log("❌ " + clusterId + ": output mismatch");
        console.log("   K1: " + JSON.stringify(k1FirstOutput).substring(0, 100));
        console.log("   K2: " + JSON.stringify(k2Output).substring(0, 100));
        mismatches++;
    } else {
        console.log("✅ " + clusterId + ": IDENTIK");
    }
}

if (mismatches === 0) {
    console.log("\n✅ KEBENARAN 1 and KEBENARAN 2 are semantically IDENTIK. Safe to proceed.");
} else {
    console.log("\n❌ " + mismatches + " mismatch(es) found. STOP — fix before refactoring.");
    process.exit(1);
}
