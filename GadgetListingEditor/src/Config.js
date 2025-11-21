let config = {};

let _loaded = false;
const loadConfig = ( newConfig, projectConfig ) => {
    if ( _loaded ) {
        mw.log.warn( 'Configuration was already loaded. @todo: fix this!' );
    }
    _loaded = true;
    config = Object.assign( {}, newConfig, projectConfig );
}

const getConfig = () => config;

module.exports = {
    loadConfig,
    getConfig
};
