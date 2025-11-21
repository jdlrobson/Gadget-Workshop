const getSectionName = require( './getSectionName.js' );
const { translate } = require( './translate.js' );
const savePayload = require( './savePayload.js' );
const { getSectionText } = require( './currentEdit.js' );

/**
 * If an error occurs while saving the form, remove the "saving" dialog,
 * restore the original listing editor form (with all user content), and
 * display an alert with a failure message.
 */
const saveFailed = function(msg) {
    alert(msg);
};

/**
 * Execute the logic to post listing editor changes to the server so that
 * they are saved. After saving the page is refreshed to show the updated
 * article.
 */
var saveForm = function(summary, minor, sectionNumber, cid, answer) {
    var editPayload = {
        action: "edit",
        title: mw.config.get( "wgPageName" ),
        section: sectionNumber,
        text: getSectionText(),
        summary,
        captchaid: cid,
        captchaword: answer
    };
    if (minor) {
        $.extend( editPayload, { minor: 'true' } );
    }
    return savePayload( editPayload ).then(function(data) {
        if (data && data.edit && data.edit.result == 'Success') {
            if ( data.edit.nochange !== undefined ) {
                alert( 'Save skipped as there was no change to the content!' );
                return;
            }
            // since the listing editor can be used on diff pages, redirect
            // to the canonical URL if it is different from the current URL
            var canonicalUrl = $("link[rel='canonical']").attr("href");
            var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
            if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
                var sectionName = mw.util.escapeIdForLink(getSectionName());
                if (sectionName.length) {
                    canonicalUrl += `#${sectionName}`;
                }
                window.location.href = canonicalUrl;
            } else {
                window.location.reload();
            }
        } else if (data && data.error) {
            saveFailed(`${translate( 'submitApiError' )} "${data.error.code}": ${data.error.info}` );
            return Promise.reject( {} );
        } else if (data && data.edit.spamblacklist) {
            saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
            return Promise.reject( {} );
        } else if (data && data.edit.captcha) {
            return Promise.reject( {
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
            return Promise.reject( {} );
        }
    }, function(code, result) {
        if (code === "http") {
            saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
        } else if (code === "ok-but-empty") {
            saveFailed(translate( 'submitEmptyError' ));
        } else {
            saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
        }
        return Promise.reject( {} );
    });
};

module.exports = saveForm;
