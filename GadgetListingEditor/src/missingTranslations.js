const TRANSLATIONS_ALL = require( './translations.js' );
/**
 * @param {string} userLanguage
 * @return {string[]}
 */
const missingTranslations = ( userLanguage ) => {
    /** @type {string[]} */
    const missing = [];
    Object.keys( TRANSLATIONS_ALL.en ).forEach( function ( /** @type {string} */key ) {
        // check the key is present in all the other configurations
        Object.keys( TRANSLATIONS_ALL ).forEach( function ( /** @type {string} */lang ) {
            if ( lang === 'en' ) {
                return; // no need to check against itself
            } else {
                // @ts-ignore needs further inspection
                if ( TRANSLATIONS_ALL[ lang ][ key ] === undefined && userLanguage === lang) {
                    missing.push( key );
                }
            }
        } );
    } );
    return missing;
};

module.exports = missingTranslations;
