const wikipedia = require( '../../../src/validators/wikipedia' );

describe( 'validators/wikipedia', () => {
    it( 'checks wikipedia is not a URL', () => {
        expect( wikipedia( 'Title') ).toBe( true );
        expect( wikipedia( 'https://wikipedia.org/wiki/Title') ).toBe( false );
    } );
} );