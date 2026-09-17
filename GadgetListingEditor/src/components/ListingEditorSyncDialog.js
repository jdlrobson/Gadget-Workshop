const ListingEditorDialog = require( './ListingEditorDialog.js' );
const ListingEditorSync = require( './ListingEditorSync.js' );

/**
 * @type {Vue.VueElement}
 */
module.exports = {
    name: 'ListingEditorSyncDialog',
    template: `<ListingEditorDialog>
    <ListingEditorSync :sync-values="syncValues"></ListingEditorSync>
</ListingEditorDialog>`,
    props: {
        syncValues: {
            type: Object
        }
    },
    components: {
        ListingEditorDialog,
        ListingEditorSync
    }
};
