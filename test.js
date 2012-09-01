
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

function update() {
    var value = input.value;
    var mode = generalUse.checked ? GeneralUse : Classical;
    var font = annatar.checked ? TengwarAnnatar : TengwarParmaite;
    output.classList.remove(annatar.checked ? "parmaite" : "annatar");
    output.classList.add(annatar.checked ? "annatar" : "parmaite");
    output.innerHTML = mode.transcribe(value, {font: font, block: true});
}

function onupdate(event) {
    update();
}

input.addEventListener("keyup", onupdate);
input.addEventListener("keydown", onupdate);
input.select();

generalUse.addEventListener("change", onupdate);
classical.addEventListener("change", onupdate);
parmaite.addEventListener("change", onupdate);
annatar.addEventListener("change", onupdate);

