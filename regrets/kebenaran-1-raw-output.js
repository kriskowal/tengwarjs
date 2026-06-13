// KEBENARAN 1 — Raw Output from All Entry Functions
// This is the ground truth. Run this script to capture the actual, raw output
// of every entry function. This must NOT change after refactoring.
// Generated: Phase 2 of Regrets regression testing on tengwarjs

"use strict";

var GeneralUse = require("../general-use");
var Classical = require("../classical");
var Beleriand = require("../beleriand");
var Notation = require("../notation");
var Index = require("../index");
var Modes = require("../modes");
var Fonts = require("../fonts");

var results = {};

// ─── General Use Mode ────────────────────────────────────────
results["general-use-transcribe"] = {
  "hello": GeneralUse.transcribe("hello"),
  "The Lord of the Rings": GeneralUse.transcribe("The Lord of the Rings"),
  "Aragorn": GeneralUse.transcribe("Aragorn"),
  "frodo": GeneralUse.transcribe("frodo"),
  "": GeneralUse.transcribe("")
};

results["general-use-encode"] = {
  "hello": GeneralUse.encode("hello"),
  "Aragorn": GeneralUse.encode("Aragorn"),
  "": GeneralUse.encode("")
};

results["general-use-make-options"] = {
  "null": GeneralUse.makeOptions(null),
  "blackSpeech": GeneralUse.makeOptions({blackSpeech: true}),
  "reverseCurls+swapDotSlash": GeneralUse.makeOptions({reverseCurls: true, swapDotSlash: true}),
  "black-speech": GeneralUse.makeOptions({language: "black-speech"}),
  "duodecimal": GeneralUse.makeOptions({duodecimal: true})
};

// ─── Classical Mode ──────────────────────────────────────────
results["classical-transcribe"] = {
  "namarie": Classical.transcribe("namarie"),
  "elbereth": Classical.transcribe("elbereth"),
  "": Classical.transcribe("")
};

results["classical-encode"] = {
  "namarie": Classical.encode("namarie"),
  "": Classical.encode("")
};

// ─── Beleriand Mode ──────────────────────────────────────────
results["beleriand-transcribe"] = {
  "mordor": Beleriand.transcribe("mordor"),
  "gondolin": Beleriand.transcribe("gondolin"),
  "": Beleriand.transcribe("")
};

results["beleriand-encode"] = {
  "mordor": Beleriand.encode("mordor"),
  "": Beleriand.encode("")
};

// ─── Notation ────────────────────────────────────────────────
results["notation-encode"] = {
  "empty-sections": Notation.encode([[[[]]]])
};

// ─── Top-level Index ────────────────────────────────────────
results["index-transcribe"] = {
  "hello-general-use-annatar": Index.transcribe("hello", Modes["general-use"], Fonts["annatar"]),
  "namarie-classical-annatar": Index.transcribe("namarie", Modes["classical"], Fonts["annatar"]),
  "mordor-beleriand-parmaite": Index.transcribe("mordor", Modes["beleriand"], Fonts["parmaite"]),
  "The Ring-general-use-annatar": Index.transcribe("The Ring", Modes["general-use"], Fonts["annatar"])
};

results["index-encode"] = {
  "hello-general-use-annatar": Index.encode("hello", Modes["general-use"], Fonts["annatar"]),
  "namarie-classical-annatar": Index.encode("namarie", Modes["classical"], Fonts["annatar"]),
  "mordor-beleriand-parmaite": Index.encode("mordor", Modes["beleriand"], Fonts["parmaite"])
};

// ─── Output ─────────────────────────────────────────────────
var fs = require("fs");
var path = require("path");
var outputPath = path.join(__dirname, "kebenaran-1-raw-output.json");
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
console.log("KEBENARAN 1 saved to: " + outputPath);
console.log("Clusters captured: " + Object.keys(results).length);

// Print summary
for (var cluster in results) {
  var inputs = Object.keys(results[cluster]);
  console.log("  " + cluster + ": " + inputs.length + " inputs");
}
