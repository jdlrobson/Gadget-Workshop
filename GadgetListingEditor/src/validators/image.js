const { translate } = require( '../translate.js' );
const _validateFieldAgainstRegex = require( './againstRegEx.js' );

/**
 * Implement SIMPLE validation on the Commons field to verify that the
 * user has not included a "File" or "Image" namespace.
 */
module.exports = function(validationFailureMessages) {
    var VALID_IMAGE_REGEX = new RegExp(`^(?!(file|image|${translate( 'image' )}):)`, 'i');
    _validateFieldAgainstRegex(validationFailureMessages, VALID_IMAGE_REGEX, '#input-image', translate( 'validationImage' ) );
};
