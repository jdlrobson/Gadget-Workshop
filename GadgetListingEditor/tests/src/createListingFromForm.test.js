const createListingFromForm = require( '../../src/createListingFromForm' );

describe( 'createListingFromForm', () => {
	it( 'creates a listing from form', () => {
        const listing = createListingFromForm({
            type: 'see',
            name: '[[Sherwood Forest]] Country Park',
            lat: '53.205875',
            long: '-1.08609',
            lastedit: '2017-03-21',
            content: 'hello',
            wikidata: 'Q919191'
        });
        expect( listing ).toStrictEqual( {
            address: undefined,
            alt: undefined,
            checkin: undefined,
            checkout: undefined,
            content: "hello",
            directions: undefined,
            email: undefined,
            fax: undefined,
            hours: undefined,
            image: undefined,
            lastedit: "2017-03-21",
            lat: "53.205875",
            long: "-1.08609",
            name: "[[Sherwood Forest]] Country Park",
            phone: undefined,
            price: undefined,
            tollfree: undefined,
            type: "see",
            url: undefined,
            wikidata: "Q919191",
            wikipedia: undefined,
        } );
	} );
} );