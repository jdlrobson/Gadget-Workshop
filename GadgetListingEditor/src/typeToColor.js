const asyncGetColor = require( './asyncGetColor' );
const changeColor = function(color, form) {
    $('#input-type', form).css( 'box-shadow', `-20px 0 0 0 ${color} inset` );
};

const typeToColor = function(listingType, form) {
    changeColor( 'var(--background-color-base, white)', form );
    return asyncGetColor( listingType ).then(( color ) => {
        changeColor(color, form);
    });
};
module.exports = typeToColor;
