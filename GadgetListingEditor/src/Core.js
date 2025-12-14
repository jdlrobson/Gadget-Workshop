var Core = function() {
    const { MODE_ADD, MODE_EDIT } = require( './mode.js' );

    /**
     * This method is invoked when an "add" or "edit" listing button is
     * clicked and will execute an Ajax request to retrieve all of the raw wiki
     * syntax contained within the specified section. This wiki text will
     * later be modified via the listing editor and re-submitted as a section
     * edit.
     */
    var initListingEditorDialog = require( './initListingEditorDialog.js' );

    // expose public members
    return {
        initListingEditorDialog,
        MODE_ADD,
        MODE_EDIT
    };
};

module.exports = Core;
