/**
 * Given a DOM element, find the nearest editable section (h2 or h3) that
 * it is contained within.
 */
const findSectionHeading = function(element) {
    // mw-h3section and mw-h2section can be removed when useparsoid=1 is everywhere.
    return element.closest('div.mw-h3section, div.mw-h2section, section');
};

module.exports = findSectionHeading;
