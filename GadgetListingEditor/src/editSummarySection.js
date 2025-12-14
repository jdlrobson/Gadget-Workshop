const getSectionName = require( './getSectionName' );

/**
 * Begin building the edit summary by trying to find the section name.
 */
const editSummarySection = function() {
    var sectionName = getSectionName();
    return (sectionName.length) ? `/* ${sectionName} */ ` : "";
};

module.exports = editSummarySection;
