const asyncGetColor = require( '../../src/asyncGetColor' );

const respondWithColor = jest.fn( () => {
    let response = {
        parse: {
            text: {
                '*': '<div>33ffff</div>'
            }
        }
    };
    return Promise.resolve( response );
} );

const respondWithBlank = jest.fn( () => {
    let response = {
        parse: {
            text: {
                '*': ''
            }
        }
    };
    return Promise.resolve( response );
} );

describe( 'asyncGetColor', () => {
    beforeEach( () => {
        const cache = {};
        mw.storage = {
            get: ( key ) => cache[key],
            set: ( key, value ) => {
                cache[key] = value;
            }
        }
    } );
	it( 'caches', () => {
        $.ajax = respondWithColor;
		asyncGetColor( 'type' ).then( ( color ) => {
            expect( color ).toBe( '#33ffff' );
            asyncGetColor( 'type' );
            expect( respondWithColor ).toHaveBeenCalledTimes(1);
        } );
	} );
    it( 'doesnt resolve if cannot resolve template', () => {
        $.ajax = respondWithBlank;
		asyncGetColor( 'type' ).then( ( color ) => {
            expect( color ).toBe( '' );
            asyncGetColor( 'type' );
            expect( respondWithBlank ).toHaveBeenCalledTimes(2);
        } );
	} );
} );
