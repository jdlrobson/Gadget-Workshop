const typeToColor = require( './typeToColor' );
const initColor = function(form) {
    typeToColor( $('#input-type', form).val(), form );
    $('#input-type', form).on('change', function () {
        typeToColor(this.value, form);
    });
};

module.exports = initColor;
