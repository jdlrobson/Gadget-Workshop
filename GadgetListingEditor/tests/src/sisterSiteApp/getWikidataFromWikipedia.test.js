const getWikidataFromWikipedia = require( '../../../src/sisterSiteApp/getWikidataFromWikipedia' );
const SisterSite = require( '../../../src/SisterSite');
const response = require('../assets/pagesResponse.json');

describe( 'getWikidataFromWikipedia', () => {
	it( 'queries wikipedia and interprets', () => {
        const api = SisterSite();
        api.ajaxSisterSiteSearch = jest.fn(() => Promise.resolve(response));
		return getWikidataFromWikipedia([
            'Title 1',
            'Title 2'
        ], api).then((r) => {
            expect( r ).toStrictEqual( 'Q1' );
        } );
	} );
} );
