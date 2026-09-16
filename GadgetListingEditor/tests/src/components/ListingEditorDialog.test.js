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
    // The dialog wraps a form in its default slot. shallowMount + renderStubDefaultSlot
    // renders that slot (so the fields exist for the dirty-check) while stubbing the
    // Codex dialog. closeAction is invoked directly, exercising the unsaved-changes guard.
    const mountWithForm = ( { onClose } ) => shallowMount( ListingEditorDialog, {
        props: {
            renderInPlace: true,
            title: 'Nottingham Castle',
            onClose
        },
        slots: {
            default: '<input id="input-content" />'
        },
        global: {
            renderStubDefaultSlot: true,
            plugins: [ translatePlugin ],
            directives: {
                'translate-html': translateDirective
            }
        }
    } );

    it( 'closes without confirmation when nothing has changed', () => {
        const confirmSpy = jest.spyOn( window, 'confirm' ).mockReturnValue( false );
        const onClose = jest.fn();
        const wrapper = mountWithForm( { onClose } );

        wrapper.vm.closeAction();

        expect( confirmSpy ).not.toHaveBeenCalled();
        expect( onClose ).toHaveBeenCalled();
        expect( wrapper.vm.isOpen ).toBe( false );
        confirmSpy.mockRestore();
    } );

    it( 'asks for confirmation and stays open when changes are discarded', () => {
        const confirmSpy = jest.spyOn( window, 'confirm' ).mockReturnValue( false );
        const onClose = jest.fn();
        const wrapper = mountWithForm( { onClose } );

        wrapper.find( '#input-content' ).element.value = 'a new description';
        wrapper.vm.closeAction();

        expect( confirmSpy ).toHaveBeenCalled();
        expect( onClose ).not.toHaveBeenCalled();
        expect( wrapper.vm.isOpen ).toBe( true );
        confirmSpy.mockRestore();
    } );

    it( 'closes when the user confirms discarding changes', () => {
        const confirmSpy = jest.spyOn( window, 'confirm' ).mockReturnValue( true );
        const onClose = jest.fn();
        const wrapper = mountWithForm( { onClose } );

        wrapper.find( '#input-content' ).element.value = 'a new description';
        wrapper.vm.closeAction();

        expect( confirmSpy ).toHaveBeenCalled();
        expect( onClose ).toHaveBeenCalled();
        expect( wrapper.vm.isOpen ).toBe( false );
        confirmSpy.mockRestore();
    } );

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

