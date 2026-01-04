const fixupFormValues = require( '../../src/fixupFormValues.js' );
const { loadConfig } = require( '../../src/Config.js' );

const Callbacks = [];

const CallbacksFail = [
	( list ) => {
		list.push( 'A failure occurred' );
	}
];

describe( 'fixupFormValues', () => {
	const makeForm = () => {
		$('<div id="input-content">' ).appendTo(document.body);
		$('<div id="input-lat">' ).appendTo(document.body);
		$('<div id="input-long">' ).appendTo(document.body);
		$('<div id="input-url">' ).appendTo(document.body);
	};

	beforeEach(() => {
		$('#input-lat,#input-long,#input-content,#input-url').remove();
	});

	it( 'shortens decimals to 6 places', () => {
		makeForm();

		$('#input-lat').val( '+32.306423333333' );
		$('#input-long').val( '-122.6145877777' );
		fixupFormValues( [] );
		expect( $('#input-lat').val() ).toBe( '32.306423' );
		expect( $('#input-long').val() ).toBe( '-122.614588' );
	} );

	it( 'retains zeroes', () => {
		makeForm();
		$('#input-lat').val( '+32.0000000' );
		$('#input-long').val( '-122.0000000' );
		fixupFormValues( [] );
		expect( $('#input-lat').val() ).toBe( '32.000000' );
		expect( $('#input-long').val() ).toBe( '-122.000000' );
	} );


	it( 'does not modify empty content', () => {
		loadConfig( {
			REPLACE_NEW_LINE_CHARS: true
		} );
		makeForm();
		$('#input-content').val( '' );
		fixupFormValues( [] );
		expect( $('#input-content').val() ).toBe( '' );
	} );

	it( 'validate (pass)', () => {
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( true );
	} );
	it( 'validate (fail)', () => {
		window.alert = jest.fn();
		const validated = fixupFormValues( CallbacksFail );
		expect( validated ).toBe( false );
	} );

	it( 'validate (REPLACE_NEW_LINE_CHARS)', () => {
		loadConfig( {
			REPLACE_NEW_LINE_CHARS: true,
			APPEND_FULL_STOP_TO_DESCRIPTION: true
		} );
		makeForm();

		$('#input-lat').val( '0.1' );
		$('#input-long').val( '0.2' );
		$('#input-url').val( 'https://wikivoyage.org' );
		$('#input-content').val( 'Foo\nReplace' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Foo<br />Replace.' );
	} );

	it( 'validate (APPEND_FULL_STOP_TO_DESCRIPTION)', () => {
		loadConfig( {
			REPLACE_NEW_LINE_CHARS: false,
			APPEND_FULL_STOP_TO_DESCRIPTION: false
		} );
		makeForm();

		$('#input-lat').val( '0.1' );
		$('#input-long').val( '0.2' );
		$('#input-url').val( 'https://wikivoyage.org' );
		$('#input-content').val( 'Text without full stop' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Text without full stop' );

	} );

	it( 'validate (should not modify longitude and latitude when not set)', () => {
		makeForm();

		$('#input-lat').val( '   ' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( true );
		expect( $('#input-lat').val() ).toBe( '   ' );
	} );

	it( 'validate (fails when latitude and longitude do not resolve to numbers)', () => {
		makeForm();

		$('#input-lat').val( 'foo' );
		$('#input-long').val( 'bar' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (only accepts decimals)', () => {
		makeForm();

		$('#input-lat').val( '32° 18\' 23.1 N' );
		$('#input-long').val( '122° 36\' 52.5" W' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (accepts and modifies decimals)', () => {
		makeForm();

		$('#input-lat').val( '+32.30642' );
		$('#input-long').val( '-122.61458' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( true );
		expect( $('#input-lat').val() ).toBe( '32.306420' );
		expect( $('#input-long').val() ).toBe( '-122.614580' );
	} );

	it( 'validate (both latitude and longitude must be provided)', () => {
		makeForm();

		$('#input-lat').val( '+32.30642' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( false );
	} );

	it( 'validate (both latitude and longitude must be provided 2)', () => {
		makeForm();

		$('#input-long').val( '-122.61458' );
		const validated = fixupFormValues( Callbacks );
		expect( validated ).toBe( false );
	} );
} );
