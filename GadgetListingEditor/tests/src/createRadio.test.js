const createRadio = require('../../src/createRadio');

describe( 'createRadio', () => {
    beforeEach(() => {
        const wikipediaInput = document.createElement( 'input' );
        wikipediaInput.id = 'input-wikipedia';
        wikipediaInput.value = 'City Ground';
        document.body.appendChild( wikipediaInput );
    });
    afterEach(() => {
        document.body.querySelector( '#input-wikipedia' ).remove();
    })
	it( 'creates radios', () => {
		const html = createRadio( {
            label: 'wikipedia',
            fields: [
                'wikipedia'
            ],
            doNotUpload: true,
            remotely_sync: true
        }, [
            'Nottingham Forest F.C.'
        ], 'Q19490' );
        const output = document.createElement( 'div' );
        output.innerHTML = html;
        const radios = output.querySelectorAll('input[type="radio"]')
        expect(radios.length).toBe(3);
        expect(radios[2].disabled).toBe(true);
        expect( html ).toMatchSnapshot();
	} );

    it( 'If doNotUpload is not set the input is not marked as disabled', () => {
		const html = createRadio( {
            label: 'wikipedia',
            fields: [
                'wikipedia'
            ]
        }, [
            'Nottingham Forest F.C.',
            null
        ], 'Q19490' );
        const output = document.createElement( 'div' );
        output.innerHTML = html;
        const radios = output.querySelectorAll('input[type="radio"]');
        expect(radios[2].disabled).toBe(false);
	} );
} );
