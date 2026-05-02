const asyncGetColor = require( './asyncGetColor' );

/**
 * @param {string} color
 * @param {HTMLElement} form
 */
const changeColor = function(color, form) {
    $('#input-type', form).css( 'box-shadow', `-20px 0 0 0 ${color} inset` );
};

/**
 * @param {string} listingType
 * @param {HTMLElement} form
 * @return {Promise<any>}
 */
const typeToColor = function(listingType, form) {
    changeColor( 'var(--background-color-base, white)', form );
    return asyncGetColor( listingType ).then(( color ) => {
        changeColor(color, form);
    });
};
module.exports = typeToColor;
