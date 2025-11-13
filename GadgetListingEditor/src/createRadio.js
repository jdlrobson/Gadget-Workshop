const makeSyncLinks = require( './makeSyncLinks' );
const parseDMS = require( './parseDMS.js' );
const trimDecimal = require( './trimDecimal.js' );

const createRadio = function(field, claimValue, guid, Config) {
    const { LISTING_TEMPLATES, WIKIDATA_CLAIMS } = Config;

    var j = 0;
    for (j = 0; j < claimValue.length; j++) {
        if( claimValue[j] === null ) {
            claimValue[j] = '';
        }
    }
    field.label = field.label.split(/(\s+)/)[0]; // take first word
    var html = '';
    var editorField = [];
    var remoteFlag = false;
    for ( var i = 0; i < field.fields.length; i++ ) {
        editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`;
    }
    // NOTE: this assumes a standard listing type. If ever a field in a nonstandard listing type is added to Wikidata sync, this must be changed

    for (j = 0; j < claimValue.length; j++) {
        // compare the present value to the Wikidata value
        if ( field.p === WIKIDATA_CLAIMS.coords.p) {
        //If coords, then compared the values after trimming the WD one into decimal and converting into decimal and trimming the present one
            if((trimDecimal(Number(claimValue[j]), 6) != trimDecimal(parseDMS($(editorField[j]).val()), 6)) ) {
                break;
            }
        } else if ( field.p === WIKIDATA_CLAIMS.image.p) {
        //If image, then compared the values after converting underscores into spaces on the local value
            if( claimValue[j] != $(editorField[j]).val().replace(/_/g, ' ') ) {
                break;
            }
        } else if( claimValue[j] != $(editorField[j]).val() ) {
            break;
        }
    }
    if ( (j === claimValue.length) && (field.remotely_sync !== true) ) {
        return '';
    }
    // if everything on WV equals everything on WD, skip this field

    if ( (field.doNotUpload === true) && (claimValue[0] === '') ) {
        return '';
    }
    // if do not upload is set and there is nothing on WD, skip

    // if remotely synced, and there aren't any value(s) here or they are identical, skip with a message
    // also create an invisible radio button so that updateFieldIfNotNull is called
    if ( (field.remotely_sync === true) && ( j === claimValue.length || ( ( $(editorField[0]).val() === '' ) && ( ($(editorField[1]).val() === '' ) || ($(editorField[1]).val() === undefined) ) ) ) ) {
        remoteFlag = true;
    }
    if ( remoteFlag === true ) {
        html += '<div class="choose-row" style="display:none">';
    } else { html += `<div class="sync_label">${field.label}</div><div class="choose-row">`; } // usual case, create heading
        html += `<div>` +
            `&nbsp;<label for="${field.label}-wd">`;

    if (
        [
            WIKIDATA_CLAIMS.coords.p,
            WIKIDATA_CLAIMS.url.p,
            WIKIDATA_CLAIMS.image.p
        ].indexOf(field.p) >= 0
    ) {
        html += makeSyncLinks(claimValue, field.p, false, Config);
    }
    for (j = 0; j < claimValue.length; j++) {
        html += `${claimValue[j]}\n`;
    }
    if (
        [
            WIKIDATA_CLAIMS.coords.p,
            WIKIDATA_CLAIMS.url.p,
            WIKIDATA_CLAIMS.image.p
        ].indexOf(field.p) >= 0
    ) {
        html += '</a>';
    }

    html += `</label>
</div>
<div id="has-guid">
<input type="radio" id="${field.label}-wd" name="${field.label}"`;
    if ( remoteFlag === true ) {
        html += 'checked'
    }
    html += `>
<input type="hidden" value="${guid}">
</div>`;
    if ( remoteFlag === false ) {
        html += `<div>
    <input type="radio" name="${field.label}" checked>
</div>`;
    }
    html += '<div id="has-json"><input type="radio" ';
    if ( (remoteFlag !== true) && (field.doNotUpload !== true) ) {
        html += `id="${field.label}-wv" name="${field.label}"`;
    } else {
        html += 'disabled'
    }
    html += `><input type="hidden" value='${JSON.stringify(field)}'>
</div>
<div>&nbsp;<label for="${field.label}-wv">`;

    if (
        [
            WIKIDATA_CLAIMS.coords.p,
            WIKIDATA_CLAIMS.url.p,
            WIKIDATA_CLAIMS.image.p
        ].indexOf(field.p) >= 0
    ) {
        html += makeSyncLinks(editorField, field.p, true, Config);
    }
    for (i = 0; i < editorField.length; i++ ) {
        html += `${$(editorField[i]).val()}\n`;
    }
    if (
        [
            WIKIDATA_CLAIMS.coords.p,
            WIKIDATA_CLAIMS.url.p,
            WIKIDATA_CLAIMS.image.p
        ].indexOf(field.p) >= 0
    ) {
        html += '</a>';
    }

    html += '</label></div></div>\n';
    return html;
};
module.exports = createRadio;
