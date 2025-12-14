const api = new mw.Api();

const savePayload = ( editPayload ) => {
    const delayedPromise = ( res ) =>
        new Promise( ( resolve ) => {
            setTimeout(() => {
                resolve( res )
            }, 5000 );
        } );
    switch ( window.__save_debug ) {
        case -1:
            return delayedPromise( { error: 'error' } );
        case -2:
            return delayedPromise( {
                edit: {
                    captcha: {
                        id: 1,
                        url: 'foo.gif'
                    }
                }
            } );
        case 0:
            return delayedPromise( {
                edit: {
                    nochange: true,
                    result: 'Success'
                }
            } );
        case 1:
            return delayedPromise( {
                edit: {
                    result: 'Success'
                }
            } );
        default:
            return api.postWithToken(
                "csrf",
                editPayload
            )
    }
};

module.exports = savePayload;
