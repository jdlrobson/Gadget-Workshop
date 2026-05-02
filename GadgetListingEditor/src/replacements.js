/** @type {Record<string,string>} */
let replacements = {};

const clear = () => {
    replacements = {};
};

/**
 * @param {string} rep
 * @param {string} comment
 */
const addReplacement = ( rep, comment ) => {
    replacements[rep] = comment;
};

module.exports = {
    replacements,
    addReplacement,
    clear
};
