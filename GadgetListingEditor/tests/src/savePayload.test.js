const savePayload = require( '../../src/savePayload' );
const { NOTTINGHAM } = require('./assets/see');

describe( 'savePayload', () => {
    beforeEach( () => {
        class Api {
            postWithToken() {
                return Promise.resolve( {
                    edit: {
                        result: 'Success'
                    }
                } );
            }
        }
        mw.Api = Api;
        window.__save_debug_timeout = 1;
        window.__save_debug = undefined;
    } );
	it( 'posts and returns result', () => {
        savePayload( NOTTINGHAM ).then( (r) => {
            expect( r.edit.result ).toBe( 'Success' );
        } )
	} );

	it( 'for debugging we can force it to return successfully', () => {
        window.__save_debug = 1;
        return savePayload( NOTTINGHAM ).then( (r) => {
            expect( r.edit.result ).toBe( 'Success' );
            expect( r.edit.nochange ).toBe( undefined );
        } );
	} );

	it( 'for debugging we can force it to return success with no changes', () => {
        window.__save_debug = 0;
        return savePayload( NOTTINGHAM ).then( (r) => {
            expect( r.edit.result ).toBe( 'Success' );
            expect( r.edit.nochange ).toBe( true );
        } );
	} );

	it( 'for debugging we can force it to return errors', () => {
        window.__save_debug = -1;
        return savePayload( NOTTINGHAM ).then( (r) => {
            expect( r.error.info ).toBe( 'Debug error' );
        } );
	} );

	it( 'for debugging we can force it to return captcha', () => {
        window.__save_debug = -2;
        return savePayload( NOTTINGHAM ).then( ( r ) => {
            expect( r.edit.captcha.id ).toBe( 1 );
        } );
	} );
} );