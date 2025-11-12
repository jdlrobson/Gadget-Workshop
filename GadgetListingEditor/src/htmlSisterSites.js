module.exports = ( translate ) => `<div id="div_wikidata" class="editor-row">
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
</div>`;