const { translate } = require( '../translate.js' );

/**
 * Implement SIMPLE validation on the Commons field to verify that the
 * user has not included a "File" or "Image" namespace.
 */
module.exports = function(fieldValue) {
    const VALID_IMAGE_REGEX = new RegExp(`^(?!(file|image|${translate( 'image' )}):)`, 'i');
    return !( fieldValue !== '' && !VALID_IMAGE_REGEX.test(fieldValue) );
};
