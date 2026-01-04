const { getConfig } = require( '../Config' );
/**
 * Implement SIMPLE validation on email addresses. Invalid emails can
 * still get through, but this method implements a minimal amount of
 * validation in order to catch the worst offenders.
 * Disabled for now, TODO: multiple email support.
 */
module.exports = function( fieldValue ) {
    const { VALIDATE_CALLBACKS_EMAIL } = getConfig();
    if ( VALIDATE_CALLBACKS_EMAIL ) {
        const VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        return fieldValue !== '' && !VALID_EMAIL_REGEX.test(fieldValue) ?
            false : true;
    } else {
        return true;
    }
};

