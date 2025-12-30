const updateSectionTextWithAddedListing = require('../../src/updateSectionTextWithAddedListing.js' );
const { setSectionText } = require( '../../src/currentEdit.js' );

describe( 'updateSectionTextWithAddedListing', () => {
    beforeEach( () => {
        setSectionText( `===Theatres===

* {{see
| name=Theatre Royal | alt= | url=https://trch.co.uk/ | email=
| address=Theatre Square, NG1 5ND | lat=52.955147 | long=-1.151389 | directions=
| phone=+44 115 989-5555 | tollfree=
| hours= | price=
| wikipedia=Theatre Royal, Nottingham | image=Theatre Royal, Nottingham - geograph.org.uk - 997109.jpg | wikidata=Q7777438
| content=Opened in 1865 this is one of the finest Victorian theatres in the UK. The Theatre Royal is Nottingham's main touring house, offering a wide range of productions including musicals, opera, ballet, drama and the annual pantomime. The world's longest-running stage play, Agatha Christie's ''The Mousetrap'' had its premiere here. Auditorium seats 1186 on four levels. Licensed bars, cafe and restaurant. The Theatre Royal is integrated into the Royal Centre which also includes the state-of-the-art Royal Concert Hall which has excellent acoustics, seats 2499, and welcomes world-class orchestras, rock bands and solo artists.
}}
* {{-}}
` );
    } );

    afterEach( () => {
        setSectionText( '' );
    } );

    it( 'updates section text with added listing', () => {
        const listing = updateSectionTextWithAddedListing(
            '/* Theatres */',
            `{{see
| name=Foo | alt= | url= | email=
| address= | lat= | long= | directions=
| phone= | tollfree=
| hours= | price=
| lastedit=2025-12-30
| content=
}}`,
            {
                type: 'see',
                name: 'Singapore Zoo'
            }
        );
        expect( listing ).toMatchSnapshot();
    } );

     it( 'updates section text differently for Italian wikipedia with added listing', () => {
        const listing = updateSectionTextWithAddedListing.test.updateSectionTextWithAddedListingIt(
            '/* Theatres */',
            `{{see
| name=Foo | alt= | url= | email=
| address= | lat= | long= | directions=
| phone= | tollfree=
| hours= | price=
| lastedit=2025-12-30
| content=
}}`,
            {
                type: 'see',
                name: 'Singapore Zoo'
            }
        );
        expect( listing ).toMatchSnapshot();
     } );
} );
