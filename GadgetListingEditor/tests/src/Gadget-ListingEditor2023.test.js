const html = require( './assets/Samara.js' )
const config = require( '../../dist/Gadget-ListingEditor.json' );
describe( 'initialization', () => {
    const core = {
        initListingEditorDialog: jest.fn()
    };
    const initFn = jest.fn( () => core );
    beforeEach(() => {
        document.body.innerHTML = html;
        const req = ( name ) => {
            switch ( name ) {
                case 'ext.gadget.ListingEditorMain':
                    return initFn;
                case 'ext.gadget.ListingEditorConfig':
                    return config;
                default:
                    return {};
            }
        };
        mw.loader.require = req;
        mw.loader.using = jest.fn(() => Promise.resolve( req ) );
        mw.loader.getState = jest.fn(() => 'registered' );
    });
    it( 'boots and transforms', () => {
        const boot = require( '../../src/Gadget-ListingEditor2023.js' );
        boot();
        expect(document.body.innerHTML).toMatchSnapshot();

        const editLinks = document.body.querySelectorAll( '.listingeditor-edit' );
        expect( editLinks.length ).toBe( 22 );
        const addLinks = document.body.querySelectorAll( '.listingeditor-add' );
        expect( addLinks.length ).toBe( 12 );

        addLinks[0].dispatchEvent( new Event( 'click' ) );
        return new Promise( ( resolve ) => {
            setTimeout(() => {
                expect( core.initListingEditorDialog ).toHaveBeenCalled();
                resolve();
            }, 1000 );
        } );
    } )
} );
