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
	it( 'retains precision (1)', () => {
		const num = trimDecimal( 41.907, 3 );
		expect( num ).toBe( '41.907' );
	} );
	it( 'retains precision (2)', () => {
		const num = trimDecimal( 41.907000, 6 );
		expect( num ).toBe( '41.907000' );
	} );
	it( 'retains precision (3)', () => {
		const num = trimDecimal( 41.90799999, 6 );
		expect( num ).toBe( '41.908000' );
	} );
} );
