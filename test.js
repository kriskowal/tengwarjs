
var QS = require("qs");
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var TengwarAnnatar = require("./tengwar-annatar");
var TengwarParmaite = require("./tengwar-parmaite");

var input = document.querySelector("#input");
var generalUse = document.querySelector("#input-general-use");
var classical = document.querySelector("#input-classical");
var annatar = document.querySelector("#input-tengwar-annatar");
var parmaite = document.querySelector("#input-tengwar-parmaite");
var output = document.querySelector("#output");

if (window.location.search) {
    query = QS.parse(window.location.search.slice(1));
    input.innerText = query.q || "";
    generalUse.checked = query.mode === "general-use";
    classical.checked = query.mode === "classical";
    parmaite.checked = query.font === "parmaite";
    annatar.checked = query.font === "annatar";
    update();
} else {
    query = {};
}

function update() {
    var value = query.q || "";
    history.replaceState(query, value, "?" + QS.stringify(query));
    var mode = query.mode === "classical" ? Classical : GeneralUse;
    var font = query.font === "annatar" ? TengwarAnnatar : TengwarParmaite;
    output.classList.remove(query.font !== "parmaite" ? "parmaite" : "annatar");
    output.classList.add(query.font === "parmaite" ? "parmaite" : "annatar");
    output.innerHTML = mode.transcribe(value, {font: font, block: true});
}

function onupdate(event) {
    query.q = input.innerText;
    query.mode = generalUse.checked ? "general-use" : "classical";
    query.font = annatar.checked ? "annatar" : "parmaite";
    update();
}

input.addEventListener("keyup", onupdate);
input.addEventListener("keydown", onupdate);

input.focus();
var range = document.createRange();
var node;
if (!input.lastChild) {
    input.appendChild(document.createTextNode(""));
}
node = input.lastChild;
range.selectNode(node);
range.collapse();
var selection = window.getSelection();
selection.removeAllRanges();
selection.addRange(range);

generalUse.addEventListener("change", onupdate);
classical.addEventListener("change", onupdate);
parmaite.addEventListener("change", onupdate);
annatar.addEventListener("change", onupdate);

