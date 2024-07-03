module.exports = function(entry, sectionToTemplateType, defaultType) {
    var closestSection = entry.closest('div.mw-h2section');
    var closestHeading = closestSection.find( '.mw-heading2 h2, h2 .mw-headline');
    var sectionType = closestHeading.attr('id');
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
