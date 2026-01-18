const ListingEditorFormDialog = require('../../../src/components/ListingEditorFormDialog');
//const ListingEditorForm = require('../../../src/components/ListingEditorForm');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { mount } = require( '@vue/test-utils' );

describe( 'ListingEditorFormDialog', () => {
    it('renders', () => {
        const wrapper = mount(ListingEditorFormDialog, {
            props: {
                renderInPlace: true,
                listingTypes: [],
                telephoneCodes: [],
                characters: [],
                title: 'Title'
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
        expect(wrapper.html()).toMatchSnapshot();
        //wrapper.findComponent(ListingEditorForm).trigger('updated:listing');
    });
} );

