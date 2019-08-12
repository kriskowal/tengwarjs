
var Alphabet = require("../alphabet");

module.exports = function tengwarTehtarCombinations(font, fontClass) {
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

