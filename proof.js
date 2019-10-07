
function equals(name, expected, actual, errata) {
    if (expected === actual) {
        return `<div class="case pass">
            <tt>${name} <strong>input</strong></tt><br>
            <tt>${expected} <strong>output</strong></tt>
            ${errata}
        </div>`
    }
    return `<div class="case fail">
        ${name}
        <ul>
            <tt>${expect}</tt> expected<br>
            <tt>${actual}</tt> actual
        </ul>
    </div>`;
}

var Beleriand = require("./beleriand");
var beleriandTests = require("./test/beleriand");

document.querySelector("#beleriand").innerHTML = Object.entries(beleriandTests).map(function ([input, expected]) {
    var actual = Beleriand.encode(input, {});
    return equals(input, expected, actual, `<br>
        <span class="rendered tengwar parmaite">${Beleriand.transcribe(input, {})}</span>
    `);
}).join("");

var Alphabet = require("./alphabet");
var TengwarParmaite = require("./tengwar-parmaite");
var TengwarAnnatar = require("./tengwar-annatar");

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
    var tehta = font.tehtaForTengwa(tengwa, tehta);
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

document.querySelector("#parmaite").innerHTML = tengwarTehtarCombinations(TengwarAnnatar, "parmaite");
document.querySelector("#annatar").innerHTML = tengwarTehtarCombinations(TengwarParmaite, "annatar");
