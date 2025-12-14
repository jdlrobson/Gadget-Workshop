let sectionText, inlineListing;

const setInlineListing = ( isInline ) => {
    inlineListing = isInline;
};

const isInlineListing = () => inlineListing;

const getSectionText = () => sectionText;

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

