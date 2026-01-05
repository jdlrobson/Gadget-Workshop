const image = require( '../../../src/validators/image' );

describe( 'validators/image', () => {
    it( 'checks image does not contain namespace', () => {
        expect( image( 'Title.jpg') ).toBe( true );
        expect( image( 'File:Title.jpg') ).toBe( false );
    } );
} );