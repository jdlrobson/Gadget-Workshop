const replaceSpecial = require( './replaceSpecial.js' );

/**
 * Utility method for finding a matching end pattern for a specified start
 * pattern, including nesting. The specified value must start with the
 * start value, otherwise an empty string will be returned.
 */
const findPatternMatch = function(value, startPattern, endPattern) {
    var matchString = '';
    var startRegex = new RegExp(`^${replaceSpecial(startPattern)}`, 'i');
    if (startRegex.test(value)) {
        var endRegex = new RegExp(`^${replaceSpecial(endPattern)}`, 'i');
        var matchCount = 1;
        for (var i = startPattern.length; i < value.length; i++) {
            var remainingValue = value.substr(i);
            if (startRegex.test(remainingValue)) {
                matchCount++;
            } else if (endRegex.test(remainingValue)) {
                matchCount--;
            }
            if (matchCount === 0) {
                matchString = value.substr(0, i);
                break;
            }
        }
    }
    return matchString;
};

module.exports = findPatternMatch;
