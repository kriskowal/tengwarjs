<?php

$wgHooks["ParserFirstCallInit"][] = "wfTengwarInit";

function wfTengwarInit(Parser $parser) {
    $parser->setHook("tengwar", "wfTengwar");
    $parser->setHook("tengwarblock", "wfTengwarBlock");
    return true;
}

function wfTengwar($input, array $args) {
    return wfMakeTengwar($input, $args, "span");
}

function wfTengwarBlock($input, array $args) {
    return wfMakeTengwar($input, $args, "div");
}

function wfMakeTengwar($input, array $args, $tag) {
    $mode = array_key_exists("mode", $args) ? $args["mode"] : "";
    $encoded = array_key_exists("encoded", $args) ? $args["encoded"] : "";
    $bindings = array_key_exists("bindings", $args) ? $args["bindings"] : "(JavaScript required)";
    return
        "<" . $tag . " class=\"tengwar\"" .
        ( $input ? " data-tengwar=\"" .  htmlspecialchars($input) . "\"" : "" ) .
        ( $encoded ? " data-encoded=\"" .  htmlspecialchars($encoded) . "\"" : "" ) .
        ( $mode ? " data-mode=\"" .  htmlspecialchars($mode) . "\"" : "" ) .
        ">" .  htmlspecialchars($bindings) .  "</" . $tag . ">";
}

?>
