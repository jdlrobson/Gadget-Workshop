const launchSyncDialog = require( '../../../src/sisterSiteApp/launchSyncDialog' );
const wikidataClaims = require( '../wikidataClaims.json');
const wikidataRecord = 'Q17642916';

describe( 'launchSyncDialog', () => {
    beforeEach( () => {
        document.body.innerHTML = '';
        $('<input id="input-image">').val('Foo.jpg').appendTo(document.body);
        $('<input id="input-lat">').val('').appendTo(document.body);
        $('<input id="input-long">').val('').appendTo(document.body);
    });

    it( 'has an autoSelect', () => {
        const updateModel = jest.fn();
        const jsonObj = Object.assign( {}, wikidataClaims );
        const ss = () => ( {
            API_WIKIDATA: '/test',
            sendToWikidata: () => Promise.resolve(),
            changeOnWikidata: () => Promise.resolve(),
            removeFromWikidata: () => Promise.resolve(),
            ajaxSisterSiteSearch: () => Promise.resolve()
        } );
		launchSyncDialog( jsonObj, wikidataRecord, updateModel, ss, () => {} );
        expect( $( '#listing-editor-sync' ).length ).toBe( 1 );
        $( '#listing-editor-sync #autoSelect' ).trigger( 'click' );
        $( '.listing-editor-dialog--wikidata-shared .submitButton' ).trigger( 'click' );
        expect( $( '#input-image' ).val() ).toBe( 'Foo.jpg' );
        expect( $( '#input-lat' ).val() ).toBe( '52.949167' );
        expect( $( '#input-long' ).val() ).toBe( '-1.154722' );
        expect( updateModel ).toHaveBeenCalledWith( {
            'wikipedia': 'Nottingham Castle'
        } );
	} );
} );
