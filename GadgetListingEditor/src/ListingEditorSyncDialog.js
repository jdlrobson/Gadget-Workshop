const ListingEditorDialog = require( './components/ListingEditorDialog' );

// @todo: Move to components
module.exports = ( ListingEditorSync ) => {
    const ListingEditorSyncDialog = {
        name: 'ListingEditorSyncDialog',
        template: `<ListingEditorDialog>
        <ListingEditorSync></ListingEditorSync>
    </ListingEditorDialog>`,
        props: {
        },
        components: {
            ListingEditorDialog,
            ListingEditorSync
        }
    }
    return ListingEditorSyncDialog;
};
