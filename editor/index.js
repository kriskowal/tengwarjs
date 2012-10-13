
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
        dependencies: "state.height",
        get: function () {
            return this.state.height + "px";
        },
        set: function (height) {
            this.state.height = parseInt(height, 10);
        }
    },

    "mode": {
        dependencies: "state.mode",
        get: function () {
            return modes[this.state.mode] || modes['general-use'];
        }
    },

    "font": {
        dependencies: "state.font",
        get: function () {
            return fonts[this.state.font] || modes['annatar'];
        }
    },

    "transcription": {
        dependencies: ["mode", "font", "state.q"],
        get: function () {
            var options = {
                font: this.font,
                block: true
            };
            this.state.options.forEach(function (flag) {
                flag = flag.replace(/\-(\w)/g, function ($, $1) {
                    return $1.toUpperCase();
                });
                options[flag] = true;
            });
            return this.mode.transcribe(this.state.q, options);
        }
    },

    "outputElement.innerHTML": {
        "<-": "transcription"
    },

    "searchString": {
        dependencies: ["state.q", "state.mode", "state.font", "state.height", "state.options"],
        get: function () {
            if (!this.state)
                return;
            delete this.state[""]; // XXX QS bug interprets empty array as & and back to an empty assignment
            var string = "?" + QS.stringify(this.state);
            window.history.replaceState(this.state, "", string);
            return string;
        }
    },

    "selectModeElement.href": {
        "<-": "'modes.html' + searchString"
    },

    "wikiText": {
        "dependencies": ["state.q", "state.mode", "state.font", "state.height", "state.options"],
        get: function () {
            var text = this.state.q;
            var font = this.state.font;
            var mode = [this.state.mode].concat(this.state.options).filter(Boolean).join(" ");
            if (/\n/.test(text)) {
                return encodeURIComponent(
                    "<tengwarblock " +
                    "font=\"" + font + "\" " +
                    "mode=\"" + mode + "\">\n" +
                    text +
                    "\n</tengwarblock>"
                );
            } else {
                return encodeURIComponent(
                    "<tengwar " +
                    "font=\"" + font + "\" " +
                    "mode=\"" + mode + "\">" +
                    text +
                    "</tengwar>"
                );
            }
        }
    },

    "wikiTextElement.href": {
        "<-": "'data:text/plain,' + wikiText"
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

