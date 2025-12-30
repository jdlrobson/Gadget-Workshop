const getSectionName = require( './getSectionName.js' );
const { translate } = require( './translate.js' );
const savePayload = require( './savePayload.js' );
const { getSectionText } = require( './currentEdit.js' );
const { EDITOR_FORM_SELECTOR } = require( './selectors.js' );
var SAVE_FORM_SELECTOR = '#progress-dialog';
var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
/**
 * If the result of an attempt to save the listing editor content is a
 * Captcha challenge then display a form to allow the user to respond to
 * the challenge and resubmit.
 */
var captchaDialog = function(summary, minor, sectionNumber, captchaImgSrc, captchaId, dialog) {
    // if a captcha dialog is already open, get rid of it
    if ($(CAPTCHA_FORM_SELECTOR).length > 0) {
        dialog.destroy(CAPTCHA_FORM_SELECTOR);
    }
    var captcha = $('<div id="captcha-dialog">').text(translate( 'externalLinks' ));
    $('<img class="fancycaptcha-image">')
            .attr('src', captchaImgSrc)
            .appendTo(captcha);
    $('<label for="input-captcha">').text(translate( 'enterCaptcha' )).appendTo(captcha);
    $('<input id="input-captcha" type="text">').appendTo(captcha);
    dialog.open(captcha, {
        modal: true,
        title: translate( 'enterCaptcha' ),
        buttons: [
            {
                text: translate( 'submit' ),
                // eslint-disable-next-line object-shorthand
                click: function() {
                    saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val(), dialog);
                    dialog.destroy(this);
                }
            },
            {
                text: translate( 'cancel' ),
                // eslint-disable-next-line object-shorthand
                click: function() {
                    dialog.destroy(this);
                }
            }
        ]
    });
};

/**
 * Render a dialog that notifies the user that the listing editor changes
 * are being saved.
 */
var savingForm = function( dialog ) {
    // if a progress dialog is already open, get rid of it
    if ($(SAVE_FORM_SELECTOR).length > 0) {
        dialog.destroy(SAVE_FORM_SELECTOR);
    }
    var progress = $(`<div id="progress-dialog">${translate( 'saving' )}</div>`);
    dialog.open(progress, {
        modal: true,
        height: 100,
        width: 300,
        title: ''
    });
    $(".ui-dialog-titlebar").hide();
};

/**
 * If an error occurs while saving the form, remove the "saving" dialog,
 * restore the original listing editor form (with all user content), and
 * display an alert with a failure message.
 */
var saveFailedInternal = function(msg, dialog) {
    dialog.destroy(SAVE_FORM_SELECTOR);
    dialog.open($(EDITOR_FORM_SELECTOR));
    alert(msg);
};

/**
 * Execute the logic to post listing editor changes to the server so that
 * they are saved. After saving the page is refreshed to show the updated
 * article.
 */
const saveForm = function(summary, minor, sectionNumber, cid, answer, dialog) {
    var saveFailed = ( msg ) => saveFailedInternal( msg, dialog );
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
    savePayload( editPayload).then(function(data) {
        if (data && data.edit && data.edit.result == 'Success') {
            if ( data.edit.nochange !== undefined ) {
                alert( 'Save skipped as there was no change to the content!' );
                dialog.destroy(SAVE_FORM_SELECTOR);
                return Promise.resolve();
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
            dialog.destroy(SAVE_FORM_SELECTOR);
            captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id, dialog);
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
    savingForm( dialog );
};

module.exports = saveForm;
