/**
 * Determine whether a listing entry is within a paragraph rather than
 * an entry in a list; inline listings will be formatted slightly
 * differently than entries in lists (no newlines in the template syntax,
 * skip empty fields).
 */
const isInline = function(entry) {
    // if the edit link clicked is within a paragraph AND, since
    // newlines in a listing description will cause the Mediawiki parser
    // to close an HTML list (thus triggering the "is edit link within a
    // paragraph" test condition), also verify that the listing is
    // within the expected listing template span tag and thus hasn't
    // been incorrectly split due to newlines.
    return (entry.closest('p').length !== 0 && entry.closest('span.vcard').length !== 0);
};

module.exports = isInline;
