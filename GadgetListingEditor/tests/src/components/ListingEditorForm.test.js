const ListingEditorForm = require('../../../src/components/listingEditorForm');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { shallowMount, mount } = require( '@vue/test-utils' );

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
    it('makes use of specialCharactersString', () => {
        const wrapper = mount(ListingEditorForm, {
            props: {
                characters: [ 'é' ],
                currencies: [ '$' ]
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
        // FIXME: change to wrapper.findAll and drop this line when initStringFormFields
        // has been moved to Vue component.
        document.body.innerHTML = wrapper.html();
        expect(wrapper.html()).toMatchSnapshot();
        wrapper.find('#span_intl_currencies .listing-charinsert').trigger('click');
        expect($('#input-price').val()).toBe('$');
        wrapper.find('#div_content .listing-charinsert').trigger('click');
        expect($('#input-content').val()).toBe('é');
    });
} );

