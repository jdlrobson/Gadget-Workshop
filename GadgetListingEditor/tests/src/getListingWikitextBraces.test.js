const getListingWikitextBraces = require('../../src/getListingWikitextBraces');
const { setSectionText } = require( '../../src/currentEdit.js' );
describe('getListingWikitextBraces', () => {
    it('scans section text for location', () => {
        setSectionText(`This is not a listing its just some text.

* {{see}}
* {{listing|type=eat}}
* {{listing|type=do}}

[[File:Foo]]

More listings follow:
* {{listing|type=drink|name=the bar}}
`);
        const listingOne = getListingWikitextBraces(1);
        expect(listingOne).toBe('{{listing|type=eat}}');
        const listingThree = getListingWikitextBraces(3);
        expect(listingThree).toBe('{{listing|type=drink|name=the bar}}');
    });
});
