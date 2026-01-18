const { nextTick } = require('vue');
const ListingEditorForm = require('../../../src/components/ListingEditorSync');
const translateDirective = require('../../../src/translateDirective');
const translatePlugin = require( '../../../src/translatePlugin' );
const { mount } = require( '@vue/test-utils' );

describe( 'ListingEditorSync', () => {
    it('renders', async () => {
        const wrapper = mount(ListingEditorForm, {
            props: {
                syncValues: [
                    {
                        field: {
                            label: 'a'
                        },
                        guid: 'a-guid',
                        wikidataUrl: 'http://wikidata.org/wiki/A',
                        localUrl: 'http://localhost/wiki/A',
                        localText: 'local A',
                        wikidataText: 'wikidata A'
                    }
                ]
            },
            global: {
                plugins: [ translatePlugin ],
                directives: {
                    'translate-html': translateDirective
                }
            }
        } );
        const html = wrapper.html();
        expect(html).toMatchSnapshot();
        expect(wrapper.findAll('#a-wd[checked]').length).toBe(0);
        wrapper.find( '.wikidata-update ~ a' ).trigger('click');
        await nextTick();
        expect(wrapper.findAll('#a-wd[checked]').length).toBe(1);
        wrapper.find( '.clear' ).trigger('click');
        await nextTick();
        expect(wrapper.findAll('#a-wd[checked]').length).toBe(0);
    });
} );

