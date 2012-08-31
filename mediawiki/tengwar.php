<?php

$wgHooks["ParserFirstCallInit"][] = "wfTengwarInit";

function wfTengwarInit(Parser $parser) {
    $parser->setHook("tengwar", "wfTengwar");
    return true;
}
function wfTengwar($input, array $args) {
    $mode = array_key_exists("mode", $args) ? $args["mode"] : "";
    $encoded = array_key_exists("encoded", $args) ? $args["encoded"] : "";
    $bindings = array_key_exists("bindings", $args) ? $args["bindings"] : "(JavaScript required)";
    return "<span class=\"tengwar\" data-tengwar=\"" .
        htmlspecialchars($input) .
        "\" data-encoded=\"" .
        htmlspecialchars($encoded) .
        "\" data-mode=\"" .
        htmlspecialchars($mode) .
        "\" >" .  htmlspecialchars($bindings) . "</span>";
}

?>
