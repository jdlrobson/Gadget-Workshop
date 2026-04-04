/* global require, global */
'use strict';

const config = require( './dist/Gadget-ListingEditor.json' );
const mockMediaWiki = require( '@wikimedia/mw-node-qunit/src/mockMediaWiki.js' );
global.mw = mockMediaWiki();
global.mw.config = {
    get: ( key ) => {
        switch ( key ) {
            case 'wgUserLanguage':
                return 'en';
            case 'wgPageViewLanguage':
                return 'en';
            default:
                return `-- ${key} --`;
        }
    }
};
global.$ = require( 'jquery' );
global.mw.util.wikiUrlencode = ( a ) => a;
global.mw.util.showPortlet = function () {};
global.mw.Api.prototype.saveOption = function () {};
global.mw.loader.require = ( name ) => {
    switch( name ) {
        case 'vue':
            return {
                defineComponent: ( name ) => {
                    return name
                }
            }
        default:
            return {};
    }
};
const { init } = require( './src/translate' );
const { loadConfig } = require( './src/Config.js' );
init( require( './src/i18n/en' ) );
loadConfig( require( './dist/en:Gadget-ListingEditor.json' ) );

window.Vue = require( 'vue' );
window.VueCompilerDOM = require( '@vue/compiler-dom' );
