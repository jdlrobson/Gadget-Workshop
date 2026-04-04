const TRANSLATIONS_ALL = require( './translations.js' );
const missingTranslations = ( userLanguage ) => {
    const missing = [];
    Object.keys( TRANSLATIONS_ALL.en ).forEach( function ( key ) {
        // check the key is present in all the other configurations
        Object.keys( TRANSLATIONS_ALL ).forEach( function ( lang ) {
            if ( lang === 'en' ) {
                return; // no need to check against itself
            } else {
                if ( TRANSLATIONS_ALL[ lang ][ key ] === undefined && userLanguage === lang) {
                    missing.push( key );
                }
            }
        } );
    } );
    return missing;
};

module.exports = missingTranslations;
