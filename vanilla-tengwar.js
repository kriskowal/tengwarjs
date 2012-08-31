
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var TengwarAnnatar = require("./tengwar-annatar");

var array_ = Array.prototype;

if (document.querySelectorAll && array_.forEach) {
    if (document.readyState === "complete") {
        onload();
    } else {
        document.addEventListener("DOMContentLoaded", onload, true);
    }
}

function onload() {
    var elements = document.querySelectorAll(".tengwar");
    array_.forEach.call(elements, function (element) {
        var data = element.dataset;
        var tengwar, mode, encoding, block;
        block = element.tagName.toLowerCase() === "div";
        if (data) {
            tengwar = data.tengwar;
            mode = data.mode;
            encoding = data.encoding;
        } else {
            tengwar = element.getAttribute("data-tengwar");
            mode = element.getAttribute("data-mode");
            encoding = element.getAttribute("data-encoding");
        }
        if (encoding) {
            element.innerText = TengwarAnnatar.transcribe(encoding, {block: block});
        } else if (tengwar) {
            console.log(tengwar);
            mode = mode || 'general-use';
            var Mode = mode === 'general-use' ? GeneralUse : Classical;
            element.innerHTML = Mode.transcribe(tengwar, {block: block});
        }
    });
}

