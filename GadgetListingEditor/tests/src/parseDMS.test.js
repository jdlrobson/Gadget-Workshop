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
} );
