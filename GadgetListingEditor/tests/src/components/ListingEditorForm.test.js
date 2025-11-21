const ListingEditorForm = require('../../../src/components/listingEditorForm');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { shallowMount } = require( '@vue/test-utils' );

describe( 'listingEditorForm', () => {
    it('renders', () => {
        const wrapper = shallowMount(ListingEditorForm, {
            props: {
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
        expect(wrapper.html()).toMatchSnapshot();
    });
} );

