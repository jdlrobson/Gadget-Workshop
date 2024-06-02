const validateForm = require( '../../src/validateForm.js' );

const Callbacks = [];

const CallbacksFail = [
	( list ) => {
		list.push( 'A failure occurred' );
	}
];

describe( 'Core', () => {
	const makeForm = () => {
		$('<div id="input-content">' ).appendTo(document.body);
		$('<div id="input-lat">' ).appendTo(document.body);
		$('<div id="input-long">' ).appendTo(document.body);
		$('<div id="input-url">' ).appendTo(document.body);
	};

	beforeEach(() => {
		$('#input-lat,#input-long,#input-content,#input-url').remove();
	});
	it( 'validate (pass)', () => {
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( true );
	} );
	it( 'validate (fail)', () => {
		window.alert = jest.fn();
		const validated = validateForm( CallbacksFail );
		expect( validated ).toBe( false );
	} );

	it( 'validate (REPLACE_NEW_LINE_CHARS)', () => {
		makeForm();

		$('#input-lat').val( '0.1' );
		$('#input-long').val( '0.2' );
		$('#input-url').val( 'https://wikivoyage.org' );
		$('#input-content').val( 'Foo\nReplace' );
		const validated = validateForm( Callbacks, true, true );
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Foo<br />Replace.' );
	} );

	it( 'validate (APPEND_FULL_STOP_TO_DESCRIPTION)', () => {
		makeForm();

		$('#input-lat').val( '0.1' );
		$('#input-long').val( '0.2' );
		$('#input-url').val( 'https://wikivoyage.org' );
		$('#input-content').val( 'Text without full stop' );
		const validated = validateForm( Callbacks, false, false);
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Text without full stop' );

	} );

	it( 'validate (should not modify longitude and latitude when not set)', () => {
		makeForm();

		$('#input-lat').val( '   ' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( true );
		expect( $('#input-lat').val() ).toBe( '   ' );
	} );

	it( 'validate (fails when latitude and longitude do not resolve to numbers)', () => {
		makeForm();

		$('#input-lat').val( 'foo' );
		$('#input-long').val( 'bar' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (only accepts decimals)', () => {
		makeForm();

		$('#input-lat').val( '32° 18\' 23.1 N' );
		$('#input-long').val( '122° 36\' 52.5" W' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (accepts decimals)', () => {
		makeForm();

		$('#input-lat').val( '+32.30642' );
		$('#input-long').val( '-122.61458' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( true );
	} );

	it( 'validate (both latitude and longitude must be provided)', () => {
		makeForm();

		$('#input-lat').val( '+32.30642' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (both latitude and longitude must be provided 2)', () => {
		makeForm();

		$('#input-long').val( '-122.61458' );
		const validated = validateForm( Callbacks );
		expect( validated ).toBe( false );
	} );
} );
