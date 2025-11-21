const { translate } = require( './translate.js' );
const translatePlugin = {
    install: ( app ) => {
        const $translate = ( key, ...parameters ) => {
            return translate( key, ...parameters );
        }
        app.config.globalProperties.$translate = $translate;
        app.provide( 'translate', $translate );
    }
};
module.exports = translatePlugin;
