
module.exports = makeParserFromTrie;
function makeParserFromTrie(trie, makeProducer, callback, fallback) {
    var children = {};
    var characters = Object.keys(trie.children);
    characters.forEach(function (character) {
        children[character] = makeParserFromTrie(
            trie.children[character],
            makeProducer,
            callback,
            fallback
        );
    });
    var producer;
    if (trie.value) {
        producer = makeProducer(trie.value);
    }
    return characters.reduceRight(function (next, expected) {
        return function (state) {
            return function (character) {
                if (character === expected) {
                    return callback(children[character](state));
                } else {
                    return next(state)(character);
                }
            };
        };
    }, function (state) {
        if (producer) {
            return callback(producer(state));
        } else {
            return fallback(state);
        }
    });
}

