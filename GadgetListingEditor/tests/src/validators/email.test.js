const email = require( '../../../src/validators/email' );
const { extendConfig } = require( '../../../src/Config' );

describe( 'validators/email', () => {
    it( 'checks email', () => {
        extendConfig( { VALIDATE_CALLBACKS_EMAIL: true } );
        expect( email( 'bademail') ).toBe( false );
        expect( email( 'j@j.com') ).toBe( true );
    } );
    it( 'is optional', () => {
        extendConfig( { VALIDATE_CALLBACKS_EMAIL: false } );
        expect( email( 'bademail') ).toBe( true );
    } );
} );