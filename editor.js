
var QS = require("qs");
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var TengwarAnnatar = require("./tengwar-annatar");
var TengwarParmaite = require("./tengwar-parmaite");

var body = document.body;
var input = document.querySelector("#input");
var generalUse = document.querySelector("#input-general-use");
var classical = document.querySelector("#input-classical");
var annatar = document.querySelector("#input-tengwar-annatar");
var parmaite = document.querySelector("#input-tengwar-parmaite");
var output = document.querySelector("#output");
var divider = document.querySelector("#divider");
var inputBox = document.querySelector("#input-box");

if (window.location.search) {
    query = QS.parse(window.location.search.slice(1));
    input.value = query.q || "";
    generalUse.checked = query.mode === "general-use";
    classical.checked = query.mode === "classical";
    parmaite.checked = query.font === "parmaite";
    annatar.checked = query.font === "annatar";
} else {
    query = {
        q: "Mae govannen, Arda!",
        mode: "general-use",
        font: "annatar"
    };
}

body.classList.add("bootstrap");
update();
setTimeout(function () {
    body.classList.remove("bootstrap");
}, 1000);

function update() {
    var value = query.q || "";
    if (value != input.value) {
        input.value = value;
    }
    history.replaceState(query, value, "?" + QS.stringify(query));
    var mode = query.mode === "classical" ? Classical : GeneralUse;
    var font = query.font === "annatar" ? TengwarAnnatar : TengwarParmaite;
    output.classList.remove(query.font !== "parmaite" ? "parmaite" : "annatar");
    output.classList.add(query.font === "parmaite" ? "parmaite" : "annatar");
    output.innerHTML = mode.transcribe(value, {font: font, block: true});
    inputBox.style.height = query.height + "px";
}

function onupdate(event) {
    var change;
    if (query.q !== input.value) change = true;
    query.q = input.value;
    var newMode = generalUse.checked ? "general-use" : "classical";
    if (query.mode !== newMode) change = true;
    query.mode = newMode;
    var newFont = annatar.checked ? "annatar" : "parmaite";
    if (query.font !== newFont) change = true;
    query.font = newFont;
    if (change) update();
}

input.addEventListener("keyup", onupdate);
input.addEventListener("keydown", onupdate);

input.select();
/*
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
*/

generalUse.addEventListener("change", onupdate);
classical.addEventListener("change", onupdate);
parmaite.addEventListener("change", onupdate);
annatar.addEventListener("change", onupdate);

divider.addEventListener("mousedown", function (event) {
    event.preventDefault();
    var start = event.y;
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);
    function mousemove(event) {
        var end = event.y;
        var delta = end - start;
        var height = parseInt(window.getComputedStyle(inputBox).height, 10);
        start = end;
        query.height = height - delta;
        update();
    }
    function mouseup(event) {
        window.removeEventListener("mouseup", mouseup);
        window.removeEventListener("mousemove", mousemove);
    }
});

