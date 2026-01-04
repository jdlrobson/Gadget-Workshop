const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );
const validateCoords = require( './validators/coords.js' );

/**
 * Logic invoked on form submit to analyze the values entered into the
 * editor form and to block submission if any fatal errors are found.
 *
 * Alerts if validation error found.
 *
 * @param {bool} VALIDATE_FORM_CALLBACKS
 * @return {bool} whether validation succeeded.
 */
const fixupFormValues = function(
    VALIDATE_FORM_CALLBACKS
) {
    const coordsError = () => {
        alert( translate( 'coordinates-error' ) );
        return false;
    };
    const { REPLACE_NEW_LINE_CHARS, APPEND_FULL_STOP_TO_DESCRIPTION } = getConfig();
    var validationFailureMessages = [];
    for (var i=0; i < VALIDATE_FORM_CALLBACKS.length; i++) {
        VALIDATE_FORM_CALLBACKS[i](validationFailureMessages);
    }
    if (validationFailureMessages.length > 0) {
        alert(validationFailureMessages.join('\n'));
        return false;
    }
    // newlines in listing content won't render properly in lists, so replace them with <br> tags
    if ( REPLACE_NEW_LINE_CHARS ) {
        $('#input-content').val(
            ($('#input-content').val() || '')
                .trim().replace(/\n/g, '<br />')
        );
    }
    // add trailing period in content. Note: replace(/(?<!\.)$/, '.') is not supported by IE
    // Trailing period shall not be added if one of the following char is present: ".", "!" or "?"
    const $content = $('#input-content')
    const contentValue = $content.val() || '';
    if ( APPEND_FULL_STOP_TO_DESCRIPTION && contentValue ) {
        $content
            .val(
                `${contentValue.trim()}.`
                    .replace(/([.!?])\.+$/, '$1')
            );
    }

    // remove trailing period from price and address block
    $('#input-price').val(
        ($('#input-price').val() || '')
            .trim().replace(/\.$/, '')
    );
    $('#input-address').val(
        ($('#input-address').val() || '')
            .trim().replace(/\.$/, '')
    );
    // in case of decimal format, decimal digits will be limited to 6
    const latInput = ( $('#input-lat').val() || '' ).trim();
    const longInput = ( $('#input-long').val() || '' ).trim();
    if ( !validateCoords( latInput, longInput ) ) {
        return coordsError();
    }

    if ( latInput && longInput ) {
        fixupLatLon( latInput, longInput );
    }
    fixupUrl();
    return true;
}

const fixupLatLon = ( latInput, longInput ) => {
    const lat = Number( latInput );
    const long = Number( longInput );
    const savedLat = trimDecimal( lat, 6 );
    const savedLong = trimDecimal( long, 6 );
    $('#input-lat').val( savedLat );
    $('#input-long').val( savedLong );
};

const fixupUrl = () => {
    var webRegex = new RegExp('^https?://', 'i');
    var url = $('#input-url').val();
    if (!webRegex.test(url) && url !== '') {
        $('#input-url').val(`http://${url}`);
    }
};

module.exports = fixupFormValues;
