const { createApp } = require( 'vue' );
const translatePlugin = require( './translatePlugin.js' );
const translateDirective = require( './translateDirective.js' );

const createListingEditorApp = ( component, props ) => {

    const app = createApp( component, props );
    app.use( translatePlugin );

    app.directive( 'translate-html', translateDirective );

    return app;
};

module.exports = createListingEditorApp;
