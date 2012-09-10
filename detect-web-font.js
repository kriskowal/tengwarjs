
/*!
 * isFontFaceSupported - v0.9 - 12/19/2009
 * http://paulirish.com/2009/font-face-feature-detection/
 *
 * Copyright (c) 2009 Paul Irish
 * MIT license
 */

module.exports = (function makeDetectWebFont() {

    var fontret,
        fontfaceCheckDelay = 100;

        // IE supports EOT and has had EOT support since IE 5.
        // This is a proprietary standard (ATOW) and thus this off-spec,
        // proprietary test for it is acceptable.
    if (!(!/*@cc_on@if(@_jscript_version>=5)!@end@*/0)) fontret = true;

    else {

    // Create variables for dedicated @font-face test
      var doc = document, docElement = doc.documentElement,
          st  = doc.createElement('style'),
          spn = doc.createElement('span'),
          wid, nwid, body = doc.body,
          callback, isCallbackCalled;

      // The following is a font, only containing the - character. Thanks Ethan Dunham.
      st.textContent = "@font-face{font-family:testfont;src:url(data:font/opentype;base64,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)}";
      doc.getElementsByTagName('head')[0].appendChild(st);


      spn.setAttribute('style','font:99px _,serif;position:absolute;visibility:hidden');

      if  (!body){
        body = docElement.appendChild(doc.createElement('fontface'));
      }

      // the data-uri'd font only has the - character
      spn.innerHTML = '-------';
      spn.id        = 'fonttest';

      body.appendChild(spn);
      wid = spn.offsetWidth;

      spn.style.font = '99px testfont,_,serif';

      // needed for the CSSFontFaceRule false positives (ff3, chrome, op9)
      fontret = wid !== spn.offsetWidth;

      var delayedCheck = function(){
        if (isCallbackCalled) return;
        fontret = wid !== spn.offsetWidth;
        callback && (isCallbackCalled = true) && callback(fontret);
      }

      addEventListener('load',delayedCheck,false);
      setTimeout(delayedCheck,fontfaceCheckDelay);
    }

    function ret(){  return fontret || wid !== spn.offsetWidth; };

    // allow for a callback
    return function (fn) {
      (isCallbackCalled || fontret) ? fn(fontret) : (callback = fn);
    };

})();
