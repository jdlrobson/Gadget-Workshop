const trimDecimal = require( '../../src/trimDecimal' );

describe( 'trimDecimal', () => {
	it( 'as you expect', () => {
		const num = trimDecimal( 400.222223222, 2 );
		expect( num ).toBe( '400.22' );
	} );
	it( 'doesnt trim if needed', () => {
		const num = trimDecimal( 400, 2 );
		expect( num ).toBe( '400.00' );
	} );
} );
