/**
 * @param {string} path
 * @param {Object} [options]
 * @return {Promise<any>}
 */
module.exports = ( path, options ) => {
    return fetch( `${mw.config.get('wgServer')}/${path}`, options );
};
