let config = {};

let _loaded = false;
const loadConfig = ( newConfig, projectConfig ) => {
    if ( _loaded ) {
        throw new Error( 'Configuration was already loaded.' );
    }
    _loaded = true;
    config = Object.assign( {}, newConfig, projectConfig );
}

const getConfig = () => config;

module.exports = {
    loadConfig,
    getConfig
};
