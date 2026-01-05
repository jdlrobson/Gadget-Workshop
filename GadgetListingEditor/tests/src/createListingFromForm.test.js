const createListingFromForm = require( '../../src/createListingFromForm' );

describe( 'createListingFromForm', () => {
	it( 'creates a listing from form', () => {
        $( `<div>
    <input id='input-wikidata-value' value='Q919191'>
    <input id='input-lastedit' value='2017-03-21'>
    <input id='input-content' value='hello'>
    <input id='input-long' value='-1.08609'>
    <input id='input-lat' value='53.205875'>
    <input id='input-type' value='see'>
    <input id='input-name' value='[[Sherwood Forest]] Country Park'>
` ).appendTo( document.body );
        const listing = createListingFromForm({});
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