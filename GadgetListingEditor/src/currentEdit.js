let sectionText = '', inlineListing = false;

/**
 * @param {boolean} isInline
 */
const setInlineListing = ( isInline ) => {
    inlineListing = isInline;
};

/**
 * @return {boolean}
 */
const isInlineListing = () => inlineListing;

/**
 * @return {string}
 */
const getSectionText = () => sectionText;

/**
 * @param {string} text
 * @return {string}
 */
const setSectionText = ( text ) => {
    sectionText = text;
    return sectionText;
};

module.exports = {
    setSectionText,
    getSectionText,
    isInlineListing,
    setInlineListing
};

