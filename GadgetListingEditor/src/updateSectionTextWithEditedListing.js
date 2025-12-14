const { translate } = require( './translate.js' );
const restoreComments = require( './restoreComments.js' );
const replaceSpecial = require( './replaceSpecial.js' );
const { getSectionText, setSectionText } = require( './currentEdit.js' );
const { EDITOR_CLOSED_SELECTOR } = require( './selectors.js' );

/**
 * After the listing has been converted to a string, add additional
 * processing required for edits (as opposed to adds), returning an
 * appropriate edit summary string.
 */
const updateSectionTextWithEditedListing = function(editSummary, listingWikiText, listingTemplateWikiSyntax) {
    let sectionText = getSectionText();
    // escaping '$&' since in replace regex it means "substitute the whole content"
    listingWikiText = listingWikiText.replace( /\$&/g, '&#36;&');
    if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
        listingWikiText = '';
        editSummary += translate( 'removed' );
        // TODO: RegEx change to delete the complete row when listing is preceeded by templates showing just icons
        var listRegex = new RegExp(`(\\n+[\\:\\*\\#]*)?\\s*${replaceSpecial(listingTemplateWikiSyntax)}`);
        sectionText = sectionText.replace(listRegex, listingWikiText);
    } else {
        editSummary += translate( 'updated' );
        sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
    }
    sectionText = restoreComments(sectionText, true);
    sectionText = sectionText.replace( /&#36;/g, '$' ); // '&#36;'->'$' restore on global sectionText var
    setSectionText( sectionText );
    return editSummary;
};

module.exports = updateSectionTextWithEditedListing;
