module.exports = function(entry, sectionToTemplateType, defaultType) {
    const closestSection = entry.closest('div.mw-h2section, section');
    const closestHeading = closestSection.find( '.mw-heading2 h2, h2 .mw-headline');
    const sectionType = closestHeading.attr('id');
    if ( !sectionType ) {
        // check for modern HTML.
    }
    for (var sectionId in sectionToTemplateType) {
        if (sectionType == sectionId) {
            return sectionToTemplateType[sectionId];
        }
    }
    return defaultType;
};
