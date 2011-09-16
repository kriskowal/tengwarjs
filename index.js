(function () {

    var input = $("#input");
    var output = $("#output");

    function update() {
        var val = input.val();
        output.html(tengwar.transcribeHtml(val));
        location.hash = "#" + encodeURIComponent(val);
        input.css({
            // trixsy math coupled too strongly to font
            // metrics on my own machine, but working
            "height": (val.split("\n").length * 1.164 + 0.3) + "em"
        })
    }

    if (location.hash) {
        input.val(decodeURIComponent(location.hash.slice(1)));
    }

    input.keyup(update);
    input.keydown(update);
    output.tengwar();
    update();

    input.select();

})();
