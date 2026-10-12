let CC = '';
let LC = '';

/**
 * @param {HTMLElement|null} el
 * @return {Record<string,string[]>}
 */
const loadFromCountryData = ( el ) => {
    const /** @type {string[]} */telephoneCodes = [];
    let /** @type {string[]} */ NATL_CURRENCY = [];

    if ( !el ) {
        return {
            telephoneCodes,
            NATL_CURRENCY
        };
    }
    CC = el.getAttribute('data-country-calling-code') || '';
    LC = el.getAttribute('data-local-dialing-code') || '';
    NATL_CURRENCY = ( el.getAttribute('data-currency') || '' ).split( ',' ).filter( item => item )
        .map( item => item.trim() );

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
