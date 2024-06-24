/**
 * Wrap the h2/h3 heading tag and everything up to the next section
 * (including sub-sections) in a div to make it easier to traverse the DOM.
 * This change introduces the potential for code incompatibility should the
 * div cause any CSS or UI conflicts.
 */
const wrapContent = function() {
    var isNewMarkup = $( '.mw-heading').length > 0;
    // No need to wrap with ?useparsoid=1&safemode=1
    if ( $( 'section .mw-heading3, section .mw-heading2' ).length ) {
        return;
    }
    // MobileFrontend use-case
    if ( $( '.mw-parser-output > h2.section-heading' ).length ) {
        $( '.mw-parser-output > section' ).addClass( 'mw-h2section' );
    } else {
        if ( isNewMarkup ) {
            $('#bodyContent').find('.mw-heading2').each(function(){
                $(this).nextUntil(".mw-heading").addBack().wrapAll('<div class="mw-h2section" />');
            });
        } else {
            $('#bodyContent').find('h2').each(function(){
                $(this).nextUntil("h1, h2").addBack().wrapAll('<div class="mw-h2section" />');
            });
        }
    }
    if ( isNewMarkup ) {
        $('#bodyContent').find('.mw-heading3').each(function(){
            $(this).nextUntil(".mw-heading").addBack().wrapAll('<div class="mw-h3section" />');
        });
    } else {
        $('#bodyContent').find('h3').each(function(){
            $(this).nextUntil("h1, h2, h3").addBack().wrapAll('<div class="mw-h3section" />');
        });
    }
};

module.exports = {
    wrapContent
};
