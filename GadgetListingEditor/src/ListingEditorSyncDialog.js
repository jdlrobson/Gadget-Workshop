const ListingEditorDialog = require( './components/ListingEditorDialog' );

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
