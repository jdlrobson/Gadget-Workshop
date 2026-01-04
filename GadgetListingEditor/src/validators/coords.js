/**
 * @param {string} latInput
 * @param {string} longInput
 * @return {boolean}
 */
const validateCoords = ( latInput, longInput ) => {
    if ( latInput && longInput ) {
        const lat = Number( latInput );
        const long = Number( longInput );
        if ( isNaN( lat ) || isNaN( long ) ) {
            return false;
        }
    } else if ( latInput && !longInput ) {
        return false;
    } else if ( !latInput && longInput ) {
        return false;
    }
    return true;
};

module.exports = validateCoords;
