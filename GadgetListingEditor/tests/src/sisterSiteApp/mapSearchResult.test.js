const mapSearchResult = require( '../../../src/sisterSiteApp/mapSearchResult' );

describe( 'mapSearchResult', () => {
	it( 'maps results', () => {
		const mappedResults = mapSearchResult( [ null, [ 'Foo', 'Talk:Bar', 'Foofoo' ] ] );
		expect( mappedResults ).toStrictEqual( [
			{
				value: 'Foo',
				label: 'Foo'
			},
			{
				value: 'Bar',
				label: 'Bar'
			},
			{
				value: 'Foofoo',
				label: 'Foofoo'
			}
		] );
	} );
} );
