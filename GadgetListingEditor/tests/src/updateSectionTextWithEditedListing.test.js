const updateSectionTextWithEditedListing = require('../../src/updateSectionTextWithEditedListing.js' );
const { setSectionText } = require( '../../src/currentEdit.js' );

describe( 'updateSectionTextWithEditedListing', () => {
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
` );
    } );

    afterEach( () => {
        setSectionText( '' );
    } );

    it( 'updates section text with edited listing', () => {
        const listing = updateSectionTextWithEditedListing(
            '/* Theatres */',
            `{{see
| name=Theatre Royal | alt= | url=http://sdss | email=
| address=Theatre Square, NG1 5ND | lat=52.955147 | long=-1.151389 | directions=
| phone=+44 115 989-5555 | tollfree=
| hours= | price=
| wikipedia=Theatre Royal, Nottingham | image=Theatre Royal, Nottingham - geograph.org.uk - 997109.jpg | wikidata=Q7777438
| content=Opened in 1865 this is one of the finest Victorian theatres in the UK. The Theatre Royal is Nottingham's main touring house, offering a wide range of productions including musicals, opera, ballet, drama and the annual pantomime. The world's longest-running stage play, Agatha Christie's ''The Mousetrap'' had its premiere here. Auditorium seats 1186 on four levels. Licensed bars, cafe and restaurant. The Theatre Royal is integrated into the Royal Centre which also includes the state-of-the-art Royal Concert Hall which has excellent acoustics, seats 2499, and welcomes world-class orchestras, rock bands and solo artists.
}}`,
            `{see
| name=Theatre Royal | alt= | url=https://trch.co.uk/ | email=
| address=Theatre Square, NG1 5ND | lat=52.955147 | long=-1.151389 | directions=
| phone=+44 115 989-5555 | tollfree=
| hours= | price=
| wikipedia=Theatre Royal, Nottingham | image=Theatre Royal, Nottingham - geograph.org.uk - 997109.jpg | wikidata=Q7777438
| content=Opened in 1865 this is one of the finest Victorian theatres in the UK. The Theatre Royal is Nottingham's main touring house, offering a wide range of productions including musicals, opera, ballet, drama and the annual pantomime. The world's longest-running stage play, Agatha Christie's ''The Mousetrap'' had its premiere here. Auditorium seats 1186 on four levels. Licensed bars, cafe and restaurant. The Theatre Royal is integrated into the Royal Centre which also includes the state-of-the-art Royal Concert Hall which has excellent acoustics, seats 2499, and welcomes world-class orchestras, rock bands and solo artists.
}}`
        );
        expect( listing ).toMatchSnapshot();
    } );
} );
