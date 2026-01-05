const email = require( '../../../src/validators/email' );
const { loadConfig } = require( '../../../src/Config' );

describe( 'validators/email', () => {
    it( 'checks email', () => {
        loadConfig( { VALIDATE_CALLBACKS_EMAIL: true } );
        expect( email( 'bademail') ).toBe( false );
        expect( email( 'j@j.com') ).toBe( true );
    } );
    it( 'is optional', () => {
        loadConfig( { VALIDATE_CALLBACKS_EMAIL: false } );
        expect( email( 'bademail') ).toBe( true );
    } );
} );