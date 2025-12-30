const wikiTextToListing = require('../../src/wikiTextToListing');

describe( 'wikiTextToListing', () => {
    it( 'converts wikiText to listings', () => {
        const listing = wikiTextToListing( `{{see
| name=Lace Market Theatre | alt= | url=http://www.lacemarkettheatre.co.uk/ | email=
| address=Halifax Place, near Fletcher Gate, NG1 1QN | lat=52.9516 | long=-1.1449 | directions=
| phone=+44 115 950-7201 | tollfree= | fax=
| hours= | price=
| wikidata=Q6468185| wikipedia=Lace Market Theatre
| content=Small, independent amateur theatre with an excellent reputation for its range of productions. Main auditorium seats 118, Studio seats 50. Licensed bar.
}}` );
        expect( listing ).toMatchSnapshot();
    } );
} );
