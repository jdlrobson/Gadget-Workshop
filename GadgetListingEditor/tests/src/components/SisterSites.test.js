const SisterSites = require('../../../src/components/SisterSites');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { mount } = require( '@vue/test-utils' );
const { nextTick } = require( 'vue' );
const wikidataClaims = require( '../wikidataClaims.json' );
const SisterSite = require('../../../src/SisterSite');
const { loadConfig } = require( '../../../src/Config.js' );
const enConfig = require( '../../../dist/en:Gadget-ListingEditor.json' );

// quickUpdateWikidataSharedFields mutates claim values in place (see the
// trimDecimal calls on res[key].latitude/longitude), and `require()` caches
// this fixture, so snapshot a pristine copy now, before any test below can
// mutate the shared object.
const pristineWikidataClaims = JSON.parse( JSON.stringify( wikidataClaims ) );

describe( 'SisterSites', () => {
    const mountForTest = ( api ) => {
        return mount(SisterSites, {
            props: {
                api: api || {
                    wikidataClaim: () => 'P1',
                    wikipediaWikidata: () => Promise.resolve({}),
                    ajaxSisterSiteSearch: () => {
                        return Promise.resolve( require( '../wikidataClaims.json' ) );
                    }
                },
                wikipedia: 'Nottingham Castle',
                wikidata: 'Q17642916',
                image: 'Nottingham Castle Gate 2009.jpg'
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
    };

    it('renders', () => {
        expect(mountForTest().html()).toMatchSnapshot();
    });
    it('can sync', async () => {
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
        const api = SisterSite();
        api.ajaxSisterSiteSearch = jest.fn( () => Promise.resolve( wikidataClaims ) );
        const app = mountForTest(api);
        app.find('#wikidata-shared-quick').trigger('click');
        await nextTick();
        await nextTick();
        await nextTick();
        await nextTick();
        expect(app.emitted('updated:listing'));
    });
    it('emits updated event on blur', () => {
        const app = mountForTest();
        app.find('#input-wikidata-label').trigger('blur');
        expect(app.emitted('updated:listing'));
    });
    it('shows synced wikipedia/image values as disabled placeholders and blanks the input when WIKIDATA_SYNC_PLACEHOLDER is enabled', async () => {
        loadConfig( Object.assign( {}, enConfig, { WIKIDATA_SYNC_PLACEHOLDER: true } ) );
        window.confirm = jest.fn(() => true);
        window.alert = jest.fn();
        const api = SisterSite();
        api.ajaxSisterSiteSearch = jest.fn( () => Promise.resolve( JSON.parse( JSON.stringify( pristineWikidataClaims ) ) ) );
        const app = mountForTest(api);
        app.find('#wikidata-shared-quick').trigger('click');
        for ( let i = 0; i < 6; i++ ) {
            await nextTick();
        }
        const wikipediaInput = app.find('#input-wikipedia');
        expect( wikipediaInput.element.value ).toBe('');
        expect( wikipediaInput.attributes('placeholder') ).toBe('Nottingham Castle');
        expect( wikipediaInput.attributes('disabled') ).toBeDefined();
        const imageInput = app.find('#input-image');
        expect( imageInput.element.value ).toBe('');
        expect( imageInput.attributes('placeholder') ).toBe('Nottingham Castle Gate 2009.jpg');
        expect( imageInput.attributes('disabled') ).toBeDefined();
        // restore the default config so later tests in this file aren't affected
        loadConfig( enConfig );
    });
} );

