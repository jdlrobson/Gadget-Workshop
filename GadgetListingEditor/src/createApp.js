const { createApp } = require( 'vue' );
const translatePlugin = require( './translatePlugin.js' );
const translateDirective = require( './translateDirective.js' );

/**
 * @param {Vue.Component} component
 * @param {Record<string, any>} props
 * @return {Vue.App}
 */
const createListingEditorApp = ( component, props ) => {

    const app = createApp( component, props );
    app.use( translatePlugin );

    app.directive( 'translate-html', translateDirective );

    return app;
};

module.exports = createListingEditorApp;
