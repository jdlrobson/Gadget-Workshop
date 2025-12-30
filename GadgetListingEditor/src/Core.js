var Core = function() {
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );

    var initListingEditorDialog = require( './initListingEditorDialog.js' );

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
