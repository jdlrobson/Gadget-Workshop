const isRTLString = require( '../../src/isRTLString' );

describe( 'isRTLString', () => {
	it( 'detects RTL strings', () => {
		expect( isRTLString( 'listing' ) ).toBe( false );
		expect( isRTLString( 'ד מותו' ) ).toBe( true );
	} );
} );
