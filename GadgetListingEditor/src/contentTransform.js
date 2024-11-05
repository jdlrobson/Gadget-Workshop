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
                $(this).nextUntil(".mw-heading1, .mw-heading2").addBack().wrapAll('<div class="mw-h2section" />');
            });
        } else {
            $('#bodyContent').find('h2').each(function(){
                $(this).nextUntil("h1, h2").addBack().wrapAll('<div class="mw-h2section" />');
            });
        }
    }
    if ( isNewMarkup ) {
        $('#bodyContent').find('.mw-heading3').each(function(){
            $(this).nextUntil(".mw-heading1,.mw-heading2,.mw-heading3").addBack().wrapAll('<div class="mw-h3section" />');
        });
    } else {
        $('#bodyContent').find('h3').each(function(){
            $(this).nextUntil("h1, h2, h3").addBack().wrapAll('<div class="mw-h3section" />');
        });
    }
};

const insertAddListingBracketedLink = ( addMsg ) => {
    return `<a role="button" href="javascript:" class="listingeditor-add listingeditor-add-brackets">${addMsg}</a>`
};

const insertAddListingIconButton = ( addMsg ) => {
return `<button class="listingeditor-add cdx-button cdx-button--size-large cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet">
    <span class="minerva-icon minerva-icon--addListing"></span>
    <span>${addMsg}</span>
</button>`
};

/**
 * Utility function for appending the "add listing" link text to a heading.
 */
const insertAddListingPlaceholder = function(parentHeading, addMsg = '', useButton = false ) {
    const $pheading =  $(parentHeading);
    const $headline = $(parentHeading).find( '.mw-headline' );
    const editSection = $headline.length ? $headline.next('.mw-editsection') : $pheading.next( '.mw-editsection');
    const btn = useButton ?
        insertAddListingIconButton( addMsg ) :
        insertAddListingBracketedLink( addMsg );
    editSection.append( btn );
};

const getHeading = ( sectionId ) => {
    // do not search using "#id" for two reasons. one, the article might
    // re-use the same heading elsewhere and thus have two of the same ID.
    // two, unicode headings are escaped ("è" becomes ".C3.A8") and the dot
    // is interpreted by JQuery to indicate a child pattern unless it is
    // escaped
    const $nodeWithId = $(`[id="${sectionId}"]`);
    if ( $nodeWithId.is( 'h2' )  ) {
        return $nodeWithId;
    } else {
        return $nodeWithId.closest( 'h2' );
    }
};

const getSectionElement = ( $headingElement ) => {
    if ( $headingElement.is( '.section-heading' ) ) {
        return $headingElement.next( 'section.mw-h2section' );
    } else {
        return $headingElement.closest( 'div.mw-h2section, section' );
    }
};

/**
 * Place an "add listing" link at the top of each section heading next to
 * the "edit" link in the section heading.
 */
const addListingButtons = function( SECTION_TO_TEMPLATE_TYPE, addMsg = '' ) {
    const useButton = mw.config.get( 'skin' ) === 'minerva';
    for (let sectionId in SECTION_TO_TEMPLATE_TYPE) {
        const topHeading = getHeading( sectionId );
        if (topHeading.length) {
            insertAddListingPlaceholder(topHeading, addMsg);
            const parentHeading = getSectionElement( topHeading );
            $('h3', parentHeading).each(function() {
                insertAddListingPlaceholder(this, addMsg, useButton );
            });
        }
    }
};

module.exports = {
    addListingButtons,
    wrapContent,
    insertAddListingPlaceholder
};
