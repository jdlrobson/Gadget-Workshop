/**
 * Trim decimal precision if it exceeds the specified number of
 * decimal places.
 * @param {number} value
 * @param {number} precision
 * @return {string}
 */
var trimDecimal = function(value, precision) {
    if (value.toString().length > value.toFixed(precision).toString().length) {
        return value.toFixed(precision);
    } else {
        return value.toFixed(precision);
    }
};

module.exports = trimDecimal;
