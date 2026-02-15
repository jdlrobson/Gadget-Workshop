const { MODE_ADD } = require( './mode.js' );
const {
    EDITOR_MINOR_EDIT_SELECTOR,
    EDITOR_SUMMARY_SELECTOR
} = require( './selectors.js' );
const getListingInfo = require( './getListingInfo.js' );
const listingToStr = require( './listingToStr.js' );
const updateSectionTextWithEditedListing = require( './updateSectionTextWithEditedListing.js' );
const updateSectionTextWithAddedListing = require( './updateSectionTextWithAddedListing.js' );
const saveForm = require( './saveForm.js' );
const editSummarySection = require( './editSummarySection.js' );
const { getConfig } = require( './Config.js' );

/**
 * Convert the listing editor form entry fields into wiki text. This
 * method converts the form entry fields into a listing template string,
 * replaces the original template string in the section text with the
 * updated entry, and then submits the section text to be saved on the
 * server.
 *
 * @return {JQuery.Ajax}
 */
const formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
    const { LISTING_TYPE_PARAMETER, DEFAULT_LISTING_TEMPLATE } = getConfig();
    var listing = listingTemplateAsMap;
    var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
    var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
    var listingType = $(`#${listingTypeInput}`).val();
    var listingParameters = getListingInfo(listingType);
    for (var parameter in listingParameters) {
        let $node = $(`#${listingParameters[parameter].id}`);
        // do not drop custom fields that were in the original listing
        if ( $node.length ) {
            listing[parameter] = $node.val() || '';
        }
    }
    var text = listingToStr(listing);
    var summary = editSummarySection();
    if (mode == MODE_ADD) {
        summary = updateSectionTextWithAddedListing(summary, text, listing);
    } else {
        summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
    }
    summary += $("#input-name").val();
    if ($(EDITOR_SUMMARY_SELECTOR).val() !== '') {
        summary += ` - ${$(EDITOR_SUMMARY_SELECTOR).val()}`;
    }
    var minor = $(EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;
    return saveForm(summary, minor, sectionNumber, '', '');
};

module.exports = formToText;
