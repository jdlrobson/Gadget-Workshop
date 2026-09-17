// selector that identifies the edit link as created by the
// addEditButtons() function
const EDIT_LINK_SELECTOR = '.vcard-edit-button';

/**
 * Given an edit link that was clicked for a listing, determine what index
 * that listing is within a section. First listing is 0, second is 1, etc.
 *
 * @param {JQuery} sectionHeading
 * @param {JQuery} clicked
 */
const findListingIndex = function(sectionHeading, clicked) {
    var count = 0;
    // @ts-ignore
    $(EDIT_LINK_SELECTOR, sectionHeading).each(function() {
        if (clicked.is($(this))) {
            return false;
        }
        count++;
    });
    return count;
};

module.exports = findListingIndex;
