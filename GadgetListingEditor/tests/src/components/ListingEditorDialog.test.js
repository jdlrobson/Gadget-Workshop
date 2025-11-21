const ListingEditorDialog = require('../../../src/components/ListingEditorDialog');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { shallowMount } = require( '@vue/test-utils' );

describe( 'ListingEditorDialog', () => {
    it('renders', () => {
        const wrapper = shallowMount(ListingEditorDialog, {
            props: {
                title: 'Nottingham Castle'
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

