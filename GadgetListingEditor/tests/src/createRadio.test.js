const createRadio = require('../../src/createRadio');

describe( 'createRadio', () => {
    beforeEach(() => {
        const wikipediaInput = document.createElement( 'input' );
        wikipediaInput.id = 'input-wikipedia';
        wikipediaInput.value = 'City Ground';
        document.body.appendChild( wikipediaInput );

        const commonsInput = document.createElement( 'input' );
        commonsInput.id = 'input-image';
        commonsInput.value = 'City Ground Remastered.jpg';
        document.body.appendChild( commonsInput );

        const latInput = document.createElement( 'input' );
        latInput.id = 'input-lat';
        latInput.value = '52.94';
        document.body.appendChild( latInput );

        const lonInput = document.createElement( 'input' );
        lonInput.id = 'input-long';
        lonInput.value = '-1.1328';
        document.body.appendChild( lonInput );
    });

    afterEach(() => {
        document.body.querySelector( '#input-wikipedia' ).remove();
        document.body.querySelector( '#input-image' ).remove();
    });

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

    it( 'can create radios for commons images', () => {
		const html = createRadio(
            {
                p: 'P18',
                label: 'image',
                fields: [
                    'image'
                ]
            },
            [
                'City Ground, Nottingham - geograph.org.uk - 83567.jpg'
            ],
            '19490$7280466D-A077-4FB8-B6B5-A156FFC7AB63'
        )
        const output = document.createElement( 'div' );
        output.innerHTML = html;
        const radios = output.querySelectorAll('input[type="radio"]');
        expect(radios[2].disabled).toBe(false);
	} );

    it( 'can create radios for lat / lon', () => {
		const html = createRadio(
            {
                p: 'P625',
                label: 'coordinates',
                fields: [
                    'lat',
                    'long'
                ],
                remotely_sync: false
            },
            [
                null
            ],
            null
        );
        const output = document.createElement( 'div' );
        output.innerHTML = html;
        const radios = output.querySelectorAll('input[type="radio"]');
        expect(radios[2].disabled).toBe(false);
	} );

    it( 'can create radios for lat / lon with values', () => {
		const html = createRadio(
            {
                p: 'P625',
                label: 'coordinates',
                fields: [
                    'lat',
                    'long'
                ],
                remotely_sync: false
            },
            [
                '52.94',
                '12.2209'
            ],
            null
        );
        expect(html).toMatchSnapshot();
	} );

    it( 'has edge cases', () => {
        const html = createRadio(
            {
                label: 'edgecase1',
                fields: [],
                doNotUpload: true
            },
            [
                ''
            ],
            null
        );
        expect(html).toBe('');
    } );

    it( 'has edge cases (2)', () => {
        const html = createRadio(
            {
                label: 'edgecase2',
                fields: [],
                remotely_sync: false
            },
            [],
            null
        );
        expect(html).toBe('');
    } );

    it( 'when remote flag is set creates hidden div', () => {
        const html = createRadio(
            {
                label: 'radiolabel',
                fields: [],
                remotely_sync: true
            },
            [],
            null
        );
        expect(html).toMatchSnapshot();
    } );
} );
