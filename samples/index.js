
var classical = require("../spec/classical");
var generalUse = require("../spec/general-use");

var body = $("body");
function report(latin, mode, font) {
    var element = $("<nobr>");
    $("<span></span>")
        .text(latin + ": ")
        .css("padding", "10px")
        .appendTo(element);
    $("<span>")
        .attr({
            "class": "tengwar " + font,
            "data-tengwar": latin,
            "data-mode": mode
        })
        .appendTo(element);
    element.appendTo(body);
    $("<span> </span>").appendTo(body);
}

["annatar", "parmaite"].forEach(function (font) {

    $("<h1>tengwar " + font + "</h1>").appendTo(body);

    $("<h2>Classical</h2>").appendTo(body);
    Object.keys(classical).forEach(function (latin) {
        report(latin, "classical", font);
    });

    $("<h2>General Use</h2>").appendTo(body);
    Object.keys(generalUse).forEach(function (latin) {
        report(latin, "general-use", font);
    });

});

var GeneralUse = require("../general-use");
var TengwarParmaite = require("../tengwar-parmaite");
$(".transcribe").each(function () {
    var element = this;
    setTimeout(function () {
        element.classList.remove("transcribe");
        element.innerHTML = GeneralUse.transcribe(element.innerHTML, {
            font: TengwarParmaite
        });
        element.classList.add("tengwar");
        element.classList.add("parmaite");
        element.classList.add("rendered");
    }, 0);
});

require("../tengwar");

