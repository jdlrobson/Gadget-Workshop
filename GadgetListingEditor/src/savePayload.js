/**
 * @param {Object} editPayload
 * @return {AbortableJQueryDeferred<MwApiEditResponse>}
 */
const savePayload = ( editPayload ) => {
    const api = new mw.Api();
    let abortedByUser = false;
    /**
     * @param {JQuery.Deferred<any>} rtn
     */
    const abort = ( rtn ) => {
        return () => {
            abortedByUser = true;
            rtn.reject( 'http', {
                textStatus: 'Aborted by user'
            } );
        };
    };
    /**
     * @param {string} res
     * @param {Object} [data]
     * @return {AbortableJQueryDeferred<MwApiEditResponse>}
     */
    const delayedReject = ( res, data ) => {
        const rtn = /** @type {AbortableJQueryDeferred<MwApiEditResponse>} */$.Deferred();
        setTimeout(() => {
            if ( !abortedByUser ) {
                rtn.reject( res, data );
            }
        }, window.__save_debug_timeout || 5000 );
        return Object.assign( rtn, {
            abort: abort( rtn )
        } );
    };
    /**
     * @param {Object} res
     * @return {AbortableJQueryDeferred<MwApiEditResponse>}
     */
    const delayedPromise = ( res ) => {
        const rtn = /** @type {AbortableJQueryDeferred<MwApiEditResponse>} */$.Deferred();
        setTimeout(() => {
            if ( !abortedByUser ) {
                rtn.resolve( res );
            }
            rtn.resolve( res );
        }, window.__save_debug_timeout || 5000 );
        return Object.assign( rtn, {
            abort: abort( rtn )
        } );
    };
    switch ( window.__save_debug ) {
        case -1:
            return delayedPromise( {
                error: {
                    code: 3,
                    info: 'Debug error'
                }
            } );
        case -2:
            return delayedPromise( {
                edit: {
                    captcha: {
                        id: 1,
                        url: 'foo.gif'
                    }
                }
            } );
        case -3:
            return delayedPromise( {
                edit: {
                    spamblacklist: true
                }
            } );
        case -4:
            return delayedReject(
                'http',
                { textStatus: 'http error ' }
            );
        case -5:
            return delayedReject(
                'ok-but-empty'
            );
        case -6:
            return delayedReject(
                'unknown'
            );
        case -7:
            return delayedPromise( {
                edit: {}
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
            // @ts-ignore returns JQueryXHR
            return api.postWithToken(
                "csrf",
                editPayload
            );
    }
};

module.exports = savePayload;
