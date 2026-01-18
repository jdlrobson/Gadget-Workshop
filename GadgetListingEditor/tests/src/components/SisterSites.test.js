const SisterSites = require('../../../src/components/SisterSites');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { mount } = require( '@vue/test-utils' );
const { nextTick } = require( 'vue' );
const wikidataClaims = require( '../wikidataClaims.json' );
const SisterSite = require('../../../src/SisterSite');

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
} );

