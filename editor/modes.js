
require("frb/dom");
var Bindings = require("frb");
var QS = require("qs");
var fonts = require("tengwar/fonts");
var modes = require("tengwar/modes");

var inputState;
if (window.location.search) {
    inputState = QS.parse(window.location.search.slice(1));
} else {
    inputState = {
        q: "",
        mode: "general-use",
        font: "annatar",
        height: void 0
    }
}

if (inputState.q === "Mae govannen, Arda!") {
    inputState.q = "";
}
inputState.options = inputState.options || [];

var traceAll = false;

var $ = document.querySelector.bind(document);
var $$ = document.querySelectorAll.bind(document);

function TengwarComponent(element, state) {

    // extract options from the mode string
    var flags = element.dataset.mode.split(" ");
    flags.shift();
    var options = {};
    flags.forEach(function (flag) {
        flag = flag.replace(/\-(\w)/g, function ($, $1) {
            return $1.toUpperCase();
        });
        options[flag] = true;
    });

    Bindings.create(null, {
        input: element.dataset.tengwar,
        element: element,
        options: options,
        state: state
    }, {

        "element.classList.*": {
            "<-": "('tengwar', state.font, state.mode, 'rendered')"
        },

        "mode": {
            "args": ["state.mode"],
            "compute": function (mode) {
                return modes[mode];
            }
        },

        "options.font": {
            "args": ["state.font"],
            "compute": function (font) {
                return fonts[font];
            }
        },

        "element.innerHTML": {
            "args": ["options.font", "mode", "input", "options"],
            "compute": function (font, mode, input, options) {
                var options = mode.makeOptions(options);
                return mode.transcribe(input, options);
            }
        }

    });
}


// these bindings arrange for all tengwar to be rendered once
Array.prototype.forEach.call($$(".dynamic-tengwar"), function (element) {
    TengwarComponent(element, {
        font: element.dataset.font,
        mode: element.dataset.mode.split(" ")[0]
    });
});

function Button(element, state) {
    element.addEventListener("click", function (event) {
        event.stopPropagation();
        event.preventDefault();
        state.options.sort();
        window.location = "index.html?" + QS.stringify(state);
    });
}

var states = {};
// these bindings coordinate the font of all the tengwar examples in each section
["general-use", "classical", "beleriand"].forEach(function (mode) {

    var state = {
        q: "",
        font: "parmaite",
        mode: mode,
        options: []
    };
    states[mode] = state;

    Array.prototype.forEach.call($$("." + mode + "-font"), function (element) {
        TengwarComponent(element, state);
    });

    Bindings.create(null, {
        parmaite: document.getElementById(mode + "-font-parmaite"),
        annatar: document.getElementById(mode + "-font-annatar"),
        state: state
    }, {
        "state.font = 'parmaite'": {"<->": "parmaite.checked"},
        "state.font = 'annatar'": {"<->": "annatar.checked"}
    });

    Button(document.getElementById(mode + "-button"), state);

});

// template modes

Button(document.getElementById("kings-letter-general-use-button"), {
    q: document.getElementById("kings-letter-general-use-tengwar").dataset.tengwar,
    font: "parmaite",
    mode: "general-use",
    options: []
});

Button(document.getElementById("kings-letter-beleriand-button"), {
    q: document.getElementById("kings-letter-beleriand-tengwar").dataset.tengwar,
    font: "parmaite",
    mode: "beleriand",
    options: []
});

Button(document.getElementById("doors-of-durin-button"), {
    q: document.getElementById("doors-of-durin-tengwar").dataset.tengwar,
    font: "parmaite",
    mode: "beleriand",
    options: []
});

Button(document.getElementById("black-speech-button"), {
    q: document.getElementById("black-speech-tengwar").dataset.tengwar,
    font: "annatar",
    mode: "general-use",
    options: ["black-speech"]
});

Button(document.getElementById("namarie-button"), {
    q: document.getElementById("namarie-tengwar").dataset.tengwar,
    font: "parmaite",
    mode: "classical",
    options: []
});

// boolean options
[

    // general use
    {
        "mode": "general-use",
        "option": "double-nasals-with-tilde-below",
        "on": "general-use-nasal-below",
        "off": "general-use-nasal-above"
    },
    {
        "mode": "general-use",
        "option": "reverse-curls",
        "on": "general-use-reverse-curls",
        "off": "general-use-normal-curls"
    },
    {
        "mode": "general-use",
        "option": "swap-dot-slash",
        "on": "general-use-slash-dot",
        "off": "general-use-dot-slash"
    },
    {
        "mode": "general-use",
        "option": "medial-ore",
        "on": "general-use-medial-ore",
        "off": "general-use-no-medial-ore"
    },
    {
        "mode": "general-use",
        "option": "no-ach-laut",
        "on": "general-use-no-ach-laut",
        "off": "general-use-ach-laut"
    },
    {
        "mode": "general-use",
        "option": "s-hook",
        "on": "general-use-s-hook",
        "off": "general-use-no-s-hook"
    },
    {
        "mode": "general-use",
        "option": "tsdz",
        "on": "general-use-tsdz",
        "off": "general-use-no-tsdz"
    },
    {
        "mode": "general-use",
        "option": "duodecimal",
        "on": "general-use-duodecimal",
        "off": "general-use-decimal"
    },

    // classical
    {
        "mode": "classical",
        "option": "reverse-curls",
        "on": "classical-reverse-curls",
        "off": "classical-normal-curls"
    },
    {
        "mode": "classical",
        "option": "swap-dot-slash",
        "on": "classical-slash-dot",
        "off": "classical-dot-slash"
    },
    {
        "mode": "classical",
        "option": "vilya",
        "on": "classical-vilya",
        "off": "classical-wilya"
    },
    {
        "mode": "classical",
        "option": "classical-r",
        "on": "classical-r-classical",
        "off": "classical-r-modern"
    },
    {
        "mode": "classical",
        "option": "iu-rising",
        "on": "classical-iu-rising",
        "off": "classical-iu-falling"
    },
    {
        "mode": "classical",
        "option": "duodecimal",
        "on": "classical-duodecimal",
        "off": "classical-decimal"
    },

    // mode of beleriand
    {
        "mode": "beleriand",
        "option": "duodecimal",
        "on": "beleriand-duodecimal",
        "off": "beleriand-decimal"
    }

].forEach(function (flag) {
    Bindings.create(null, {
        option: flag.option,
        off: $("#" + flag.off),
        on: $("#" + flag.on),
        state: states[flag.mode]
    }, {
        "!state.options.has(option)": {
            "<->": "off.checked",
            trace: traceAll
        },
        "state.options.has(option)": {
            "<->": "on.checked",
            trace: traceAll
        }
    });
});

// special multi-way binding for treatment of H
Bindings.create(null, {
    halla: $("#classical-period-halla"),
    aha: $("#classical-period-aha"),
    hyarmen: $("#classical-period-hyarmen"),
    state: states.classical
}, {
    "!state.options.has('classical-h')": {
        "<->": "hyarmen.checked",
        trace: traceAll
    },
    "state.options.has('classical-h')": {
        "<-": "halla.checked || aha.checked",
        trace: traceAll
    },
    "!state.options.has('harma')": {
        "<-": "halla.checked || hyarmen.checked",
        trace: traceAll
    },
    "state.options.has('harma')": {
        "<->": "aha.checked",
        trace: traceAll
    }
});

// assert initial state
["general-use", "classical", "beleriand"].forEach(function (mode) {
    var state = states[mode];
    state.q = inputState.q || "";
    state.options.swap(0, states[mode].options.length, inputState.options.filter(function (option) {
        return option && option !== "undefined";
    }));
});

