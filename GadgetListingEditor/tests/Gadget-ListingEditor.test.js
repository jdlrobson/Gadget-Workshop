const listingEditor = require( '../src/index.js' );
const TEMPLATE_TYPE = {
	'Cosa_vedere': 'see',
	'Cosa_fare': 'do',
	'Acquisti': 'buy',
	'Dove_mangiare': 'eat',
	'Come_divertirsi': 'drink',
	'Dove_alloggiare': 'sleep',
	'Eventi_e_feste': 'listing',
	'Come arrivare': 'listing',
	'Come spostarsi': 'listing'
};
describe( 'Gadget-ListingEditor', () => {
	it( 'exports', () => {
		const le = listingEditor( [ 0 ], TEMPLATE_TYPE, require( '../en:Gadget-ListingEditor.json' ) );
		expect( le.MODE_ADD ).toBe( 'add' );
	} );
} );
