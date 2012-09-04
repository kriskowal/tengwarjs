
(
    echo '(function () {'
    closure --process_common_js_modules \
        --common_js_entry_module vanilla-tengwar.js \
        --js \
            vanilla-tengwar.js \
            modes.js \
            general-use.js \
            classical.js \
            beleriand.js \
            fonts.js \
            tengwar-annatar.js \
            tengwar-parmaite.js \
            dan-smith.js \
            alphabet.js \
            punctuation.js \
            numerals.js \
            notation.js \
            normalize.js \
            parser.js \
            document-parser.js \
            trie.js \
            trie-parser.js

    echo '})();'
) | closure > vanilla-tengwar.min.js

wc -c vanilla-tengwar.min.js
cat vanilla-tengwar.min.js | gzip | wc -c

