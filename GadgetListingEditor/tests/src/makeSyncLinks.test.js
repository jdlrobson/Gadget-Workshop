const makeSyncLinks = require('../../src/makeSyncLinks');

describe( 'makeSyncLinks', () => {
    beforeEach(() => {
        const wikipediaInput = document.createElement( 'input' );
        wikipediaInput.id = 'input-image';
        wikipediaInput.value = 'City Ground.jpg';
        document.body.appendChild( wikipediaInput );

        const latInput = document.createElement( 'input' );
        latInput.id = 'input-lat';
        latInput.value = '52.94';
        document.body.appendChild( latInput );

        const lonInput = document.createElement( 'input' );
        lonInput.id = 'input-long';
        lonInput.value = '-1.1328';
        document.body.appendChild( lonInput );
    });

    it( 'makes half a link', () => {
        const link = makeSyncLinks( ['#input-image'], 'P18',  true );
        expect( link ).toMatchSnapshot();
        const linkUrl = makeSyncLinks( ['https://nottinghamforest.co.uk'], 'P856',  false );
        expect( linkUrl ).toMatchSnapshot();
        const linkLatLon = makeSyncLinks( ['#input-lat', '#input-long'], 'P625',  true );
        expect( linkLatLon ).toMatchSnapshot();
    } );
} );
