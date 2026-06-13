#!/usr/bin/env node
// kebenaran-2-fingerprints.js — Save all Regrets fingerprints and chain hashes
"use strict";

var fs = require("fs");
var path = require("path");

var regretsDir = "./regrets";
var chainsDir = "./regrets/chains";

var fingerprints = {};

// Read all .regret files
var regretFiles = fs.readdirSync(regretsDir).filter(function(f) {
    return f.endsWith(".regret");
});

for (var file of regretFiles) {
    var content = fs.readFileSync(path.join(regretsDir, file), "utf8");
    var id = file.replace(".regret", "");

    var fingerprint = content.match(/^fingerprint: (.+)$/m);
    var captured = content.match(/^captured: (.+)$/m);
    var inputLine = content.match(/^INPUT (.+)$/m);
    var outputLine = content.match(/^OUTPUT (.+)$/m);
    var hashLine = content.match(/^HASH (.+)$/m);

    fingerprints[id] = {
        fingerprint: fingerprint ? fingerprint[1] : null,
        captured: captured ? captured[1] : null,
        goldenHash: hashLine ? hashLine[1].trim() : null,
        input: inputLine ? inputLine[1] : null,
        output: outputLine ? outputLine[1] : null
    };
}

// Read all chain files
var chainFiles = [];
try {
    chainFiles = fs.readdirSync(chainsDir).filter(function(f) {
        return f.endsWith(".chain");
    });
} catch (e) {}

var chains = {};
for (var cf of chainFiles) {
    var chainContent = fs.readFileSync(path.join(chainsDir, cf), "utf8");
    var chainId = cf.replace(".chain", "");

    var chainHash = chainContent.match(/^chain_hash:\s+(\S+)/m);
    var chainCaptured = chainContent.match(/^captured:\s+(\S+)/m);

    chains[chainId] = {
        chainHash: chainHash ? chainHash[1] : null,
        captured: chainCaptured ? chainCaptured[1] : null
    };
}

var result = {
    fingerprints: fingerprints,
    chains: chains,
    savedAt: new Date().toISOString()
};

fs.writeFileSync("regrets/KEBENARAN_2_fingerprints.json", JSON.stringify(result, null, 2), "utf8");
console.log("KEBENARAN 2 saved to regrets/KEBENARAN_2_fingerprints.json");
console.log("Clusters: " + Object.keys(fingerprints).length);
console.log("Chains: " + Object.keys(chains).length);
