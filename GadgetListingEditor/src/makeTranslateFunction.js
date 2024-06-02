/**
 * @param {Object<string,string>} translations
 * @return {string}
 */
module.exports = ( translations ) => {
    return ( key, params = [] ) => {
        let msg =  translations[ key ];
        if ( msg === undefined ) {
            throw new Error( `Could not find undefined message ${key}` );
        } else {
            params.forEach( ( value, i ) => {
                msg = msg.replace( `$${i + 1}`, value );
            } );
            return msg;
        }
    };
};
