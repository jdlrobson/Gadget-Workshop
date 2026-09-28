const typeToColor = require( './typeToColor' );

/**
 * @param {HTMLFormElement} form
 */
const initColor = function(form) {
    // @ts-ignore jQuery.val can return non-string
    typeToColor( $('#input-type', form).val(), form );
    $('#input-type', form).on('change',
        /**
         * @this HTMLInputElement
         */
        function () {
            typeToColor( this.value, form);
        }
    );
};

module.exports = initColor;
