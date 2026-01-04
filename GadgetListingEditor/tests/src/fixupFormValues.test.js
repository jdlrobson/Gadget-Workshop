const fixupFormValues = require( '../../src/fixupFormValues.js' );
const { loadConfig } = require( '../../src/Config.js' );

describe( 'fixupFormValues', () => {
	const makeForm = () => {
		$('<div id="input-content">' ).appendTo(document.body);
		$('<div id="input-lat">' ).appendTo(document.body);
		$('<div id="input-long">' ).appendTo(document.body);
		$('<div id="input-url">' ).appendTo(document.body);
	};

	beforeEach(() => {
		$('#input-lat,#input-long,#input-content,#input-url').remove();
		window.alert = jest.fn();
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
		const validated = fixupFormValues();
		expect( validated ).toBe( true );
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
		const validated = fixupFormValues();
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
		const validated = fixupFormValues();
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Text without full stop' );

	} );

	it( 'validate (should not modify longitude and latitude when not set)', () => {
		makeForm();

		$('#input-lat').val( '   ' );
		const validated = fixupFormValues();
		expect( validated ).toBe( true );
		expect( $('#input-lat').val() ).toBe( '   ' );
	} );

	it( 'validate (accepts and modifies decimals)', () => {
		makeForm();

		$('#input-lat').val( '+32.30642' );
		$('#input-long').val( '-122.61458' );
		const validated = fixupFormValues();
		expect( validated ).toBe( true );
		expect( $('#input-lat').val() ).toBe( '32.306420' );
		expect( $('#input-long').val() ).toBe( '-122.614580' );
	} );
} );
