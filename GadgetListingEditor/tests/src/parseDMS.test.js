const parseDMS = require( '../../src/parseDMS' );

describe( 'parseDMS', () => {
	it( 'doesnt effect numbers expressed in decimal', () => {
		const num = parseDMS( '52.953333' );
		expect( num ).toBe( 52.953333 );
	} );
    it( 'Parses coordinates in DMS notation', () => {
		const num = parseDMS( '48° 0\' 0" N' );
		expect( num ).toBe( 48 );
	} );
    it( 'Can parse decimal numbers', () => {
		const num = parseDMS( '48.3' );
		expect( num ).toBe( 48.3 );
	} );
	it( 'can parse', () => {
		const num = parseDMS( '49°11’35.242”' );
		expect( num ).toBe( 49.19312277777777 );
	});
	it( 'can parse', () => {
		const num = parseDMS( '16°36’23.708”' );
		expect( num ).toBe( 16.606585555555558 );
	});
    it( 'Fails parsing', () => {
		const num = parseDMS( 'XAZ' );
		expect( isNaN( num ) ).toBe( true );
	} );
} );
