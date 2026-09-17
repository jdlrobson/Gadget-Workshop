const { translate } = require( './translate.js' );

/**
 * @type {Vue.Plugin}
 */
const translatePlugin = {
    /**
     * @param {Vue.App} app
     */
    install: ( app ) => {
        /**
         * @param {string} key
         * @param  {...string} parameters
         * @return {string}
         */
        const $translate = ( key, ...parameters ) => {
            return translate( key, ...parameters );
        };
        app.config.globalProperties.$translate = $translate;
        app.provide( 'translate', $translate );
    }
};
module.exports = translatePlugin;
