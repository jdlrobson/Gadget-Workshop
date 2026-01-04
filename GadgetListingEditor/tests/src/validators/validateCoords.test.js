const validateCoords = require( '../../../src/validators/coords' );

describe( 'validateCoords', () => {
	it( 'validate (fails when latitude and longitude do not resolve to numbers)', () => {
		const validated = validateCoords( 'foo', 'bar' );
		expect( validated ).toBe( false );
	} );

	it( 'validate (only accepts decimals)', () => {
		const validated = validateCoords( '32° 18\' 23.1 N', '122° 36\' 52.5" W' );
		expect( validated ).toBe( false );
	} );

	it( 'validate (both latitude and longitude must be provided)', () => {
		const validated = validateCoords( '+32.30642', '' );
		expect( validated ).toBe( false );
	} );

	it( 'validate (both latitude and longitude must be provided 2)', () => {
		const validated = validateCoords('', '-122.61458');
		expect( validated ).toBe( false );
	} );
} );