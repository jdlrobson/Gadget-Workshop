/**
 * Given an editable heading, examine it to determine what section index
 * the heading represents. First heading is 1, second is 2, etc.
 */
const findSectionIndex = function(heading) {
    if (heading === undefined) {
        return 0;
    }
    var link = heading.find('.mw-editsection a').attr('href');
    return (link !== undefined) ? link.split('=').pop() : 0;
};

module.exports = findSectionIndex;
