
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var Beleriand = require("./beleriand");
var TengwarAnnatar = require("./tengwar-annatar");
var TengwarParmaite = require("./tengwar-parmaite");
var modes = require("./modes");
var detectWebFont = require("./detect-web-font");

var array_ = Array.prototype;

if (typeof document !== "undefined") {
    if (document.readyState === "complete") {
        onload();
    } else {
        document.addEventListener("DOMContentLoaded", onload, true);
    }
    detectWebFont(onfontcheck);
}

var loaded;
function onload() {
    loaded = true;
    progress();
}

var webfontDetected;
function onfontcheck(detected) {
    if (detected) {
        webfontDetected = true;
        progress()
    } else {
        onnowebfont();
    }
}

function onnowebfont() {
    if (!supportedBrowser())
        return;
    var elements = document.querySelectorAll(".tengwar");
    array_.forEach.call(elements, function (element) {
        element.classList.add("error");
        element.innerHTML = "Cannot render because WebFonts are not available in this browser.";
    });
}

function supportedBrowser() {
    if (!document.body.classList || !document.querySelectorAll || !array_.forEach) {
        return;
    }
    return true;
}

function onoldbrowser() {
    if (!document.body.classList || !document.querySelectorAll || !array_.forEach)
        return;
}

function progress() {
    if (loaded === void 0 || webfontDetected === void 0)
        return;
    if (!supportedBrowser())
        return;
    var elements = document.querySelectorAll(".tengwar");
    array_.forEach.call(elements, function (element) {
        setTimeout(function () {
            var data = element.dataset;
            var tengwar, mode, font, encoding, block;
            block = element.tagName.toLowerCase() !== "span";
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
                element.classList.add("rendered");
            } else if (tengwar) {
                font = element.classList.contains("parmaite") ? TengwarParmaite : TengwarAnnatar;
                var flags = mode.split(/\s+/);
                var mode = flags.shift();
                var Mode = modes[mode] || GeneralUse;
                var options = Mode.makeOptions();
                flags.forEach(function (flag) {
                    flag = flag.replace(/\-(\w)/g, function ($, $1) {
                        return $1.toUpperCase();
                    });
                    options[flag] = true;
                });
                options.block = block;
                options.font = font;
                element.innerHTML = Mode.transcribe(tengwar, options);
                element.classList.add("rendered");
            }
        }, 0);
    });
}

