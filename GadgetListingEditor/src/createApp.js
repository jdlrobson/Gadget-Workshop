const { createApp } = require( 'vue' );
const { translate } = require( './translate.js' );

const createListingEditorApp = ( component, props ) => {
    const translatePlugin = {
        install: ( app ) => {
            const $translate = ( key, ...parameters ) => {
                return translate( key, ...parameters );
            }
            app.config.globalProperties.$translate = $translate;
            app.provide( 'translate', $translate );
        }
    };

    const app = createApp( component, props );
    app.use( translatePlugin );

    const renderI18nHtml = ( el, binding ) => {
        el.innerHTML = translate( binding.arg || binding.value )
    };

    app.directive( 'translate-html', {
        mounted: renderI18nHtml
    } );

    return app;
};

module.exports = createListingEditorApp;
