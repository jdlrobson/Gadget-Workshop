const listingEditorSync = require('../../src/listingEditorSync');
const { shallowMount } = require( '@vue/test-utils' );
const translatePlugin = require( '../../src/translatePlugin' );

describe( 'listingEditorSync', () => {
    beforeEach( () => {
        $('<input id="input-image">').val('Foo.jpg').appendTo(document.body);
        $('<input id="input-lat">').val('1').appendTo(document.body);
        $('<input id="input-long">').val('2').appendTo(document.body);
        $('<input id="input-wikidata-value">').val('Q42').appendTo(document.body);
    });
    it('renders', () => {
        const ListingEditorSync = listingEditorSync(
            require( './wikidataClaims.json'),
            'Q17642916'
        );
        const wrapper = shallowMount(ListingEditorSync, {
            props: {
                wikipedia: 'Nottingham Castle',
                wikidata: 'Q42'
            },
            global: {
                plugins: [ translatePlugin ]
            }
        } );
        expect(wrapper.html()).toMatchSnapshot();
    });
} );
