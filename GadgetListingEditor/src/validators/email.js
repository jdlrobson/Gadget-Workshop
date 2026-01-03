const { translate } = require( '../translate.js' );
const _validateFieldAgainstRegex = require( './againstRegEx.js' );

/**
 * Implement SIMPLE validation on email addresses. Invalid emails can
 * still get through, but this method implements a minimal amount of
 * validation in order to catch the worst offenders.
 * Disabled for now, TODO: multiple email support.
 */
module.exports = function(validationFailureMessages) {
    var VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    _validateFieldAgainstRegex(
        validationFailureMessages,
        VALID_EMAIL_REGEX, '#input-email',
        translate( 'validationEmail' )
    );
};

