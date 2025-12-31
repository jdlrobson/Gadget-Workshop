const ListingEditorSync = require('../../src/components/ListingEditorSync.js');
const { mount } = require( '@vue/test-utils' );
const getSyncValues = require( '../../src/getSyncValues.js' );
const translatePlugin = require( '../../src/translatePlugin' );

describe( 'listingEditorSync', () => {
    beforeEach( () => {
        $('<input id="input-image">').val('Foo.jpg').appendTo(document.body);
        $('<input id="input-lat">').val('1').appendTo(document.body);
        $('<input id="input-long">').val('2').appendTo(document.body);
        $('<input id="input-wikidata-value">').val('Q42').appendTo(document.body);
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
