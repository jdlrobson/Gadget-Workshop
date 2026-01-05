const stripComments = require( '../../src/stripComments' );

describe( 'stripComments', () => {
    it( 'replaces rather than strips', () => {
        expect( stripComments( '<!-- foo --><!-- bar -->' ) ).toBe( '<<<COMMENT0>>><<<COMMENT1>>>' );
    } );
    it( 'but doesn\t touch anything other than comments', () => {
        expect( stripComments( '<!-- foo -->bar<!-- bar -->' ) ).toBe( '<<<COMMENT0>>>bar<<<COMMENT1>>>' );
    } );
} );