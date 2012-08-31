
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var TengwarAnnatar = require("./tengwar-annatar");

var array_ = Array.prototype;

document.addEventListener("DOMContentLoaded", function onload() {
    if (document.body.dataset && document.querySelectorAll && array_.forEach) {
        var elements = document.querySelectorAll(".tengwar");
        array_.forEach.call(elements, function (element) {
            var data = element.dataset;
            if (data.encoding) {
                element.innerText = TengwarAnnatar.transcribe(data.encoding);
            } else if (data.tengwar) {
                var mode = data.mode || 'general-use';
                var Mode = mode === 'general-use' ? GeneralUse : Classical;
                element.innerText = Mode.transcribe(data.tengwar);
            }
        });
    }
    document.removeEventListener("DOMContentLoaded", onload);
});

