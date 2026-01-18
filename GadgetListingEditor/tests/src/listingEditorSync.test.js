const ListingEditorSync = require('../../src/components/ListingEditorSync.js');
const { mount } = require( '@vue/test-utils' );
const getSyncValues = require( '../../src/getSyncValues.js' );
const translatePlugin = require( '../../src/translatePlugin' );
const addFormToPage = require('./helpers/addFormToPage.js');

describe( 'listingEditorSync', () => {
    beforeEach( () => {
        addFormToPage();
    });
    it('renders', () => {
        const wrapper = mount(ListingEditorSync, {
            props: {
                syncValues: getSyncValues(
                    require( './wikidataClaims.json'),
                    'Q17642916'
                )
            },
            global: {
                plugins: [ translatePlugin ]
            }
        } );
        expect(wrapper.html()).toMatchSnapshot();
    });
} );
