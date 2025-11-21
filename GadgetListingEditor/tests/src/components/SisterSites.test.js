const SisterSites = require('../../../src/components/SisterSites');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { mount } = require( '@vue/test-utils' );

describe( 'SisterSites', () => {
    const mountForTest = () => {
        return mount(SisterSites, {
            props: {
                api: {
                    wikipediaWikidata: () => Promise.resolve({}),
                    ajaxSisterSiteSearch: (props) => {
                        console.log('riunning site search', props);
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
} );

