const INTL_CURRENCIES = [ '€', '$', '£', '¥', '₩' ];
const CURRENCY_CHOICES = INTL_CURRENCIES.map( function ( c ) {
    return `<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">${c}</a></span>`;
} ).join( '' );

module.exports = ( translate, SPECIAL_CHARS, showLastEditedField ) => {
    let SPECIAL_CHARS_STRING = SPECIAL_CHARS.map( function ( char ) {
        return `<span class="listing-charinsert" data-for="input-content"> <a href="javascript:">${char}</a></span>`;
    } ).join( '\n' );
    if (SPECIAL_CHARS.length) {
        SPECIAL_CHARS_STRING = `<br />(${SPECIAL_CHARS_STRING}&nbsp;)`;
    }
    return `<form id="listing-editor">
    <div class="listing-col">
        <div class="editor-fullwidth">
        <div id="div_name" class="editor-row">
            <div class="editor-label-col"><label for="input-name">${translate( 'name' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-name"></div>
        </div>
        <div id="div_alt" class="editor-row">
            <div class="editor-label-col"><label for="input-alt">${translate( 'alt' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-alt"></div>
        </div>
        <div id="div_address" class="editor-row">
            <div class="editor-label-col"><label for="input-address">${translate( 'address' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-address"></div>
        </div>
        <div id="div_directions" class="editor-row">
            <div class="editor-label-col"><label for="input-directions">${translate( 'directions' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-directions"></div>
        </div>
        <div id="div_phone" class="editor-row">
            <div class="editor-label-col"><label for="input-phone">${translate( 'phone' )}</label></div>
            <div class="editor-fullwidth">
                <input type="text" class="editor-fullwidth" id="input-phone">
                <div class="input-cc" data-for="input-phone"></div>
            </div>
        </div>
        <div id="div_tollfree" class="editor-row">
            <div class="editor-label-col">
                <label for="input-tollfree">${translate( 'tollfree' )}</label>
            </div>
            <div class="editor-fullwidth">
                <input type="text" class="editor-fullwidth" id="input-tollfree">
                <div class="input-cc" data-for="input-tollfree"></div>
            </div>
        </div>
        <div id="div_fax" class="editor-row">
            <div class="editor-label-col"><label for="input-fax">${translate( 'fax' )}</label></div>
            <div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-fax">
                <div class="input-cc" data-for="input-fax"></div>
            </div>
        </div>
        <div id="div_hours" class="editor-row">
            <div class="editor-label-col"><label for="input-hours">${translate( 'hours' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-hours"></div>
        </div>
        <div id="div_checkin" class="editor-row">
            <div class="editor-label-col"><label for="input-checkin">${translate( 'checkin' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-checkin"></div>
        </div>
        <div id="div_checkout" class="editor-row">
            <div class="editor-label-col">
                <label for="input-checkout">${translate( 'checkout' )}</label>
            </div>
            <div><input type="text" class="editor-fullwidth" id="input-checkout"></div>
        </div>
        <div id="div_price" class="editor-row">
            <div class="editor-label-col"><label for="input-price">${translate( 'price' )}</label></div>
            <!-- update the Callbacks.initStringFormFields
                method if the currency symbols are removed or modified -->
            <div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-price">
                <div class="input-price">
                    <span id="span_natl_currency" title="${translate( 'natlCurrencyTitle' )}"></span>
                    <span id="span_intl_currencies" title="${translate( 'intlCurrenciesTitle' )}">${
                        CURRENCY_CHOICES
                    }</span>
                </div>
            </div>
        </div>
        <div id="div_lastedit" style="display: none;">
            <div class="editor-label-col">
                <label for="input-lastedit">${translate( 'lastUpdated' )}</label>
            </div>
            <div><input type="text" size="10" id="input-lastedit"></div>
        </div>
        </div>
    </div>
    <div class="listing-col">
        <div class="editor-fullwidth">
        <div id="div_type" class="editor-row">
            <div class="editor-label-col">
                <label for="input-type">${translate( 'type' )}</label>
            </div>
            <div>
                <select id="input-type">
                    <option value="listing">listing</option>
                    <option value="see">see</option>
                    <option value="do">do</option>
                    <option value="buy">buy</option>
                    <option value="eat">eat</option>
                    <option value="drink">drink</option>
                    <option value="go">go</option>
                    <option value="sleep">sleep</option>
                </select>
            </div>
            <div class="editor-fullwidth">
                <span id="span-closed">
                    <input type="checkbox" id="input-closed">
                    <label for="input-closed"
                        class="listing-tooltip"
                        title="${translate( 'listingTooltip' )}">${translate( 'listingLabel' )}</label>
                </span>
            </div>
        </div>
        <div id="div_url" class="editor-row">
            <div class="editor-label-col">
                <label for="input-url">${translate( 'website' )}<span class="wikidata-update"></span></label>
            </div>
            <div><input type="text" class="editor-fullwidth" id="input-url"></div>
        </div>
        <div id="div_email" class="editor-row">
            <div class="editor-label-col"><label for="input-email">${translate( 'email' )}<span class="wikidata-update"></span></label></div>
            <div><input type="text" class="editor-fullwidth" id="input-email"></div>
        </div>
        <div id="div_lat" class="editor-row">
            <div class="editor-label-col">
                <label for="input-lat">${translate( 'latitude' )}<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-lat">
                <!-- update the Callbacks.initFindOnMapLink
                method if this field is removed or modified -->
                <div class="input-other">
                    <a id="geomap-link"
                        target="_blank"
                        href="https://wikivoyage.toolforge.org/w/geomap.php">${translate( 'findOnMap' )}
                    </a>
                </div>
            </div>
        </div>
        <div id="div_long" class="editor-row">
            <div class="editor-label-col">
                <label for="input-long">${translate( 'longitude' )}<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-long">
            </div>
        </div>
        <div id="div_wikidata" class="editor-row">
            <div class="editor-label-col"><label for="input-wikidata-label">Wikidata</label></div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-wikidata-label">
                <input type="hidden" id="input-wikidata-value">
                <a href="javascript:" id="wp-wd"
                    title="${translate( 'wpWd' )}"
                    style="display:none"><small>&#160;WP</small></a>
                <span id="wikidata-value-display-container" style="display:none">
                    <small>
                    &#160;<span id="wikidata-value-link"></span>
                    &#160;|&#160;<a href="javascript:"
                        id="wikidata-remove"
                        title="${translate( 'wikidataRemoveTitle' )}">${translate( 'wikidataRemoveLabel' )}</a>
                    </small>
                </span>
            </div>
        </div>
        <div id="div_wikidata_update" style="display: none">
            <div class="editor-label-col">&#160;</div>
            <div>
                <span class="wikidata-update"></span>
                <a href="javascript:" id="wikidata-shared">${translate( 'syncWikidata' )}</a>
                <small>&nbsp;<a href="javascript:"
                    title="${translate( 'syncWikidataTitle' )}"
                    class="listing-tooltip"
                    id="wikidata-shared-quick">${translate( 'syncWikidataLabel' )}</a>
                </small>
            </div>
        </div>
        <div id="div_wikipedia" class="editor-row">
            <div class="editor-label-col">
                <label for="input-wikipedia">Wikipedia<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-wikipedia">
                <span id="wikipedia-value-display-container" style="display:none">
                    <small>&#160;<span id="wikipedia-value-link"></span></small>
                </span>
            </div>
        </div>
        <div id="div_image" class="editor-row">
            <div class="editor-label-col">
                <label for="input-image">${translate( 'image' )}<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-image">
                <span id="image-value-display-container" style="display:none">
                    <small>&#160;<span id="image-value-link"></span></small>
                </span>
            </div>
        </div>
        </div>
    </div>
    <div id="div_content" class="editor-row">
        <div class="editor-label-col"><label for="input-content">${translate( 'content' )
        }${SPECIAL_CHARS_STRING}</label></div>
        <div><textarea rows="8" class="editor-fullwidth" id="input-content"></textarea></div>
    </div>
    <!-- update the Callbacks.hideEditOnlyFields method if
    the status row is removed or modified -->
    <div id="div_status" class="editor-fullwidth">
        <div class="editor-label-col"><label>Status</label></div>
        <div>${
            // update the Callbacks.updateLastEditDate
            // method if the last edit input is removed or modified
            showLastEditedField ? `<span id="span-last-edit">` +
                `<input type="checkbox" id="input-last-edit" />` +
                `<label for="input-last-edit" class="listing-tooltip" title="${translate( 'listingUpdatedTooltip' )}">${translate( 'listingUpdatedLabel' )}</label>` +
            `</span>` : ''
        }</div>
    </div>
    <! -- update the Callbacks.hideEditOnlyFields method if
        the summary table is removed or modified -->
    <div id="div_summary" class="editor-fullwidth">
        <div class="listing-divider"></div>
        <div class="editor-row">
            <div class="editor-label-col"><label for="input-summary">${translate( 'editSummary' )}</label></div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-summary">
                <span id="span-minor">
                    <input type="checkbox" id="input-minor">
                        <label for="input-minor" class="listing-tooltip"
                            title="${translate( 'minorTitle' )}">${translate( 'minorLabel' )}</label>
                </span>
            </div>
        </div>
    </div>
    <div id="listing-preview" style="display: none;">
        <div class="listing-divider"></div>
        <div class="editor-row">
            <div title="Preview">${translate( 'preview' )}</div>
            <div id="listing-preview-text"></div>
        </div>
    </div>
    </form>`;
}
