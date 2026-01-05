const saveForm = require( '../../src/saveForm' );

const dialog = {
    open() {},
    destroy() {}
};

describe( 'saveForm', () => {
    beforeEach( () => {
        window.alert = jest.fn();
        window.__save_debug_timeout = 1;
    } );
	it( 'alerts if save skipped', () => {
        window.__save_debug = 0;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'alerts if save failed', () => {
        window.__save_debug = -1;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'requires handling in event of captcha', () => {
        window.__save_debug = -2;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).not.toBeCalled();
        } );
	} );
	it( 'alerts if save failed due to spam blacklist', () => {
        window.__save_debug = -3;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'alerts on http error', () => {
        window.__save_debug = -4;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'alerts on empty error', () => {
        window.__save_debug = -5;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'alerts on unknown error', () => {
        window.__save_debug = -6;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'alerts on unexpected response', () => {
        window.__save_debug = -7;
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( null, () => {
            expect( window.alert ).toBeCalled();
        } );
	} );
	it( 'reloads when successful', () => {
        window.__save_debug = 1;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                href: 'https://en.wikipedia.org/w/index.php?title=Spain',
                hash: '#',
                reload: jest.fn()
            },
        } );
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( () => {
            expect( window.location.reload ).toBeCalled();
        } );
	} );
	it( 'rewrites to canonical url', () => {
        window.__save_debug = 1;
        mw.util.escapeIdForLink = jest.fn( () => 'section' );
        $('<link rel="canonical" href="https://en.wikipedia.org/wiki/Spain">').appendTo( document.head );
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( () => {
            expect( window.location.href ).toBe( 'https://en.wikipedia.org/wiki/Spain#section' );
        } );
    } );
	it( 'rewrites to canonical url without section hash if none found', () => {
        window.__save_debug = 1;
        mw.util.escapeIdForLink = jest.fn( () => '' );
        $('<link rel="canonical" href="https://en.wikipedia.org/wiki/Spain">').appendTo( document.head );
        return saveForm( 'edit summary', true, 0, null, null, dialog ).then( () => {
            expect( window.location.href ).toBe( 'https://en.wikipedia.org/wiki/Spain' );
        } );
    } );
} );