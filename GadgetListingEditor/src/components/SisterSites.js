const mapSearchResult = require( '../sisterSiteApp/mapSearchResult.js' );
const getWikidataFromWikipedia = require( '../sisterSiteApp/getWikidataFromWikipedia.js' );
const launchSyncDialog = require( '../sisterSiteApp/launchSyncDialog.js' );
const updateWikidataSharedFields = require( '../sisterSiteApp/updateWikidataSharedFields.js' );
const quickUpdateWikidataSharedFields = require( '../sisterSiteApp/quickUpdateWikidataSharedFields.js' );
const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL,
    LANG } = require( '../globalConfig.js' );
const { ref, computed, nextTick } = require( 'vue' );
const { translate } = require( '../translate.js' );
const { CdxLookup } = require( '@wikimedia/codex' );

module.exports = {
    props: {
        api: {
            type: Object
        },
        wikipedia: {
            type: String,
            default: ''
        },
        wikidata: {
            type: String,
            default: ''
        },
        image: {
            type: String,
            default: ''
        }
    },
    components: {
        CdxLookup
    },
    template: `<div id="div_wikidata" class="editor-row">
<div class="editor-label-col">
    <label for="input-wikidata-label">Wikidata</label>
</div>
<div>
    <cdx-lookup
        v-model:selected="wikidata"
        v-model:input-value="wikidataInput"
        :menu-items="wikidataMenuItems"
        @blur="onBlur"
        @update:input-value="onWikidataInput"
        @update:selected="onWikidataSelected"
        :placeholder="$translate('placeholder-wikidata-label' )"
        id="input-wikidata-label"
    >
        <template #no-results>
            No results found.
        </template>
    </cdx-lookup>
    <input type="hidden" id="input-wikidata-value" :value="wikidata">
    <a v-if="wikipedia"
        id="wp-wd" @click="onWPClick"
        :title="$translate( 'wpWd' )"
    ><small>&#160;WP</small></a>
    <span v-if="wikidata" id="wikidata-value-display-container">
        <small>&#160;
            <span id="wikidata-value-link">
                <a v-if="wikidata"
                    target="_new" :href="wikidataUrl"
                    :title="$translate( 'viewWikidataPage' )">{{ wikidata }}</a>
            </span>
        &#160;|&#160;<a v-if="wikidata"
            id="wikidata-remove"
            @click="clickClearWikidata"
            :title="$translate( 'wikidataRemoveTitle' )">{{ $translate( 'wikidataRemoveLabel' ) }}</a>
        </small>
    </span>
</div>
</div>
<div v-if="wikidata" id="div_wikidata_update">
<div class="editor-label-col">&#160;</div>
<div>
    <span class="wikidata-update"></span>
    <a id="wikidata-shared" @click="clickSync">{{ $translate( 'syncWikidata' ) }}</a>
    <small>&nbsp;<a
        :title="$translate( 'syncWikidataTitle' )"
        class="listing-tooltip"
        @click="wikidataQuickSync"
        id="wikidata-shared-quick">{{ $translate( 'syncWikidataLabel' ) }}</a>
    </small>
</div>
</div>
<div id="div_wikipedia" class="editor-row">
<div class="editor-label-col">
    <label for="input-wikipedia">Wikipedia<span class="wikidata-update"></span></label>
</div>
<div>
    <cdx-lookup
        @blur="onBlur"
        v-model:selected="wikipedia"
        v-model:input-value="wikipediaInput"
        :menu-items="wikipediaMenuItems"
        :placeholder="$translate( 'placeholder-wikipedia' )"
        @update:input-value="onWikipediaInput"
        @update:selected="onWikipediaSelected"
        id="input-wikipedia"
    ></cdx-lookup>
    <span v-if="wikipedia" id="wikipedia-value-display-container">
        <small>&#160;<span id="wikipedia-value-link">
            <a
                target="_new" :href="wikipediaUrl"
                :title="$translate( 'viewWikipediaPage' )">{{ $translate( 'viewWikipediaPage' ) }}</a>
        </span>
        </small>
    </span>
</div>
</div>
<div id="div_image" class="editor-row">
<div class="editor-label-col">
    <label for="input-image">{{ $translate( 'image' ) }}<span class="wikidata-update"></span></label>
</div>
<div>
    <cdx-lookup
        @blur="onBlur"
        v-model:selected="commons"
        v-model:input-value="commonsInput"
        :menu-items="commonsMenuItems"
        :placeholder="$translate( 'placeholder-image' )"
        @update:input-value="onCommonsInput"
        @update:selected="onCommonsSelected"
        id="input-image"
    ></cdx-lookup>
    <span v-if="commons" id="image-value-display-container">
        <small>&#160;<span id="image-value-link">
            <a
                target="_new" :href="commonsUrl"
                :title="$translate( 'viewCommonsPage' )">{{ $translate( 'viewCommonsPage' ) }}</a>
        </span></small>
    </span>
</div>
</div>`,
    emits: [ 'updated:listing' ],
    setup( { wikipedia, wikidata, image, api }, { emit } ) {
        const SisterSite = api || require( '../SisterSite.js' )();
        const { SEARCH_PARAMS,
            API_WIKIDATA, API_COMMONS, API_WIKIPEDIA,
            ajaxSisterSiteSearch } = SisterSite;
        wikipedia = ref( wikipedia );
        wikidata = ref( wikidata );
        const commons = ref( image || '' );
        const wikidataInput = ref( wikidata.value );
        const wikipediaInput = ref( wikipedia.value );
        const commonsInput = ref( commons.value );
        const wikidataMenuItems = ref( [] );
        const commonsMenuItems = ref( [] );
        const wikipediaMenuItems = ref( [] );

        const wikidataUrl = computed(
            () => `${WIKIDATA_URL}/wiki/${mw.util.wikiUrlencode(wikidata.value)}`
        );
        const wikipediaUrl = computed(
            () => `${WIKIPEDIA_URL}/wiki/${mw.util.wikiUrlencode(wikipedia.value)}`,
        );
        const commonsUrl = computed(
            () => `${COMMONS_URL}/wiki/${mw.util.wikiUrlencode(`File:${commons.value}`)}`
        );

        const clickClearWikidata = () => {
            wikidata.value = '';
            wikidataInput.value = '';
        };

        const updateModel = ( newValues ) => {
            nextTick( () => {
                if ( newValues.commons ) {
                    commons.value = newValues.commons;
                    nextTick( () => {
                        commonsInput.value = newValues.commons;
                    } );
                }
                if ( newValues.wikipedia ) {
                    wikipedia.value = newValues.wikipedia;
                    nextTick( () => {
                        wikipediaInput.value = newValues.wikipedia;
                    } );
                }
            } );
        };

        const wikidataQuickSync = () => {
            if ( !wikidata.value ) {
                return;
            }
            quickUpdateWikidataSharedFields(wikidata.value, SisterSite)
                .then( ( result ) => {
                    if ( result.commons || result.wikipedia ) {
                        updateModel( result );
                    } else {
                        alert( translate( 'wikidataSharedNotFound' ) );
                    }
                } );
        };

        const clickSync = () => {
            const wikidataRecord = wikidata.value;
            updateWikidataSharedFields(
                wikidataRecord, SisterSite
            ).then(( jsonObj ) => {
                launchSyncDialog(
                    jsonObj, wikidataRecord, updateModel
                );
            });
        };

        const onWPClick = function() {
                getWikidataFromWikipedia(
                    wikipedia.value,
                    SisterSite
                ).then( ( wikidataID ) => {
                    nextTick( () => {
                        wikidata.value = wikidataID;
                        wikidataInput.value = wikidataID;
                    } );
                })
            };

        const onBlur = () => {
            emitUpdatedEvent();
        };

        const emitUpdatedEvent = () => {
            emit( 'updated:listing', {
                image: commonsInput.value,
                wikipedia: wikipediaInput.value,
                wikidata: wikidataInput.value
            } );
        }

        function onWikidataSelected( selected ) {
            if ( selected ) {
                wikidataInput.value = selected;
                emitUpdatedEvent();
            }
        }
        function onWikidataInput( search ) {
            if ( !search ) {
                wikidataMenuItems.value = [];
                return;
            }
            ajaxSisterSiteSearch(
                API_WIKIDATA,
                {
                    action: 'wbsearchentities',
                    search,
                    language: LANG
                }
            ).then( (  jsonObj ) => {
                wikidataMenuItems.value = ( jsonObj.search || [] ).map(
                    ( { title, label } ) => ( { value: title, label } )
                );
            } );
        }

        function onCommonsSelected( selected ) {
            if ( selected ) {
                commonsInput.value = selected;
                emitUpdatedEvent();
            }
        }

        function onCommonsInput( search ) {
            ajaxSisterSiteSearch(
                API_COMMONS,
                Object.assign( {}, SEARCH_PARAMS, {
                    search,
                    namespace: 6
                } )
            ).then( (  jsonObj ) => {
                commonsMenuItems.value = mapSearchResult( jsonObj );
            } );
        }

        function onWikipediaSelected( selected ) {
            if ( selected ) {
                wikipediaInput.value = selected;
                emitUpdatedEvent();
            }
        }

        function onWikipediaInput( search ) {
            ajaxSisterSiteSearch(
                API_WIKIPEDIA,
                Object.assign( {}, SEARCH_PARAMS, {
                    search,
                    namespace: 0
                } )
            ).then( (  jsonObj ) => {
                wikipediaMenuItems.value = mapSearchResult( jsonObj )
            } );
        }

        return {
            onBlur,
            onCommonsSelected,
            onWikipediaSelected,
            onWikidataSelected,
            clickSync,
            wikidataQuickSync,
            clickClearWikidata,
            onWPClick,
            commonsMenuItems,
            wikipediaMenuItems,
            wikidataMenuItems,
            wikidata,
            wikidataUrl,
            commonsUrl,
            wikipediaUrl,
            wikidataInput,
            commonsInput,
            wikipediaInput,
            onWikidataInput,
            onWikipediaInput,
            onCommonsInput,
            wikipedia,
            commons
        }
    }
};
