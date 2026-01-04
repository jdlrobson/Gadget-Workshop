const ListingEditorDialog = require( './ListingEditorDialog' );
const ListingEditorForm = require( './ListingEditorForm' );
const { ref, computed } = require( 'vue' );
const validateEmail = require( '../validators/email.js' );
const validateWikipedia = require( '../validators/wikipedia.js' );
const validateImage = require( '../validators/image.js' );

module.exports = {
    name: 'ListingEditorFormDialog',
    template: `<ListingEditorDialog
        :disabledMessage="disabledMessage ? $translate( disabledMessage ) : undefined">
    <ListingEditorForm
        @updated:listing="onListingUpdate"
        :lat="lat"
        :long="long"
        :url="url"
        :content="content"
        :lastedit="lastedit"
        :listing-name="listingName"
        :listing-type="listingType"
        :national-currencies="nationalCurrencies"
        :listing-types="listingTypes"
        :wikidata="wikidata"
        :wikipedia="wikipedia"
        :image="image"
        :mode="mode"
        :aka="aka"
        :address="address"
        :email="email"
        :directions="directions"
        :phone="phone"
        :tollfree="tollfree"
        :fax="fax"
        :hours="hours"
        :checkin="checkin"
        :checkout="checkout"
        :price="price"
        :telephoneCodes="telephoneCodes"
        :characters="characters"
        :show-last-edited-field="showLastEditedField" />
</ListingEditorDialog>`,
    props: {
        aka: {
            type: String
        },
        address: {
            type: String
        },
        email: {
            type: String
        },
        directions: {
            type: String
        },
        phone: {
            type: String
        },
        tollfree: {
            type: String
        },
        fax: {
            type: String
        },
        hours: {
            type: String
        },
        checkin: {
            type: String
        },
        checkout: {
            type: String
        },
        price: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        },
        url: {
            type: String
        },
        content: {
            type: String
        },
        lastedit: {
            type: String
        },
        listingName: {
            type: String
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
    },
    setup( { listingName, address, aka, email, wikipedia, image } ) {
        // All listings must have a name, address or alt name.
        const hasData = ref( listingName || address || aka );

        const emailValid = ref( email ? validateEmail( email ) : true );
        const wikipediaValid = ref( validateWikipedia( wikipedia ) );
        const imageValid = ref( validateImage( image ) );
        const disabledMessage = computed( () => {
            if ( !hasData.value ) {
                return 'validationEmptyListing';
            } else if ( !wikipediaValid.value ) {
                return 'validationWikipedia';
            } else if ( !imageValid.value ) {
                return 'validationImage';
            } else if ( !emailValid.value ) {
                return 'validationEmail';
            } else {
                return '';
            }
        } );

        const onListingUpdate = ( data ) => {
            hasData.value = data.name || data.address || data.alt;
            emailValid.value = validateEmail( data.email );
            wikipediaValid.value = validateWikipedia( data.wikipedia );
            imageValid.value = validateImage( data.image );
        };
        return {
            onListingUpdate,
            disabledMessage
        };
    }
};
