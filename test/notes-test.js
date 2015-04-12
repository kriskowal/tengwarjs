
var GeneralUse = require("../general-use");

it("should render green in english with as from two Es", function () {
    var actual = GeneralUse.parse("green", {
        language: "english"
    })[0][0][0][0].map(function (column) {
        return {
            tengwa: column.tengwaNote ? column.tengwaNote.from : "",
            above: column.aboveNote ? column.aboveNote.from : ""
        }
    })
    var expected = [
        {tengwa: "g", above: ""},
        {tengwa: "r", above: ""},
        {tengwa: "e", above: "e"},
        {tengwa: "n", above: ""}
    ];
    expect(actual).toEqual(expected);
});

it("should render green in Sindarin with a long E", function () {
    var actual = GeneralUse.parse("green", {
        language: "sindarin"
    })[0][0][0][0].map(function (column) {
        return {
            tengwa: column.tengwaNote ? column.tengwaNote.from : "",
            above: column.aboveNote ? column.aboveNote.from : ""
        }
    })
    var expected = [
        {tengwa: "g", above: ""},
        {tengwa: "r", above: ""},
        {tengwa: "é", above: ""},
        {tengwa: "n", above: ""}
    ];
    expect(actual).toEqual(expected);
});

