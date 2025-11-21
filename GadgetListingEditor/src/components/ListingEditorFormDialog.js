const ListingEditorDialog = require( './ListingEditorDialog' );
const ListingEditorForm = require( './ListingEditorForm' );

module.exports = {
    name: 'ListingEditorFormDialog',
    template: `<ListingEditorDialog>
    <ListingEditorForm
        :listing-template-as-map="listingTemplateAsMap"
        :listing-type="listingType"
        :nationalCurrencies="nationalCurrencies"
        :listing-types="listingTypes"
        :wikidata="wikidata"
        :wikipedia="wikipedia"
        :image="image"
        :mode="mode"
        :telephoneCodes="telephoneCodes"
        :characters="characters"
        :show-last-edited-field="showLastEditedField" />
</ListingEditorDialog>`,
    props: {
        listingTemplateAsMap: {
            type: Object
        },
        listingTypes: {
            type: Array
        },
        wikipedia: {
            type: String
        },
        wikidata: {
            type: String
        },
        image: {
            type: String
        },
        mode: {
            type: String
        },
        telephoneCodes: {
            type: Array
        },
        characters: {
            type: Array
        },
        showLastEditedField: {
            type: Boolean
        },
        nationalCurrencies: {
            type: Array
        },
        listingType: {
            type: String
        }
    },
    components: {
        ListingEditorDialog,
        ListingEditorForm
    }
};
