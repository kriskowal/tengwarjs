// Compiles to public/proof.js

let Alphabet = require("./alphabet");
let TengwarParmaite = require("./tengwar-parmaite");
let TengwarAnnatar = require("./tengwar-annatar");

let classical = require("./classical");
let beleriand = require("./beleriand");
let generalUse = require("./general-use");

let generalUseTests = require("./test/general-use");
let classicalTests = require("./test/classical");
let beleriandTests = require("./test/beleriand");

let pass = true;

function equals(name, expected, actual, errata) {
    if (expected === actual) {
        return `<div class="case pass">
            <tt>${name} <strong>input</strong></tt><br>
            <tt>${expected} <strong>output</strong></tt>
            ${errata}
        </div>`
    }
    pass = false;
    return `<div class="case fail">
        ${name}
        <ul>
            <tt>${expected}</tt> expected<br>
            <tt>${actual}</tt> actual
        </ul>
    </div>`;
}


for (let [language, cases] of Object.entries(generalUseTests)) {
    document.querySelector("#" + language + "GeneralUse").innerHTML = Object.entries(cases).map(function ([input, expected]) {
        let actual = generalUse.encode(input, {language});
        let font = language === "blackSpeech" ? "annatar" : "parmaite";
        return equals(input, expected, actual, `<br>
            <span class="rendered tengwar ${font}">${generalUse.transcribe(input, {language})}</span>
        `);
    }).join("");
}

document.querySelector("#classical").innerHTML = Object.entries(classicalTests).map(function ([input, expected]) {
    let actual = classical.encode(input, {});
    return equals(input, expected, actual, `<br>
        <span class="rendered tengwar parmaite">${classical.transcribe(input, {})}</span>
    `);
}).join("");

document.querySelector("#beleriand").innerHTML = Object.entries(beleriandTests).map(function ([input, expected]) {
    let actual = beleriand.encode(input, {});
    return equals(input, expected, actual, `<br>
        <span class="rendered tengwar parmaite">${beleriand.transcribe(input, {})}</span>
    `);
}).join("");

function tengwarTehtarCombinations(font, fontClass) {
    return Alphabet.tehtar.map(function (tehta) {
        return "<table align=\"left\"><caption><a name=\"" + tehta + "\" href=\"#" + encodeURIComponent(tehta) + "\">" + tehta + "</a></caption>" +
            Alphabet.tengwar.map(function (row) {
                return "<tr><td>" + row.map(function (name) {
                    return (
                        "<span class=\"rendered tengwar " + fontClass + "\">" +
                        tengwaTehtaPairDisplay(font, name, tehta) +
                        "</span>"
                    );
                }).join("</td><td>") + "</td></tr>";
            }).join("</tr><tr>") +
        "</tr></table></a>";
    }).join(" ");
};

function tengwaTehtaPairDisplay(font, tengwa, tehta) {
    tehta = font.tehtaForTengwa(tengwa, tehta);
    if (!tehta) {
        return (
            "<span style=\"color: #ddd\">" +
            font.tengwar[tengwa] +
            "</span>"
        );
    } else {
        return font.tengwar[tengwa] + tehta;
    }
}

document.querySelector("#parmaite").innerHTML = tengwarTehtarCombinations(TengwarParmaite, "parmaite");
document.querySelector("#annatar").innerHTML = tengwarTehtarCombinations(TengwarAnnatar, "annatar");

let summary = document.querySelector("#summary");
if (pass) {
    summary.innerHTML = "All automated tests passed. Please review font rendering and the tengwar to tehtar matching tables if your changes are likely to affect their correctness.";
    summary.classList.remove("fail");
    summary.classList.add("pass");
} else {
    summary.innerHTML = "Some automated tests failed. Please review the failed tests.";
}
