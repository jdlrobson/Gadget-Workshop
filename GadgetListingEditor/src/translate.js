const makeTranslateFunction = require( './makeTranslateFunction.js' );

/** @type {Function} */
let internalTranslateFn;

/**
 * @param {string} key
 * @param  {string[]} parameters
 * @return {string}
 */
const translate = ( key, ...parameters ) => {
    if ( !internalTranslateFn ) {
        throw 'Translations not setup';
    } else {
        return internalTranslateFn( key, ...parameters );
    }
};

/**
 * @param {Object<string,string>} TRANSLATIONS
 */
const init = ( TRANSLATIONS ) => {
    internalTranslateFn = makeTranslateFunction( TRANSLATIONS );
};

module.exports = {
    translate,
    init
};
