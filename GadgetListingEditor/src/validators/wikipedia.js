/**
 * Implement SIMPLE validation on Wikipedia field to verify that the
 * user is entering the article title and not a URL.
 */
module.exports = function( fieldValue ) {
    const VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
    return !( fieldValue !== '' && !VALID_WIKIPEDIA_REGEX.test(fieldValue) );
};
