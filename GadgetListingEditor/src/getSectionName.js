const { getSectionText } = require( './currentEdit' );

const getSectionName = function() {
    const sectionText = getSectionText();
    var HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
    var result = HEADING_REGEX.exec(sectionText);
    return (result !== null) ? result[1].trim() : "";
};

module.exports = getSectionName;
