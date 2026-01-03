const changeColor = function(color, form) {
    $('#input-type', form).css( 'box-shadow', `-20px 0 0 0 #${color} inset` );
};

const typeToColor = function(listingType, form) {
    $('#input-type', form).css( 'box-shadow', 'unset' );
    $.ajax ({
        listingType,
        form,
        url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
            action: 'parse',
            prop: 'text',
            contentmodel: 'wikitext',
            format: 'json',
            disablelimitreport: true,
            'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
        })}`,
        // eslint-disable-next-line object-shorthand
        beforeSend: function() {
            if (localStorage.getItem(`listing-${listingType}`)) {
                changeColor(localStorage.getItem(`listing-${listingType}`), form);
                return false;
            }
            else { return true; }
        },
        // eslint-disable-next-line object-shorthand
        success: function (data) {
            var color = $(data.parse.text['*']).text().trim();
            localStorage.setItem(`listing-${listingType}`, color);
            changeColor(color, form);
        },
    });
};
module.exports = typeToColor;
