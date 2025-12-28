const listingToStr = require( '../../src/listingToStr' );

const listingData = {
    type: 'see',
    name: 'Nottingham Forest FC',
    alt: '',
    url: 'https://www.nottinghamforest.co.uk/',
    email: '',
    address: 'Trentside N, West Bridgford NG2 5FJ',
    lat: '52.94',
    long: '-1.1328',
    directions: '',
    phone: '',
    tollfree: '',
    hours: '',
    price: '',
    wikipedia: 'Nottingham Forest F.C.',
    wikidata: 'Q19490',
    lastedit: '2022-05-29',
    content: 'Forest were promoted in 2022 and now play soccer in the Premier League, England\'s top tier. Their home stadium (capacity 30,000) is City Ground just south of the Trent, a one-mile walk from city centre. Their unique feat was to win two European titles yet only one domestic, and they long played in lower tiers until their 2022 promotion.',
    fax: '',
    checkin: '',
    checkout: '',
    image: ''
};

const expectedWikitext = `{{see
| name=Nottingham Forest FC | alt= | url=https://www.nottinghamforest.co.uk/ | email=
| address=Trentside N, West Bridgford NG2 5FJ | lat=52.94 | long=-1.1328 | directions=
| phone= | tollfree=
| hours= | price=
| wikipedia=Nottingham Forest F.C. | wikidata=Q19490
| lastedit=2022-05-29
| content=Forest were promoted in 2022 and now play soccer in the Premier League, England's top tier. Their home stadium (capacity 30,000) is City Ground just south of the Trent, a one-mile walk from city centre. Their unique feat was to win two European titles yet only one domestic, and they long played in lower tiers until their 2022 promotion.
}}`;

describe( 'listingToStr', () => {
	it( 'object can be converted to listing wikitext', () => {
        const wikitext = listingToStr( listingData );
		expect( wikitext ).toBe( expectedWikitext );
	} );

	it( 'object can contain unexpected values', () => {
        const wikitext = listingToStr( Object.assign( listingData, {
            random: 'random text',
            randomEmpty: ''
        } ) );
		expect( wikitext ).toContain( '| random=random text' );
    } );

	it( 'works with custom types', () => {
        const wikitext = listingToStr( Object.assign( listingData, {
            type: 'random'
        } ) );
		expect( wikitext ).toContain( '| type=random' );
    } );
} );
