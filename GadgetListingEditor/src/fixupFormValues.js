const trimDecimal = require( './trimDecimal.js' );
const { getConfig } = require( './Config.js' );

/**
 * Logic invoked on form submit to analyze the values entered into the
 * editor form and fix correctable issues.
 */
const fixupFormValues = function() {
    const { REPLACE_NEW_LINE_CHARS, APPEND_FULL_STOP_TO_DESCRIPTION, COORD_PRECISION } = getConfig();
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

    if ( latInput && longInput ) {
        fixupLatLon( latInput, longInput, COORD_PRECISION || 6 );
    }
    fixupUrl();
    return true;
}

const fixupLatLon = ( latInput, longInput, precision ) => {
    const inputLatLength = Math.min(
        latInput.indexOf('.') > - 1 ? latInput.split('.')[1].length : 0,
        precision
    );
    const inputLongLength = Math.min(
        longInput.indexOf('.') > - 1 ? longInput.split('.')[1].length : 0,
        precision
    );
    const lat = Number( latInput );
    const long = Number( longInput );
    // they are likely in the DMS format so let them be
    if ( isNaN( lat ) || isNaN( long ) ) {
        return;
    }
    const savedLat = trimDecimal( lat, inputLatLength );
    const savedLong = trimDecimal( long, inputLongLength );
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
