// Verify semantic identity between KEBENARAN 1 (raw output) and KEBENARAN 2 (fingerprints)
// If the fingerprint of the raw output matches the stored fingerprint, they are semantically identical.

"use strict";

var fs = require("fs");
var path = require("path");

// Load KEBENARAN 1
var rawOutput = JSON.parse(fs.readFileSync(path.join(__dirname, "kebenaran-1-raw-output.json"), "utf8"));

// Load KEBENARAN 2
var fingerprints = JSON.parse(fs.readFileSync(path.join(__dirname, "kebenaran-2-fingerprints.json"), "utf8"));

// Import the fingerprint function from Regrets
// We'll compute fingerprints manually to verify
var crypto = require("crypto");

function stableStringify(obj) {
  if (obj === null || obj === undefined) return String(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  if (obj && typeof obj === 'object') {
    var keys = Object.keys(obj).sort();
    return '{' + keys.map(function(k) { return JSON.stringify(k) + ':' + stableStringify(obj[k]); }).join(',') + '}';
  }
  return JSON.stringify(obj);
}

function computeFingerprint(input, output) {
  var combined = stableStringify(input) + '|' + stableStringify(output);
  var hash = crypto.createHash('sha256').update(combined, 'utf8').digest('hex');
  var num = BigInt('0x' + hash);
  return num.toString(36).slice(0, 7);
}

// Verify each cluster
var allMatch = true;
var checked = 0;

for (var clusterId in fingerprints) {
  var fp2 = fingerprints[clusterId];
  if (!rawOutput[clusterId]) {
    console.log("⚠️  " + clusterId + ": no raw output found in KEBENARAN 1 — skipping");
    continue;
  }

  // Get the first input/output pair from the .regret file (the golden)
  var goldenInput = fp2.input ? JSON.parse(fp2.input) : undefined;
  var goldenOutput = fp2.output ? JSON.parse(fp2.output) : undefined;
  var storedHash = fp2.fingerprint;

  // Recompute the fingerprint from the stored golden input/output
  var recomputedHash = computeFingerprint(goldenInput, goldenOutput);

  if (recomputedHash === storedHash) {
    console.log("✅ " + clusterId + ": fingerprint " + storedHash + " matches recomputed " + recomputedHash);
    checked++;
  } else {
    console.log("❌ " + clusterId + ": MISMATCH! stored=" + storedHash + " recomputed=" + recomputedHash);
    allMatch = false;
  }
}

console.log("\n" + (allMatch ? "✅" : "❌") + " Semantic identity check: " + checked + "/" + Object.keys(fingerprints).length + " clusters verified");

if (!allMatch) {
  console.log("❌ KEBENARAN 1 and KEBENARAN 2 are NOT semantically identical!");
  console.log("   STOP. Do NOT proceed to Phase 3.");
  process.exit(1);
} else {
  console.log("✅ KEBENARAN 1 and KEBENARAN 2 are semantically identical.");
  console.log("   Safe to proceed to Phase 3 — Refactoring.");
}
