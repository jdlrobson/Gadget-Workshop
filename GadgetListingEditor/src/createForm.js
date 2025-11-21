const { CdxTextInput, CdxTextArea, CdxTabs, CdxTab } = require( '@wikimedia/codex' );
const sistersites = require( './components/SisterSites.js' );
const { onMounted, ref } = require( 'vue' );
const { getCallbacks } = require( './Callbacks.js' );
const TelephoneCharInsert = require( './components/TelephoneCharInsert.js' );
const SpecialCharactersString = require( './components/specialCharactersString.js' );

/**
 * Generate the form UI for the listing editor. If editing an existing
 * listing, pre-populate the form input fields with the existing values.
 */
// @todo: move to template
const onFormMounted = ( form, listingParameters, listingTemplateAsMap ) => {
    // populate the empty form with existing values
    for (var parameter in listingParameters) {
        var parameterInfo = listingParameters[parameter];
        if (listingTemplateAsMap[parameter]) {
            $(`#${parameterInfo.id}`, form).val(listingTemplateAsMap[parameter]);
        } else if (parameterInfo.hideDivIfEmpty) {
            $(`#${parameterInfo.hideDivIfEmpty}`, form).hide();
        }
    }
};

// @todo: Move to ListingEditorForm.js when onFormMounted removed.
const createForm = function(listingParameters, listingTemplateAsMap, {
    NATL_CURRENCY
} ) {
    return {
        name: 'ListingEditorForm',
        props: {
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
            nationalCurrencies: {
                type: Array,
                default: NATL_CURRENCY
            },
            showLastEditedField: {
                type: Boolean
            },
            currencies: {
                type: Array,
                default: [ '€', '$', '£', '¥', '₩' ]
            },
            characters: {
                type: Array
            }
        },
        template: require( './html.js' ),
        components: {
            CdxTabs,
            CdxTab,
            TelephoneCharInsert,
            CdxTextInput,
            CdxTextArea,
            SpecialCharactersString,
            sistersites
        },
        setup( { showLastEditedField, mode } ) {
            const tabsData = ref( [
                {
                    name: 'edit',
                    label: 'edit'
                }, {
                    name: 'preview',
                    label: 'preview'
                }
            ] );
            const form = ref(null);
            onMounted( () => {
                const callbacks = getCallbacks( 'CREATE_FORM_CALLBACKS' );
                if ( form.value ) {
                    // @todo: move into template
                    onFormMounted( form.value, listingParameters, listingTemplateAsMap );
                    for (var i=0; i < callbacks.length; i++) {
                        callbacks[i]( form.value, mode );
                    }
                }
            } );

            return {
                tabsData,
                form,
                showLastEditedField
            };
        }
    };
};

module.exports = createForm;
