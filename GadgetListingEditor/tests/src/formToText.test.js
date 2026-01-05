const formToText = require( '../../src/formToText' );
const { setSectionText, getSectionText } = require('../../src/currentEdit');
const { NOTTINGHAM, SEE_TEST } = require('./assets/see');

const content = 'Robin Hood innit!';
const sherwoodWikitext = `{{see
| name=[[Sherwood Forest]] Country Park | alt= | url= | email=
| address= | lat=53.205875 | long=-1.08609 | directions=
| phone= | tollfree=
| hours= | price=
| wikidata=Q919191
| lastedit=2017-03-21
| content=${content}
}}`;

const sherwoodJSON = {
    type: 'see',
    name: '[[Sherwood Forest]] Country Park',
    alt: '',
    url: '',
    email: '',
    address: '',
    lat: '53.205875',
    long: '-1.086090',
    directions: '',
    phone: '',
    tollfree: '',
    fax: '',
    hours: '',
    price: '',
    lastedit: '2017-03-21',
    content,
    checkin: '',
    checkout: '',
    wikipedia: '',
    image: '',
    wikidata: 'Q919191'
};

const dialogDestroy = jest.fn();
const dialogOpen = jest.fn();
const dialog = {
    destroy: dialogDestroy,
    open: dialogOpen
};

const windowReload = jest.fn();

describe( 'formToText', () => {
    beforeEach( () => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                href: 'https://wikipedia.org/wiki/Spain',
                hash: '#',
                reload: jest.fn()
            },
        } );
        class Api {
            postWithToken() {
                return Promise.resolve( {
                    edit: {
                        result: 'Success'
                    }
                } );
            }
        }
        mw.Api = Api;
    } );

	it( 'converts a form to text and appends it', () => {
        $( `<div>
    <input id='input-wikidata-value' value='Q919191'>
    <input id='input-lastedit' value='2017-03-21'>
    <input id='input-content' value='${content}'>
    <input id='input-long' value='-1.08609'>
    <input id='input-lat' value='53.205875'>
    <input id='input-type' value='see'>
    <input id='input-name' value='[[Sherwood Forest]] Country Park'>
` ).appendTo( document.body );
        window.location = {
            reload: windowReload
        };
		setSectionText( NOTTINGHAM );
        return formToText('add', sherwoodWikitext, sherwoodJSON, 15, dialog).then( () => {
            const MODIFIED_NOTTINGHAM = `${NOTTINGHAM}
* ${sherwoodWikitext}`;
            expect( window.location.reload ).toBeCalled();
            expect( getSectionText() ).toBe( MODIFIED_NOTTINGHAM );
        } )
	} );


	it( 'converts a form to text and modifies it', () => {
        $( `<div>
    <input id='input-wikidata-value' value='Q1'>
    <input id='input-lastedit' value='2017-03-21'>
    <input id='input-content' value='this is a test'>
    <input id='input-type' value='see'>
    <input id='input-name' value='Test'>
` ).appendTo( document.body );
        window.location = {
            reload: windowReload
        };
		setSectionText( NOTTINGHAM );
        return formToText('edit', SEE_TEST, {}, 15, dialog).then( () => {
            expect( window.location.reload ).toBeCalled();
            // reflect change in Wikidata value
            const MODIFIED_NOTTINGHAM = NOTTINGHAM.replace( SEE_TEST, sherwoodWikitext );
            expect( getSectionText() ).toBe( MODIFIED_NOTTINGHAM );
        } )
	} );
} );