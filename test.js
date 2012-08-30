
var GeneralUse = require("./general-use");
var Classical = require("./classical");

var input = document.querySelector("#input");
var generalUse = document.querySelector("#input-general-use");
var classical = document.querySelector("#input-classical");
var output = document.querySelector("#output");

function update() {
    var value = input.value;
    var mode = generalUse.checked ? GeneralUse : Classical;
    output.innerHTML = mode.transcribe(value);
}

function onupdate(event) {
    update();
}

input.addEventListener("keyup", onupdate);
input.addEventListener("keydown", onupdate);
input.select();

generalUse.addEventListener("change", onupdate);
classical.addEventListener("change", onupdate);

