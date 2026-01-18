const ListingEditorDialog = require('../../../src/components/ListingEditorDialog');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { shallowMount, mount } = require( '@vue/test-utils' );
const { nextTick } = require( 'vue' );

describe( 'ListingEditorDialog', () => {
    it('renders', () => {
        const wrapper = shallowMount(ListingEditorDialog, {
            props: {
                renderInPlace: true,
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
    it('hides buttons while save in progress', async () => {
        const onSubmit = jest.fn();
        const wrapper = mount(ListingEditorDialog, {
            props: {
                renderInPlace: true,
                title: 'Nottingham Castle',
                onSubmit
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
        wrapper.find('.submitButton' ).trigger( 'click');
        expect( onSubmit ).toHaveBeenCalled();
        await nextTick();
        expect(wrapper.findAll( '#progress-dialog' ).length).toBe(1);
        expect(wrapper.findAll( '.submitButton' ).length).toBe(0);
    });
} );

