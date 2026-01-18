const quickUpdateWikidataSharedFields = require( '../../../src/sisterSiteApp/quickUpdateWikidataSharedFields' );
const wikidataClaims = require( '../wikidataClaims.json' );
const SisterSite = require( '../../../src/SisterSite' );

const confirmMock = jest.fn(() => true);
describe( 'quickUpdateWikidataSharedFields', () => {
	beforeEach(() => {
		window.confirm = confirmMock;
		$( '<input id="input-wikipedia" value="remotely synced">' ).appendTo( document.body );
		$( '<input id="input-image" value="remotely synced">' ).appendTo( document.body );
		$( '<input id="input-url">' ).appendTo( document.body );
		$( '<input id="input-lat">' ).appendTo( document.body );
		$( '<input id="input-long">' ).appendTo( document.body );
	})
	it( 'maps results', () => {
		const api = SisterSite();
		api.ajaxSisterSiteSearch = jest.fn( () => Promise.resolve( wikidataClaims ) );
		quickUpdateWikidataSharedFields(
			'Q17642916',
			api
		).then( ( result ) => {
			expect( result ).toStrictEqual( {
				commons: 'Nottingham Castle Gate 2009.jpg',
				wikipedia: 'Nottingham Castle'
			} );
			expect($('#input-lat').val()).toBe('52.949167');
			expect($('#input-long').val()).toBe('-1.154722');
			expect($('#input-url').val()).toBe('https://www.nottinghamcastle.org.uk/');
			expect($('#input-image').val()).toBe('remotely synced');
			expect($('#input-wikipedia').val()).toBe('remotely synced');
		} );
		expect( api.ajaxSisterSiteSearch ).toBeCalled();
	} );
} );
