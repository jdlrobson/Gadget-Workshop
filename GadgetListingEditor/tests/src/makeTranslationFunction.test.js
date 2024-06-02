const makeTranslationFunction = require( '../../src/makeTranslateFunction' );

describe( 'makeTranslationFunction', () => {
	it( 'creates a function for translations', () => {
        const translate = makeTranslationFunction( { a: 'hello', b: 'goodbye', d: 'hi $1' } );
        translate( 'a' );
		expect( translate( 'a' ) ).toBe( 'hello' );
		expect( translate( 'b' ) ).toBe( 'goodbye' );
		expect( () => {
            translate( 'c' );
        } ).toThrow();
		expect( translate( 'd', [ 'jago' ] ) ).toBe( 'hi jago' );
	} );
} );
