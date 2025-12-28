const isCustomListingType = require( '../../src/isCustomListingType' );

describe( 'isCustomListingType', () => {
	it( 'uses the config variables in LISTING_TEMPLATES set in jest.setup.js', () => {
		expect( isCustomListingType( 'listing' ) ).toBe( false );
		expect( isCustomListingType( 'see' ) ).toBe( false );
		expect( isCustomListingType( 'custom' ) ).toBe( true );
	} );
} );
