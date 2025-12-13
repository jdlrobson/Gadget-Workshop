const makeTranslateFunction = require( './makeTranslateFunction.js' );
let internalTranslateFn;

const translate = ( key, ...parameters ) => {
    if ( !internalTranslateFn ) {
        throw 'Translations not setup';
    } else {
        return internalTranslateFn( key, ...parameters );
    }
};

const init = ( TRANSLATIONS ) => {
    internalTranslateFn = makeTranslateFunction( TRANSLATIONS );
};

module.exports = {
    translate,
    init
};
