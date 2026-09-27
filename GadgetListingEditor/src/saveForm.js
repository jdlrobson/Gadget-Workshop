const getSectionName = require( './getSectionName.js' );
const { translate } = require( './translate.js' );
const savePayload = require( './savePayload.js' );
const { getSectionText } = require( './currentEdit.js' );
const { getConfig } = require( './Config.js' );

/**
 * If an error occurs while saving the form, remove the "saving" dialog,
 * restore the original listing editor form (with all user content), and
 * display an alert with a failure message.
 *
 * @param {string} msg
 */
const saveFailed = function(msg) {
    alert(msg);
};

/**
 * @param {any} [data]
 * @return {AbortableJQueryDeferred<any>}
 */
const abortableReject = ( data ) => {
    const reject = Promise.reject( data );
    return Object.assign( reject, {
        abort: () => {}
    } );
};
/**
 * @param {any} [data]
 * @return {AbortableJQueryDeferred<Object>}
 */
const abortableResolve = ( data ) => {
    const resolve = Promise.resolve( data );
    return Object.assign( resolve, {
        abort: () => {}
    } );
};

/**
 * Execute the logic to post listing editor changes to the server so that
 * they are saved. After saving the page is refreshed to show the updated
 * article.
 *
 * @param {string} summary
 * @param {boolean} minor
 * @param {number} sectionNumber
 * @param {string} cid
 * @param {string} answer
 * @return {AbortableJQueryDeferred<Object>}
 */
const saveForm = function(summary, minor, sectionNumber, cid, answer) {
    const { EDITOR_TAG } = getConfig();
    var editPayload = {
        action: "edit",
        title: mw.config.get( "wgPageName" ),
        tags: EDITOR_TAG,
        section: sectionNumber,
        text: getSectionText(),
        summary,
        captchaid: cid,
        captchaword: answer
    };
    if (minor) {
        $.extend( editPayload, { minor: 'true' } );
    }
    const payload = savePayload(editPayload);
    const abort = payload.abort;
    const newPayload = payload.then(function(/** @type {MwApiEditResponse} */ data) {
        if (data && data.edit && data.edit.result == 'Success') {
            if ( data.edit.nochange !== undefined ) {
                alert( 'Save skipped as there was no change to the content!' );
                return abortableResolve();
            }
            // since the listing editor can be used on diff pages, redirect
            // to the canonical URL if it is different from the current URL
            var canonicalUrl = $("link[rel='canonical']").attr("href");
            var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
            if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
                // @ts-ignore needs @wikimedia/types-wikimedia update
                var sectionName = mw.util.escapeIdForLink(getSectionName());
                if (sectionName.length) {
                    canonicalUrl += `#${sectionName}`;
                }
                window.location.href = canonicalUrl;
            } else {
                window.location.reload();
            }
            return;
        } else if (data && data.error) {
            saveFailed(`${translate( 'submitApiError' )} "${data.error.code}": ${data.error.info}` );
            return abortableReject( {} );
        } else if (data && data.edit.spamblacklist) {
            saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
            return abortableReject( {} );
        } else if (data && data.edit.captcha) {
            return abortableReject( {
                edit: data.edit,
                    args: [
                    summary,
                    minor,
                    sectionNumber,
                    data.edit.captcha.id
                ]
            } );
        } else {
            saveFailed(translate( 'submitUnknownError' ));
            return abortableReject( {} );
        }
    }, function(/** @type {string} */code, /** @type {{textStatus?: string}} */ result) {
        if (code === "http") {
            saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
        } else if (code === "ok-but-empty") {
            saveFailed(translate( 'submitEmptyError' ));
        } else {
            saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
        }
        return abortableReject( {} );
    });
    return Object.assign( newPayload, {
        abort
    } );
};

module.exports = saveForm;
