const getListingInfo = require( '../../src/getListingInfo' );
const { getConfig } = require( '../../src/Config.js' );

describe( 'getListingInfo', () => {
	it( 'custom listings use DEFAULT_LISTING_TEMPLATE', () => {
		const { DEFAULT_LISTING_TEMPLATE, LISTING_TEMPLATES } = getConfig();
		expect( getListingInfo( 'custom' ) ).toBe( LISTING_TEMPLATES[ DEFAULT_LISTING_TEMPLATE] );
		expect( getListingInfo( 'see' ) ).toBe( LISTING_TEMPLATES[ 'see' ] );
	} );
} );
