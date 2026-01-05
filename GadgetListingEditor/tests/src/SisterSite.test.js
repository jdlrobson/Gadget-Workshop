const SisterSite = require( '../../src/SisterSite' );
const wikidataResponse = require( './assets/wikidata.json' );
const ajaxMock = jest.fn( () => Promise.resolve() );
const postReponse = {
    claim: {
        id: 'test'
    }
};
const postWithToken = jest.fn( () => Promise.resolve( postReponse ) );

describe( 'SisterSite', () => {
    beforeEach( () => {
        $( '<input id="input-wikidata-value" value="T357">' ).appendTo( document.body );
        $.ajax = ajaxMock;
        class ForeignApiMock {
            postWithToken() {
                return postWithToken( arguments );
            }
        }
        mw.ForeignApi = ForeignApiMock;
    } );
    it( 'is a module', () => {
        const module = SisterSite();
        expect( module.SEARCH_PARAMS.action ).toBe( 'opensearch' );
        expect( module.API_WIKIDATA ).toBe( '//www.wikidata.org/w/api.php' );
        expect( module.API_WIKIPEDIA ).toBe( '//en.wikipedia.org/w/api.php' );
        expect( module.API_COMMONS ).toBe( '//commons.wikimedia.org/w/api.php' );
        module.ajaxSisterSiteSearch( module.API_WIKIDATA, {} ).then( () => {
            expect( $.ajax ).toHaveBeenCalledWith( {
                url: module.API_WIKIDATA,
                data: {
                    format: 'json',
                    origin: '*'
                }
            } );
        } );
    } );
    it( 'allows access to wikidata claims', () => {
        const { wikidataClaim } = SisterSite();
        const claim = wikidataClaim(
            wikidataResponse,
            'entity',
            'P1'
        );
        expect( claim ).toBe( 'P1-datavalue-mainsnak' );
    } );
    it( 'allows easy abstraction of wikipedia', () => {
        const { wikidataWikipedia } = SisterSite();
        const claim = wikidataWikipedia(
            wikidataResponse,
            'entity'
        );
        expect( claim ).toBe( 'Test wikipedia' );
    } );
    it( 'allows easy abstraction of wikipedia label', () => {
        const { wikidataLabel } = SisterSite();
        const claim = wikidataLabel(
            wikidataResponse,
            'entity'
        );
        expect( claim ).toBe( 'entityLabel' );
    } );
    it( 'allows easy abstraction of wikidata ID from wikipedia response', () => {
        const { wikipediaWikidata } = SisterSite();
        const claim = wikipediaWikidata(
            {
                query: {
                    pageids: [ '2' ],
                    pages: {
                        '2': {
                            pageprops: {
                                wikibase_item: 'Q1'
                            }
                        }
                    }
                }
            }
        );
        expect( claim ).toBe( 'Q1' );
    } );
    it( 'allows updating references on wikidata', () => {
        const { referenceWikidata } = SisterSite();
        mw.config.get = jest.fn( ( key ) => {
            switch ( key ) {
                case 'wgServer':
                    return '//en.wikivoyage.org';
                case 'wgArticlePath':
                    return '/wiki/';
                case 'wgPageName':
                    return 'X';
                case 'wgCurRevisionId':
                    return 1;
                default:
                    return '';
            }
        } );
        referenceWikidata( postReponse ).then( () => {
            expect( postWithToken ).toHaveBeenCalledTimes(1);
        } );
    } );
        it( 'allows removing references on wikidata', () => {
        const { unreferenceWikidata } = SisterSite();
        unreferenceWikidata( 'statement', 'references' ).then( () => {
            expect( postWithToken ).toHaveBeenCalledTimes(1);
        } );
    } );
    it( 'allows sending data to wikidata', () => {
        const { sendToWikidata } = SisterSite();
        sendToWikidata( 'P1', 'P1-value', 'string' ).then( () => {
            expect( postWithToken ).toHaveBeenCalledTimes(2);
        } );
    } );
    it( 'allows removing data on wikidata', () => {
        const { removeFromWikidata } = SisterSite();
        removeFromWikidata( 'P1', 'P1-value', 'string' ).then( () => {
            expect( postWithToken ).toHaveBeenCalledTimes(1);
        } );
    } );
    it( 'allows changing data on wikidata', () => {
        const { changeOnWikidata } = SisterSite();
        changeOnWikidata( 'P1', 'P1-value', 'string' ).then( () => {
            expect( postWithToken ).toHaveBeenCalledTimes(2);
        } );
    } );
} );
