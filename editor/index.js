
var Bindings = require("frb");
require("frb/dom");
var Properties = require("frb/properties");
var QS = require("qs");
var modes = require("tengwar/modes");
var fonts = require("tengwar/fonts");

var state;
if (window.location.search) {
    state = QS.parse(window.location.search.slice(1));
} else {
    state = {};
}
state.q = state.q || "Mae govannen, Arda!";
state.mode = state.mode || "general-use";
state.font = state.font || "annatar";
state.options = state.options || [];
state.height = state.height || null;

var bindings = Bindings.create(null, {
    state: state,
    window: window,
    bodyElement: document.body,
    inputElement: document.querySelector("#input"),
    outputElement: document.querySelector("#output"),
    dividerElement: document.querySelector("#divider"),
    inputBoxElement: document.querySelector("#input-box"),
    selectModeElement: document.querySelector("#select-mode"),
    wikiTextElement: document.querySelector("#wiki-text")
}, {

    "inputElement.value": {"<->": "state.q"},

    "bodyElement.classList.has('annatar')": {
        "<-": "state.font == 'annatar'"
    },
    "bodyElement.classList.has('parmaite')": {
        "<-": "state.font == 'parmaite'"
    },

    "outputElement.classList.has('annatar')": {
        "<-": "state.font == 'annatar'"
    },
    "outputElement.classList.has('parmaite')": {
        "<-": "state.font == 'parmaite'"
    },

    "inputBoxElement.style.height": {
        "<-": "heightPx"
    },

    "heightPx": {
        "<-": "state.height",
        convert: function (height) {
            return height + "px";
        },
        revert: function (height) {
            return parseInt(height, 10);
        }
    },

    "mode": {
        args: ["state.mode"],
        compute: function (mode) {
            return modes[mode] || modes['general-use'];
        }
    },

    "font": {
        args: ["state.font"],
        compute: function (font) {
            return fonts[font] || modes['annatar'];
        }
    },

    "outputElement.innerHTML": {
        args: ["mode", "font", "state.q", "state.options"],
        compute: function (mode, font, input, flags) {
            var options = {
                font: font,
                block: true
            };
            flags.forEach(function (flag) {
                flag = flag.replace(/\-(\w)/g, function ($, $1) {
                    return $1.toUpperCase();
                });
                options[flag] = true;
            });
            return mode.transcribe(input, options);
        }
    },

    "selectModeElement.href": {
        "<-": "'modes.html' + searchString"
    },

    "searchString": {
        args: ["state.q", "state.mode", "state.font", "state.height", "state.options"],
        compute: function () {
            var state = this.state;

            // remove things that QS can't seem to handle
            delete state[""]; // XXX QS bug interprets empty array as & and back to an empty assignment
            if (state.options.length == 0) {
                delete state.options;
            }
            var string = "?" + QS.stringify(this.state);
            window.history.replaceState(this.state, "", string);

            state.options = state.options || [];
            return string;
        }
    },

    "wikiTextElement.href": {
        "<-": "'data:text/plain;charset=utf-8,' + wikiText"
    },

    "wikiText": {
        args: ["state.q", "state.mode", "state.font", "state.height", "state.options"],
        compute: function (text, mode, font, height, flags) {
            var modeLine = [mode].concat(flags).filter(Boolean).join(" ");
            if (/\n/.test(text)) {
                return encodeURIComponent(
                    "<tengwarblock " +
                    "font=\"" + font + "\" " +
                    "mode=\"" + mode + "\">\n" +
                    encodeHtml(text) +
                    "\n</tengwarblock>"
                );
            } else {
                return encodeURIComponent(
                    "<tengwar " +
                    "font=\"" + font + "\" " +
                    "mode=\"" + mode + "\">" +
                    encodeHtml(text) +
                    "</tengwar>"
                );
            }
        }
    }

});

document.body.classList.add("bootstrap");
setTimeout(function () {
    document.body.classList.remove("bootstrap");
}, 1000);

bindings.inputElement.select();

divider.addEventListener("mousedown", function (event) {
    event.preventDefault();
    var start = event.y;
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);
    function mousemove(event) {
        var end = event.y;
        var delta = end - start;
        var height = parseInt(window.getComputedStyle(bindings.inputBoxElement).height, 10);
        start = end;
        bindings.state.height = height - delta;
    }
    function mouseup(event) {
        window.removeEventListener("mouseup", mouseup);
        window.removeEventListener("mousemove", mousemove);
    }
});

function encodeHtml(string) {
    return String(string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

