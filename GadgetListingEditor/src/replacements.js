let replacements = {};

const clear = () => {
    replacements = {};
};

const addReplacement = ( rep, comment ) => {
    replacements[rep] = comment;
};

module.exports = {
    replacements,
    addReplacement,
    clear
};
