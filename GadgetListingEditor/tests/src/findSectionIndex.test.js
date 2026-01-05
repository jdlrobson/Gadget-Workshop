const findSectionIndex = require( '../../src/findSectionIndex' );

describe( 'findSectionIndex', () => {
    it( 'returns undefined if no heading', () => {
        expect( findSectionIndex() ).toBe( 0 );
    } );
    it( 'relies on edit link in a really non-future proof way', () => {
        $(
            '<h2>heading<span class="mw-editsection"><a href="?action=edit&section=4">edit</a></span></h2>'
        ).appendTo( document.body );
        expect( findSectionIndex( $( 'h2' ) ) ).toBe( '4' );
    } );
} );