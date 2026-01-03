const { loadFromCountryData } = require( '../../src/localData' );

describe( 'loadFromCountryData', () => {
	it( 'extracts from the DOM', () => {
        const $countryData = $( `<div class="countryData"
    data-local-dialing-code="415"
    data-currency="$"
    data-country-calling-code="+44" />` );
		const {
            telephoneCodes,
            NATL_CURRENCY
        } = loadFromCountryData( $countryData );
		expect( telephoneCodes ).toStrictEqual( [ "+44", "415" ] );
		expect(  NATL_CURRENCY ).toStrictEqual( [ '$' ] );
	} );
} );
