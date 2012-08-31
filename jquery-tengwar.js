
var GeneralUse = require("./general-use");
var Classical = require("./classical");
var TengwarAnnatar = require("./tengwar-annatar");

$(function () {
    $(".tengwar").each(function () {
        var that = jQuery(this);
        var data = that.data();
        if (data.encoding) {
            that.html(TengwarAnnatar.transcribe(data.enconding));
        } else if (data.tengwar) {
            var mode = data.mode || 'general-use';
            var Mode = mode === 'general-use' ? GeneralUse : Classical;
            that.html(Mode.transcribe(data.tengwar));
        }
    });
});

