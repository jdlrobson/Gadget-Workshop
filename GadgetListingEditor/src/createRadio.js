const { makeLinkOrSpan } = require( './makeSyncLinks' );
const prepareRadio = require( './prepareRadio.js' );

const createRadio = function(field, value, guid) {
    let html = '';
    const {
        wikidataUrl,
        localUrl,
        localText,
        wikidataText,
        skip,
        remoteFlag
    } = prepareRadio(field, value);
    if ( skip ) {
        return '';
    }
    if ( remoteFlag === true ) {
        html += '<div class="choose-row" style="display:none">';
    } else {
        html += `<div class="sync_label">${field.label}</div><div class="choose-row">`;
    } // usual case, create heading
    html += `<div>` +
        `&nbsp;<label for="${field.label}-wd">`;

    html += makeLinkOrSpan( wikidataText, wikidataUrl );
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

    html += makeLinkOrSpan( localText, localUrl );
    html += '</label></div></div>\n';
    return html;
};

module.exports = createRadio;
