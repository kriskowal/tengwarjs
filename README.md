
This is a Tengwar transcriber suitable for transcribing Sindarin
Elvish from a phonetic encoding of the Latin alphabet, to the General
Use mode of the Tengwar.  It is written in JavaScript and is suitable
for use as:

-   A plain script in a web page, `vanilla-tengwar.min.js`.
-   A CommonJS module as used by Node or Mr, with the NPM package name
    ``tengwar``.

Using the Script
================

The script searches the document for elements with the `tengwar` class.
The class must also include either `parmaite` or `annatar` to select the
rendering font.  This is not merely for the purpose of applying the
appropriate web font, but also instructs the script on which bindings to
use for kerning tehtar.  The body of a `tengwar` class must be rendered
with the included Tengar Annatar variant webfont or Tengwar Parmaitë
using the included `tengwar-annatar.css` or `tengwar-parmaite.css`.

If the element has a `data-tengwar` property, that property is expected
to contain phonetic letters from the latin alphabet and gets transcribed
into bindings for the Tengwar Anntar font in the General Use mode,
popular for Sindarin and English.  The script populates the element's
inner HTML with the font bindings, rendering the desired tengwar text
visible.

    class="tengwar annatar"

If the element has a `data-mode` property, the latin letters
are instead transcribed into key bindings through the
Classical mode, popular for Quenya, or the mode of Beleriand.  Various
options can also be applied.

    data-mode="general-use no-ach-laut reverse-curls"
    data-mode="classical reverse-curls"
    data-mode="beleriand"
    data-mode="general-use black-speech"

If the element has a `data-encoded` property, the value is expected to
be a description of the tengwar and tehtar to display like
`romen:a;ungwe:a;romen:o;numen` for "Aragorn" in the General Use mode.

    data-encoded="romen:a;ungwe:a;romen:o;numen"

Of course, a page can bypass the whole automated transcription process
by statically populating the element with the desired key bindings and
using neither of these data properties.

The script checks for modern browser features and stops if the necessary
features are not present.

Using the Modules
=================

-   `tengwar/general-use` transcribes phonetic latin letters, as Tolkien
    wrote it, into Tengwar Notation in the General Use mode, suitable
    for Sindarin and many other languages.
    -   `transcribe(text, options)` to key bindings for the font.
        Tengwar Annatar by default.
    -   `encode(text, options)` to Tengwar Notation
    -   `parse(text, options)` to Tengwar Object Notation
    -   `makeOptions(options)`
        -   `font` defaults to the TengwarAnnatar module.
        -   `block` whether to include HTML tags for paragraphs and line
            breaks.
        -   `plain` whether to exclude all HTML from the output,
            making it suitable for plain text..
        -   `blackSpeech`: In the Black Speech of the ring inscription,
            the "o" and "u" curls are reversed, medial "r" is ore before
            consonants in addition to final "r", and "sh" and "gh" used
            extended tengwar.  This implies `reverseCurls` and
            `medialOre`.
        -   `doubleNasalsWithTildeBelow`: Many tengwa can be doubled in
            General Use mode by placing a tilde above the tengwa, and
            many tengwa can be prefixed with the sound of the
            corresponding nasal by putting a tilde below the tengwa.
            Tengwar that represent nasal sounds have the special
            distinction that either rule might apply in order to double
            their value.
            -   `false`: by default, a tilde above doubles a nasal
            -   `true`: a tilde below doubles a nasal
        -   `reverseCurls`: In the Black Speech of the ring inscription,
            among other samples, the "o" and "u" tehtar are reversed.
            -   `false`: by default, the "o" tehta curls forward, and
                "u" backward.
            -   `true`: "o" curls backward, "u" forward.
        -   `swapDotSlash`
            -   `false`: by default, "i" is a dot and "e" is a slash.
            -   `true`: "i" is a slash, "e" is a dot.
        -   `noAchLaut`
            -   `false`: by default, "ch" is transcribed as ach-laut,
                the "ch" as in "Bach".  "cc" is transcribed as "ch" as
                in "chew".
            -   `true`: "ch" is interpreted as the "ch" as in "chew".
        -   `isHook`
            -   `false`: by default, "is" is silme-nuquerna with an I
                tehta.
            -   `true`: "is" is a short carrier with an I tehta and S
                hook.

-   `tengwar/classical` transcribes phonetic latin letters into Tengwar
    Notation in the Classical mode, most commonly used for Quenya.
    -   `transcribe(text, options)` to key bindings for the font.
        Tengwar Annatar by default.
    -   `encode(text, options)` to Tengwar Notation
    -   `parse(text, options)` to Tengwar Object Notation
    -   `makeOptions(options)`
        -   `font` defaults to the TengwarAnnatar module.
        -   `block` whether to include HTML tags for paragraphs and line
            breaks.
        -   `plain` whether to exclude all HTML from the output,
            making it suitable for plain text..
        -   `viyla`: In the earlier forms of the mode, the tengwa
            "vilya" represented the sound of the letter V.  The tengwa
            "vala" eventually replaced its role and "vilya" was renamed
            "wilya", and used for the sound of W, consonantal U.
            -   `false`: by default "wilya" serves for W and "vala" for
                V.
            -   `true`: "vilya" serves for V, and W is interpreted as
                the vowel U.
        -   `reverseCurls`: In the Black Speech of the ring inscription,
            among other samples, the "o" and "u" tehtar are reversed.
            -   `false`: by default, the "o" tehta curls forward, and
                "u" backward.
            -   `true`: "o" curls backward, "u" forward.
        -   `iuRising`: In the Third Age, IU is a rising diphthong,
            meaning that the stress is on the second sound.  Whether to
            represent a rising diphthong in the same fashion as other
            diphthongs is a matter of conjecture.
            -   `false`: by default, IU is rendered as the I tehta over
                "ure", the U tehta.
            -   `true`: IU is rendered as the tengwa "anna" with a Y
                tehta below, and a U tehta above.
        -   `classical`: Before the Third Age (as defined by the
            Namarië) transcribers dealt with R and H differently.  R can
            be rendered as either "romen" or "ore", but the rules
            differ.  In the classical period, R is interpreted as "ore"
            only when it appears between vowel sounds.  In the Third
            Age, R is interpreted as "ore" before consonants and at the
            end of words.  The treatment of H is more complex and I have
            only given it a rough draft.
            -   `false`: by default, we transcribe in the pattern of the
                Namarië poem, where "ore" is used finally and before
                consonants.
                -   H is interpreted as "hyarmen".
                -   HY is interpreted as "hyarmen" with the underposed
                    "y" tehta.
                -   HW and WH are interpreted as "hwesta".
                -   CH is interpreted as "harma".
                -   HT is interpreted as "harma" followed by "tinco".
                    Therby, HT implies CHT.
                -   HL is interpreted as "halla" followed by "lambe".
                -   HR is interpreted as "halla" followed by "romen".
            -   `true`: "ore" appears only between vowels.  The
                treatment of "H" depends on whether "harma" has been
                introduced yet.
        -   `harma`: In the Classical period, "hyarmen" implied the
            following-Y.  Then "hyarmen" served as breath-H medially,
            and "harma" served as breath-H initially and was renamed
            "aha" in that role.
            -   `false`: by default
                -   H is interpreted as "halla" in all positions
                -   HY is interpreted as "hyarmen" with underposed "y".
                -   HT still implies CHT so treated as "harma" as above.
                -   CH, HL, HR, and HW (and WH) are not affected.
            -   `true`: the oldest form of the mode
                -   H initial is interpreted as "harma"
                -   H medial is interpreted as "hyarmen"
                -   HY is interpreted as "hyarmen"
                -   HT still implies CHT so treated as "harma" as above.
                -   CH, HL, HR, and HW (and WH) are not affected.

-   `tengwar/beleriand`: transcribes phonetic latin letters into Tengwar
    Notation in the mode of Beleriand, which is suitable for Sindarin
    and uses full tengwar for most vowels, instead of tehtar.
    -   `transcribe(text, options)` to key bindings for the font.
        Tengwar Annatar by default.
    -   `encode(text, options)` to Tengwar Notation
    -   `parse(text, options)` to Tengwar Object Notation
    -   `makeOptions(options)`
        -   `font` defaults to the TengwarAnnatar module.
        -   `block` whether to include HTML tags for paragraphs and line
            breaks.
        -   `plain` whether to exclude all HTML from the output,
            making it suitable for plain text..

-   `tengwar/tengwar-annatar`: Translates Tengwar Object Notation into
    key bindings for Johan Winge’s Tengwar Annatar font.  Provides the
    `makeColumn` primitive which is aware of how a column of tengwar and
    tehtar can transform to accommodate additional tehtar with this
    font.
    -   `transcribe(tengwarObjectNotation, options)`: to Tengwar Annatar key
        bindings
        -   `plain`: plain text, no markup
        -   `block`: block markup, with paragraph and line break tags
    -   `makeColumn(tengwa, above, below)`
        -   `canAddAbove()`
        -   `addAbove(tehta)`
        -   `canAddBelow()`
        -   `addBelow(below)`
        -   `addFollowing(following)`
        -   `addTildeAbove()`
        -   `addTildeBelow()`
        -   `addError(error)`
-   `notation`
    -   `encode(tengwarObjectNotation)`: to Tengwar Notation
    -   `decode(tengwarNotation, makeColumn)`: to Tengwar Object
        Notation.
    -   `decodeWord(tengwarNotation makeColumn)`: to Tengwar Object
        Notation for just one word (no nested arrays).

## Tengwar Notation

Tengwar Notation is useful for succinctly representing the first stage
of transcription, before translation to key bindings for a particular
font.  The notation uses the names of the tengwa followed by a list of
tehtar in a consistent order:

-   *column* =
    -   *tengwa*
    -   ":" if there are any following tehtar
    -   *tehtar* delimited by ","
        -   *tehta above* if applicable
        -   *tehta below* if applicable
        -   *following tehta* if applicable
        -   "tilde-above" if applicable
        -   "tilde-below" if applicable
-   *word* = *column* delimited by ";"
-   *sentence* = *word* delimited by " "
-   *stanza* = *sentence* delimited by "\n"
-   *paragraph* = *stanza* delimited by "\n\n"
-   *section* = *paragraph* delimited by "\n\n\n+"

The notation is useful for manually describing a transcription, either
to override the transcriber, or for testing a transcriber.

## Tengwar Object Notation

Tengwar Object Notation represents a word of Tengwar as an array of
objects.  Each object has properties,

-   `tengwa` the name of one of the tengwar or punctuation mark in my
    obtuse pidgin of punctuation names: "comma", "full-stop",
    "exclamation-point", "question-mark", "open-paren", "close-paren",
    "flourish-left", or "flourish-right".  "vilya" is always represented
    as "wilya" and "aha" is always "harma", regardless of what name is
    appropriate for the mode.
-   `above` may be a tehta including "a", "e", "i", "o", "u", "ó", or
    "ú".  Note that "á", "é", and "í" are not supported diacritics.
-   `below` may be "y".
-   `following` a tehta like "s", "s-inverse", "s-extended", or
    "s-flourish".
-   `tilde-above` boolean.
-   `tilde-below` boolean.

Words are wrapped in an array to make a sentence.  Sentences are wrapped
to make paragraphs.  Paragraphs are wrapped to make sections.  Somehow
I’ve neglected stanzas within paragraphs.  This will be remedied in a
future version, and the nodes will probably be revised to be more
sophisticated than merely nested arrays.

A font module must have a `makeColumn` function that produces objects
with these properties and the attendant methods as described for the
Tengwar Annatar module above.

The Legacy Module
=================

The `tengwar` module includes:

-   ``transcribe(latin)`` returns a string of characters encoded for the
    custom Tengwar Annatar font included.  Paragraphs and sections are
    encoded with new lines.
-   ``transcribeHtml(latin)`` returns a string of HTML.  Stanzas,
    paragraphs, and sections are encoded with HTML tags, ``br`` and
    ``p``.
-   ``annotate(latin)`` returns a multi-dimensional array that describes
    the phoneme produced by each character and diacritic of the
    corresponding elvish.
-   ``annotateHtml(latin)`` returns an HTML table of the annotation
    data.

When used as a script, the API is planted in a ``tengwar`` global
variable.

If used as a jQuery plugin, you can use the "tengwar" method to
transcribe the contents of selected tags and add the "tengwar" class
to successfully transcribed tags.

    $(".transcribe-tengwar").tengwar();

Be sure to use the included web font, derrived from Johan Winge's
Tengwar Annatar.  It is customized for this web-deployed transcriber.

If used as a Node module, the ``tengwar`` module exports the API.

