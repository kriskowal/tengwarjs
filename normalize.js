
module.exports = function normalize(text) {
    // normalize
    return text.replace(normalFormsRe, function ($, key) {
        return normalForms[key];
    });
};

var normalForms = {
    "k": "c",
    "x": "cs",
    "qu": "cw",
    "q": "cw",
    "ph": "f",
    "bh": "v",
    "ë": "e",
    "â": "á",
    "ê": "é",
    "î": "í",
    "ô": "ó",
    "û": "ú"
};

var normalFormsRe = new RegExp("(" +
    Object.keys(normalForms).join("|") +
")", "ig");


