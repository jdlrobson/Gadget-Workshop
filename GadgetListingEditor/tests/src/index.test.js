const main = require( '../../src/index' );
const { getConfig } = require( '../../src/Config' );
const config = require( '../../dist/Gadget-ListingEditor.json' );
const { getCallbacks } = require( '../../src/Callbacks.js' );

describe( 'index', () => {
    let form;
    beforeEach(() => {
        form = document.createElement( 'form' );
        document.body.appendChild( form );
        const lastEdit = document.createElement( 'input' );
        lastEdit.id = 'input-last-edit';
        lastEdit.type = 'checkbox';
        lastEdit.checked = true;
        document.body.appendChild( lastEdit );
    })
	it( 'is responsible for loading config and callbacks', () => {
        main(
            [ 0, 400 ],
            () => {},
            Object.assign( {}, config, {
                "configValue": 3
            } )
        );
        expect( getConfig().configValue ).toBe( 3 );
        const validateFormCallbacks = getCallbacks( 'VALIDATE_FORM_CALLBACKS' )
        expect( validateFormCallbacks.length ).toBe( 2 );

        validateFormCallbacks.forEach(( callback ) => callback( [] ) );
	} );
} );
