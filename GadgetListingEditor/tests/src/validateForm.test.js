const validateForm = require( '../../src/validateForm.js' );

const Callbacks = [];

const CallbacksFail = [
	( list ) => {
		list.push( 'A failure occurred' );
	}
];

describe( 'Core', () => {
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
		$('<div id="input-content">' ).appendTo(document.body);
		$('<div id="input-lat">' ).appendTo(document.body);
		$('<div id="input-long">' ).appendTo(document.body);
		$('<div id="input-url">' ).appendTo(document.body);

		$('#input-lat').val( '0.1' );
		$('#input-lon').val( '0.2' );
		$('#input-url').val( 'https://wikivoyage.org' );
		$('#input-content').val( 'Foo\nReplace' );
		const validated = validateForm( Callbacks, true );
		expect( validated ).toBe( true );
		expect( $('#input-content').val() ).toBe( 'Foo<br />Replace.' );
	} );
} );
