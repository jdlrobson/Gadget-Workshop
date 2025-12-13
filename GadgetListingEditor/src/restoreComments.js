const { replacements, clear } = require( './replacements' );

/**
 * Search the text provided, and if it contains any text that was
 * previously stripped out for replacement purposes, restore it.
 */
const restoreComments = function(text, resetReplacements) {
    for (var key in replacements) {
        var val = replacements[key];
        text = text.replace(key, val);
    }
    if (resetReplacements) {
        clear();
    }
    return text;
};

module.exports = restoreComments;
