
var Bindings = require("frb");
require("frb/dom");
var Properties = require("frb/properties");
var QS = require("qs");
var modes = require("tengwar/modes");
var fonts = require("tengwar/fonts");

var controller = Bindings.create(null, {
    state: {
        q: "Mae govannen, Arda!",
        mode: "general-use",
        font: "annatar"
    },
    window: window,
    bodyElement: document.body,
    inputElement: document.querySelector("#input"),
    generalUseElement: document.querySelector("#input-general-use"),
    classicalElement: document.querySelector("#input-classical"),
    beleriandElement: document.querySelector("#input-beleriand"),
    annatarElement: document.querySelector("#input-tengwar-annatar"),
    parmaiteElement: document.querySelector("#input-tengwar-parmaite"),
    outputElement: document.querySelector("#output"),
    dividerElement: document.querySelector("#divider"),
    inputBoxElement: document.querySelector("#input-box")
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

    "annatarElement.checked": {
        "<->": "state.font == 'annatar'"
    },
    "parmaiteElement.checked": {
        "<->": "state.font == 'parmaite'"
    },

    "generalUseElement.checked": {
        "<->": "state.mode == 'general-use'"
    },
    "beleriandElement.checked": {
        "<->": "state.mode == 'beleriand'"
    },
    "classicalElement.checked": {
        "<->": "state.mode == 'classical'"
    },

    "inputBoxElement.style.height": {
        "<-": "heightPx"
    },

    "outputElement.innerHTML": {
        "<-": "transcription"
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
            return this.mode.transcribe(
                this.state.q,
                {font: this.font, block: true}
            );
        }
    },

    "searchString": {
        dependencies: ["state.q", "state.mode", "state.font", "state.height"],
        get: function () {
            var string = "?" + QS.stringify(this.state);
            window.history.replaceState(this.state, "", string);
            return string;
        }
    }

});

document.body.classList.add("bootstrap");
setTimeout(function () {
    document.body.classList.remove("bootstrap");
}, 1000);

if (window.location.search) {
    var state = QS.parse(window.location.search.slice(1));
    controller.state = {};
    controller.state.font = state.font;
    controller.state.mode = state.mode;
    controller.state.q = state.q;
    controller.state.height = state.height;
} else {
    controller.state = {
        q: "Mae govannen, Arda!",
        mode: "general-use",
        font: "annatar",
        height: null
    }
}

controller.inputElement.select();

divider.addEventListener("mousedown", function (event) {
    event.preventDefault();
    var start = event.y;
    window.addEventListener("mouseup", mouseup);
    window.addEventListener("mousemove", mousemove);
    function mousemove(event) {
        var end = event.y;
        var delta = end - start;
        var height = parseInt(window.getComputedStyle(controller.inputBoxElement).height, 10);
        start = end;
        controller.state.height = height - delta;
    }
    function mouseup(event) {
        window.removeEventListener("mouseup", mouseup);
        window.removeEventListener("mousemove", mousemove);
    }
});

