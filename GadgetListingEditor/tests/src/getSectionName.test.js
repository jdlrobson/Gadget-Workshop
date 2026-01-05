const getSectionName = require( '../../src/getSectionName' );
const { setSectionText } = require( '../../src/currentEdit' );

describe( 'getSectionName', () => {
	it( 'extracts the section name', () => {
        setSectionText( `== See ==
Hello Tin Tin!`);
        const name = getSectionName();
        expect( name ).toBe( 'See' );
	} );

    it( 'extracts no section name from the lead', () => {
        setSectionText( `Hello Tin Tin!`);
        const name = getSectionName();
        expect( name ).toBe( '' );
	} );
} );
