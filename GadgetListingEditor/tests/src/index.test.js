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
        expect( getCallbacks( 'CREATE_FORM_CALLBACKS' ).length ).toBe( 0 );
        main(
            [ 0, 400 ],
            () => {},
            Object.assign( {}, config, {
                "configValue": 3
            } )
        );
        expect( getConfig().configValue ).toBe( 3 );
        const createFormCallbacks = getCallbacks( 'CREATE_FORM_CALLBACKS' );
        const submitFormCallbacks = getCallbacks( 'SUBMIT_FORM_CALLBACKS' );
        const validateFormCallbacks = getCallbacks( 'VALIDATE_FORM_CALLBACKS' )
        expect( createFormCallbacks.length ).toBe( 3 );
        expect( submitFormCallbacks.length ).toBe( 1 );
        expect( validateFormCallbacks.length ).toBe( 3 );

        createFormCallbacks.forEach(( callback ) => callback( form ) );
        validateFormCallbacks.forEach(( callback ) => callback( [] ) );

        const data = {};
        submitFormCallbacks.forEach(( callback ) => callback( data, 'add' ) );
        expect( data.lastedit ).not.toBe( undefined );
	} );
} );
