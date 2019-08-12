
(
    echo '(function () {'
    closure --process_common_js_modules \
        --common_js_entry_module tengwar.js \
        --js \
            tengwar.js \
            modes.js \
            general-use.js \
            classical.js \
            beleriand.js \
            fonts.js \
            tengwar-annatar.js \
            tengwar-parmaite.js \
            dan-smith.js \
            column.js \
            alphabet.js \
            punctuation.js \
            numbers.js \
            notation.js \
            normalize.js \
            parser.js \
            document-parser.js \
            trie.js \
            trie-parser.js \
            detect-web-font.js

    echo '})();'
) | closure > tengwar.min.js

wc -c tengwar.min.js
cat tengwar.min.js | gzip | wc -c

