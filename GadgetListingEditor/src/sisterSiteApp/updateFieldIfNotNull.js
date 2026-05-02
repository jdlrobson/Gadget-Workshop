
/**
 * @param {string} selector
 * @param {string} value
 * @param {boolean} placeholderBool
 */
const updateFieldIfNotNull = function(selector, value, placeholderBool) {
    if ( value !== null ) {
        if ( placeholderBool !== true ) {
            $(selector).val(value);
        }
    }
};

module.exports = updateFieldIfNotNull;
