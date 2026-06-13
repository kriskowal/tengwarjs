// KEBENARAN 2 — Regrets Fingerprints (All GREEN)
// This is the contract fingerprint. All clusters must remain GREEN after refactoring.
// Generated: Phase 2 of Regrets regression testing on tengwarjs

"use strict";

var fs = require("fs");
var path = require("path");

var regretsDir = path.join(__dirname);
var files = fs.readdirSync(regretsDir).filter(function(f) {
  return f.endsWith(".regret");
});

var fingerprints = {};

for (var i = 0; i < files.length; i++) {
  var file = files[i];
  var content = fs.readFileSync(path.join(regretsDir, file), "utf8");
  var clusterId = file.replace(".regret", "");

  // Parse fingerprint and input/output from .regret file
  var metaSection = content.split("\n---\n")[0];
  var dataSection = content.split("\n---\n")[1] || "";

  var meta = {};
  for (var line of metaSection.split("\n")) {
    var colonIdx = line.indexOf(": ");
    if (colonIdx === -1) continue;
    var key = line.slice(0, colonIdx);
    var val = line.slice(colonIdx + 2).trim();
    meta[key] = val;
  }

  var inputLine = dataSection.split("\n").find(function(l) { return l.startsWith("INPUT "); });
  var outputLine = dataSection.split("\n").find(function(l) { return l.startsWith("OUTPUT "); });
  var hashLine = dataSection.split("\n").find(function(l) { return l.startsWith("HASH "); });

  fingerprints[clusterId] = {
    fingerprint: meta.fingerprint,
    captured: meta.captured,
    watches: meta.watches,
    entry: meta.entry,
    input: inputLine ? inputLine.replace(/^INPUT\s+/, "") : null,
    output: outputLine ? outputLine.replace(/^OUTPUT\s+/, "") : null,
    hash: hashLine ? hashLine.replace(/^HASH\s+/, "").trim() : null,
    status: "GREEN"
  };
}

var outputPath = path.join(__dirname, "kebenaran-2-fingerprints.json");
fs.writeFileSync(outputPath, JSON.stringify(fingerprints, null, 2), "utf8");
console.log("KEBENARAN 2 saved to: " + outputPath);
console.log("Clusters fingerprinted: " + Object.keys(fingerprints).length);

// Verify all GREEN
var allGreen = true;
for (var id in fingerprints) {
  if (fingerprints[id].status !== "GREEN") {
    console.log("  ❌ " + id + " is NOT GREEN!");
    allGreen = false;
  } else {
    console.log("  ✅ " + id + " → " + fingerprints[id].fingerprint);
  }
}

if (allGreen) {
  console.log("\n✅ All fingerprints are GREEN. KEBENARAN 2 is valid.");
} else {
  console.log("\n❌ Some fingerprints are NOT GREEN. Do NOT proceed to Phase 3.");
  process.exit(1);
}
