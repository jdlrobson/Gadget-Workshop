const typeToColor = require( './typeToColor' );

/**
 * @param {HTMLElement} form
 */
const initColor = function(form) {
    // @ts-ignore
    typeToColor( $('#input-type', form).val(), form );
    $('#input-type', form).on('change', function () {
        // @ts-ignore
        typeToColor( this.value, form);
    });
};

module.exports = initColor;
