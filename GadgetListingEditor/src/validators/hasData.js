const { translate } = require( '../translate.js' );
/**
 * Verify all listings have at least a name, address or alt value.
 */
module.exports = function(validationFailureMessages) {
    if ($('#input-name').val() === '' && $('#input-address').val() === '' && $('#input-alt').val() === '') {
        validationFailureMessages.push( translate( 'validationEmptyListing' ) );
    }
};
