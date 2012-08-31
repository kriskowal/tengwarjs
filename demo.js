
var classical = require("./spec/classical");
var generalUse = require("./spec/general-use");

var body = $("body");
function report(latin, mode) {
    var element = $("<nobr>");
    $("<span></span>")
        .text(latin + ": ")
        .css("padding", "10px")
        .appendTo(element);
    $("<span>")
        .attr({
            "class": "tengwar",
            "data-tengwar": latin,
            "data-mode": mode
        })
        .appendTo(element);
    element.appendTo(body);
    $("<span> </span>").appendTo(body);
}

$("<h2>Classical</h2>").appendTo(body);
Object.keys(classical).forEach(function (latin) {
    report(latin, "classical");
});

$("<h2>General Use</h2>").appendTo(body);
Object.keys(generalUse).forEach(function (latin) {
    report(latin, "general-use");
});

require("./vanilla-tengwar");
