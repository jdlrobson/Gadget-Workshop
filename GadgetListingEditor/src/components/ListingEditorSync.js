const ListingSyncRow = require( './ListingSyncRow.js' );

module.exports = {
    name: 'ListingEditorSync',
    components: {
        ListingSyncRow
    },
    props: {
        syncValues: {
            type: Array
        }
    },
    template: `<form id="listing-editor-sync">
<p>{{
    $translate( 'wikidataSyncBlurb' )
}}</p>
<fieldset>
    <span>
        <span class="wikidata-update"></span>
        <a href="javascript:" class="syncSelect" name="wd"
            :title="$translate( 'selectAll' )">Wikidata</a>
    </span>
    <a href="javascript:" id="autoSelect" class="listing-tooltip"
        :title="$translate( 'selectAlternatives' )">Auto</a>
    <span>
        <a href="javascript:" class="syncSelect"
            name="wv"
            :title="$translate( 'selectAll' )">Wikivoyage</a>
        <span class="wikivoyage-update"></span>
    </span>
</fieldset>
<div class="editor-fullwidth">
    <listing-sync-row v-for="row in syncValues"
        :field="row.field"
        :guid="row.guid"
        :wikidataUrl="row.wikidataUrl"
        :localUrl="row.localUrl"
        :localText="row.localText"
        :wikidataText="row.wikidataText"
        :skip="row.skip"
        :remoteFlag="row.remoteFlag"
    ></listing-sync-row>
</div>
<small>
    <a href="javascript:" class="clear">{{ $translate( 'cancelAll' ) }}</a>
</small>
</form>
`
};
