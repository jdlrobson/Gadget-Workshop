let CC = '';
let LC = '';

const loadFromCountryData = ( $el ) => {
    CC = '';
    dataSel = $el.attr('data-country-calling-code');
    if ((dataSel !== undefined) && (dataSel !== '')) CC = dataSel;
    LC = '';
    dataSel = $el.attr('data-local-dialing-code');
    if ((dataSel !== undefined) && (dataSel !== '')) LC = dataSel;

    let NATL_CURRENCY = [];
    var dataSel =  $el.attr('data-currency');
    if ((dataSel !== undefined) && (dataSel !== '')) {
        NATL_CURRENCY = dataSel.split( ',' ).map( function( item ) {
            return item.trim();
        });
    }
    const telephoneCodes = [];
    if ( CC ) {
        telephoneCodes.push( CC );
    }
    if ( LC ) {
        telephoneCodes.push( LC );
    }
    return {
        telephoneCodes,
        NATL_CURRENCY
    };
};

module.exports = {
    loadFromCountryData
};
