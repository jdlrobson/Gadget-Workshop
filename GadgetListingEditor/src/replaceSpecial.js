/**
 * @param {string} str
 * @return {string}
 */
const replaceSpecial = function(str) {
    return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

module.exports = replaceSpecial;
