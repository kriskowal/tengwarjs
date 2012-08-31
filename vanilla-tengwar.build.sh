
(
    echo '(function () {'
    closure --process_common_js_modules \
        --common_js_entry_module vanilla-tengwar.js \
        --js \
            vanilla-tengwar.js \
            general-use.js \
            classical.js \
            tengwar-annatar.js \
            parser.js \
            normalize.js \
            punctuation.js
    echo '})();'
) | closure > vanilla-tengwar.min.js

wc -c vanilla-tengwar.min.js
cat vanilla-tengwar.min.js | gzip | wc -c

