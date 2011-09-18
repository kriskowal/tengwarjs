
This is a Tengwar transcriber suitable for transcribing Sindarin
Elvish from a phonetic encoding of the Latin alphabet, to the General
Use mode of the Tengwar.  It is written in JavaScript and is suitable
for use as:

-   A plain script in a web page.
-   A jQuery plugin.
-   A CommonJS module as used by Node, with the NPM package name
    ``tengwar``.
-   A RequireJS script as used by Dojo and others.

The script depends on a shimmable subset of ECMAScript 5.  You might
benefit from using ES5 Shim if you're deploying to older browsers.
<https://github.com/kriskowal/es5-shim>

The API includes:

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

