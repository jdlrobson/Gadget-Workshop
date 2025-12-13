const { addReplacement } = require( './replacements' );

/**
 * Commented-out listings can result in the wrong listing being edited, so
 * strip out any comments and replace them with placeholders that can be
 * restored prior to saving changes.
 */
const stripComments = function(text) {
    var comments = text.match(/<!--[\s\S]*?-->/mig);
    if (comments !== null ) {
        for (var i = 0; i < comments.length; i++) {
            var comment = comments[i];
            var rep = `<<<COMMENT${i}>>>`;
            text = text.replace(comment, rep);
            addReplacement( rep, comment );
        }
    }
    return text;
};

module.exports = stripComments;
