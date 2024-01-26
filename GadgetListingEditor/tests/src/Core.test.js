const Core = require( '../../src/Core.js' );

const Callbacks = {
	VALIDATE_FORM_CALLBACKS: []
};

const CallbacksFail = {
	VALIDATE_FORM_CALLBACKS: [
		( list ) => {
			list.push( 'A failure occurred' );
		}
	]
};

const Config = {};
const PROJECT_CONFIG = {};
const translate = () => {};

describe( 'Core', () => {
	it( 'validate (pass)', () => {
		const core = Core( Callbacks, Config, PROJECT_CONFIG, translate );
		const validated = core.test.validateForm();
		expect( validated ).toBe( true );
	} );
	it( 'validate (fail)', () => {
		window.alert = jest.fn();
		const core = Core( CallbacksFail, Config, PROJECT_CONFIG, translate );
		const validated = core.test.validateForm();
		expect( validated ).toBe( false );
	} );
} );
