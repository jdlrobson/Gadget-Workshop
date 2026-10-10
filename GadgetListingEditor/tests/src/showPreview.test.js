const showPreview = require( '../../src/showPreview.js' );

describe( 'showPreview', () => {
    beforeEach( () => {
        global.fetch = jest.fn(
            () => Promise.resolve(
                {
                    json: () => Promise.resolve( {
                        parse: {
                            text: {
                                '*': 'Preview'
                            }
                        }
                    } )
                }
            )
        );
    } );
	it( 'shows a preview of the listing', async () => {
        const preview = await showPreview({
            type: 'see',
            name: '[[Sherwood Forest]] Country Park',
            lat: '53.205875',
            long: '-1.08609',
            lastedit: '2017-03-21',
            content: 'hello',
            wikidata: 'Q919191'
        });
        expect( global.fetch ).toHaveBeenCalled();
        expect( preview ).toBe( 'Preview' );
	} );
} );