const { translate } = require( '../translate.js' );
const _validateFieldAgainstRegex = require( './againstRegEx.js' );

/**
 * Implement SIMPLE validation on Wikipedia field to verify that the
 * user is entering the article title and not a URL.
 */
module.exports = function(validationFailureMessages) {
    var VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
    _validateFieldAgainstRegex(validationFailureMessages, VALID_WIKIPEDIA_REGEX, '#input-wikipedia', translate( 'validationWikipedia' ) );
};
