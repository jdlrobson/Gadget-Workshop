const { CdxTextInput, CdxTextArea, CdxTabs, CdxTab } = require( '@wikimedia/codex' );
const sistersites = require( './SisterSites.js' );
const { onMounted, ref, computed } = require( 'vue' );
const { MODE_ADD } = require( '../mode.js' );
const getListingInfo = require( '../getListingInfo.js' );
const TelephoneCharInsert = require( './TelephoneCharInsert.js' );
const SpecialCharactersString = require( './specialCharactersString.js' );
const parseDMS = require( '../parseDMS.js' );
const showPreview = require( '../showPreview.js' );
const currentLastEditDate = require( '../currentLastEditDate' );
const isRTLString = require( '../isRTLString' );
const initColor = require( '../initColor' );
const initStringFormFields = require( '../initStringFormFields.js' );

/**
 * Generate the form UI for the listing editor. If editing an existing
 * listing, pre-populate the form input fields with the existing values.
 */
const hideEmptyFormValues = ( form, listingParameters ) => {
    for (var parameter in listingParameters) {
        var parameterInfo = listingParameters[parameter];
        if (parameterInfo.hideDivIfEmpty) {
            const $element = $(`#${parameterInfo.hideDivIfEmpty}`, form);
            if ( !$element.find( 'input,select' ).val() ) {
                $element.hide();
            }
        }
    }
};

module.exports = {
    name: 'ListingEditorForm',
    props: {
        aka: {
            type: String
        },
        address: {
            type: String
        },
        email: {
            type: String
        },
        directions: {
            type: String
        },
        phone: {
            type: String
        },
        tollfree: {
            type: String
        },
        fax: {
            type: String
        },
        hours: {
            type: String
        },
        checkin: {
            type: String
        },
        checkout: {
            type: String
        },
        price: {
            type: String
        },
        lat: {
            type: String
        },
        long: {
            type: String
        },
        url: {
            type: String
        },
        content: {
            type: String
        },
        lastedit: {
            type: String
        },
        listingName: {
            type: String
        },
        listingTypes: {
            type: Array
        },
        wikipedia: {
            type: String
        },
        wikidata: {
            type: String
        },
        image: {
            type: String
        },
        mode: {
            type: String
        },
        telephoneCodes: {
            type: Array
        },
        nationalCurrencies: {
            type: Array
        },
        showLastEditedField: {
            type: Boolean
        },
        currencies: {
            type: Array,
            default: [ '€', '$', '£', '¥', '₩' ]
        },
        characters: {
            type: Array
        },
        listingType: {
            type: String
        }
    },
    template: `<cdx-tabs :framed="true" :active="currentTab" @update:active="onUpdateTab">
<cdx-tab
    v-for="( tab, index ) in tabsData"
    :key="index"
    :name="tab.name"
    :label="tab.label"
>
<form id="listing-editor" ref="form">
    <template v-if="tab.name === 'edit'">
        <div class="listing-col">
            <div class="editor-fullwidth">
            <div id="div_name" class="editor-row">
                <div class="editor-label-col"><label for="input-name">{{ $translate( 'name' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-name"
                    :placeholder="$translate('placeholder-name' )"
                    :modelValue="listingName"></cdx-text-input></div>
            </div>
            <div id="div_alt" class="editor-row">
                <div class="editor-label-col"><label for="input-alt">{{ $translate( 'alt' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-alt"
                    :dir="computedAltDir"
                    :placeholder="$translate('placeholder-alt' )"
                    v-model="currentAltName"
                    :modelValue="aka"></cdx-text-input></div>
            </div>
            <div id="div_address" class="editor-row">
                <div class="editor-label-col"><label for="input-address">{{ $translate( 'address' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-address"
                    :placeholder="$translate('placeholder-address' )"
                    :modelValue="address"></cdx-text-input></div>
            </div>
            <div id="div_directions" class="editor-row">
                <div class="editor-label-col"><label for="input-directions">{{ $translate( 'directions' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-directions"
                    :placeholder="$translate('placeholder-directions' )"
                    :modelValue="directions"></cdx-text-input></div>
            </div>
            <div id="div_phone" class="editor-row">
                <div class="editor-label-col"><label for="input-phone">{{ $translate( 'phone' ) }}</label></div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-phone"
                        :placeholder="$translate('placeholder-phone' )"
                        :modelValue="phone"></cdx-text-input>
                    <telephone-char-insert updates="input-phone"
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_tollfree" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-tollfree">{{ $translate( 'tollfree' ) }}</label>
                </div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-tollfree"
                        :placeholder="$translate('placeholder-tollfree' )"
                        :modelValue="tollfree"></cdx-text-input>
                    <telephone-char-insert updates="input-tollfree"
                    
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_fax" class="editor-row">
                <div class="editor-label-col"><label for="input-fax">{{ $translate( 'fax' ) }}</label></div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-fax"
                        :placeholder="$translate('placeholder-fax' )"
                        :modelValue="fax"></cdx-text-input>
                    <telephone-char-insert updates="input-fax"
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_hours" class="editor-row">
                <div class="editor-label-col"><label for="input-hours">{{ $translate( 'hours' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-hours"
                    :placeholder="$translate('placeholder-hours' )"
                    :modelValue="hours"></cdx-text-input></div>
            </div>
            <div id="div_checkin" class="editor-row">
                <div class="editor-label-col"><label for="input-checkin">{{ $translate( 'checkin' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-checkin"
                    :placeholder="$translate('placeholder-checkin' )"
                    :modelValue="checkin"></cdx-text-input></div>
            </div>
            <div id="div_checkout" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-checkout">{{ $translate( 'checkout' ) }}</label>
                </div>
                <div><cdx-text-input class="editor-fullwidth" id="input-checkout"
                    :placeholder="$translate('placeholder-checkout' )"
                    :modelValue="checkout"></cdx-text-input></div>
            </div>
            <div id="div_price" class="editor-row">
                <div class="editor-label-col"><label for="input-price">{{ $translate( 'price' ) }}</label></div>
                <!-- update the Callbacks.initStringFormFields
                    method if the currency symbols are removed or modified -->
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-price"
                        :placeholder="$translate('placeholder-price' )"
                         :modelValue="price"></cdx-text-input>
                    <div class="input-price">
                        <span id="span_natl_currency"
                            :title="$translate( 'natlCurrencyTitle' )">
                            <span v-for="(currency, i) in nationalCurrencies"
                                class="listing-charinsert" data-for="input-price">&nbsp;<a href="javascript:">{{ currency }}</a></span>
                            <span v-if="currencies.length"> |</span>
                        </span>
                        <span id="span_intl_currencies" :title="$translate( 'intlCurrenciesTitle' )">
                            <span v-for="(currency, i) in currencies"
                                class="listing-charinsert"
                                data-for="input-price"><a href="javascript:">{{ currency }}</a>&nbsp;</span>
                            <special-characters-string
                                :characters="characters">
                            </special-characters-string>
                        </span>
                    </div>
                </div>
            </div>
            <div id="div_lastedit" style="display: none;">
                <div class="editor-label-col">
                    <label for="input-lastedit">{{ $translate( 'lastUpdated' ) }}</label>
                </div>
                <div><cdx-text-input size="10" id="input-lastedit"
                    v-model="lastEditTimestamp"
                    :placeholder="$translate('placeholder-lastedit' )"
                    :modelValue="lastedit"></cdx-text-input></div>
            </div>
            </div>
        </div>
        <div class="listing-col">
            <div class="editor-fullwidth">
            <div id="div_type" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-type">{{ $translate( 'type' ) }}</label>
                </div>
                <div>
                    <select id="input-type">
                        <option v-for="t in listingTypes"
                            :value="t" :selected="listingType === t">{{ t }}</option>
                    </select>
                </div>
                <div class="editor-fullwidth">
                    <span id="span-closed">
                        <input type="checkbox" id="input-closed">
                        <label for="input-closed"
                            class="listing-tooltip"
                            :title="$translate( 'listingTooltip' )">{{ $translate( 'listingLabel' ) }}</label>
                    </span>
                </div>
            </div>
            <div id="div_url" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-url">{{ $translate( 'website' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div><cdx-text-input class="editor-fullwidth" id="input-url"
                    :placeholder="$translate('placeholder-url' )"
                    :modelValue="url"></cdx-text-input></div>
            </div>
            <div id="div_email" class="editor-row">
                <div class="editor-label-col"><label for="input-email">{{ $translate( 'email' ) }}<span class="wikidata-update"></span></label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-email"
                    :placeholder="$translate('placeholder-email' )"
                    :modelValue="email"></cdx-text-input></div>
            </div>
            <div id="div_lat" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-lat">{{ $translate( 'latitude' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-lat"
                        :placeholder="$translate('placeholder-lat' )"
                        v-model="currentLat"
                        :modelValue="lat"
                    ></cdx-text-input>
                    <!-- update the Callbacks.initFindOnMapLink
                    method if this field is removed or modified -->
                    <div class="input-other">
                        <a id="geomap-link"
                            target="_blank"
                            :href="mapLink">
                                {{ $translate( 'findOnMap' ) }}</a>
                    </div>
                </div>
            </div>
            <div id="div_long" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-long">{{ $translate( 'longitude' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-long"
                        :placeholder="$translate('placeholder-long' )"
                        v-model="currentLong"
                        :modelValue="long"
                    ></cdx-text-input>
                </div>
            </div>
            <sistersites :wikidata="wikidata" :wikipedia="wikipedia" :image="image"></sistersites>
            </div>
        </div>
        <div id="div_content" class="editor-row">
            <div class="editor-label-col"><label for="input-content">{{ $translate( 'content' ) }}
            <special-characters-string :characters="characters">
    </special-characters-string></label></div>
            <div><cdx-text-area rows="8" class="editor-fullwidth"
                :placeholder="$translate('placeholder-content' )"
                id="input-content" :modelValue="content"></cdx-text-area></div>
        </div>
        <!-- update the Callbacks.hideEditOnlyFields method if
        the status row is removed or modified -->
        <div id="div_status" class="editor-fullwidth" v-if="showLastEditedField">
            <div class="editor-label-col"><label>Status</label></div>
            <div>
                <span id="span-last-edit">
                    <input type="checkbox" id="input-last-edit"
                        v-model="shouldUpdateTimestamp"
                        :value="lastedit" />
                    <label for="input-last-edit" class="listing-tooltip"
                        :title="$translate( 'listingUpdatedTooltip' )">
                        {{ $translate( 'listingUpdatedLabel' ) }}
                    </label>
                </span>
            </div>
        </div>
        <! -- update the Callbacks.hideEditOnlyFields method if
            the summary table is removed or modified -->
        <div id="div_summary" class="editor-fullwidth">
            <div class="listing-divider"></div>
            <div class="editor-row">
                <div class="editor-label-col"><label for="input-summary">{{ $translate( 'editSummary' ) }}</label></div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-summary"
                        :placeholder="$translate('placeholder-summary' )"></cdx-text-input>
                    <span id="span-minor">
                        <input type="checkbox" id="input-minor">
                            <label for="input-minor" class="listing-tooltip"
                                :title="$translate( 'minorTitle' )">{{ $translate( 'minorLabel' ) }}</label>
                    </span>
                </div>
            </div>
        </div>
    </template>
    <template v-if="tab.name === 'preview'">
        <div id="listing-preview">
            <div class="listing-divider"></div>
            <div class="editor-row">
                <div title="Preview">{{ $translate( 'preview' ) }}</div>
                <div id="listing-preview-text"></div>
            </div>
        </div>
    </template>
    </form>
    </cdx-tab>
</cdx-tabs>`,
    components: {
        CdxTabs,
        CdxTab,
        TelephoneCharInsert,
        CdxTextInput,
        CdxTextArea,
        SpecialCharactersString,
        sistersites
    },
    setup( props ) {
        const { showLastEditedField, mode, listingType, lat, long, lastedit,
            aka
        } = props;
        const nowTimestamp = currentLastEditDate();
        const shouldUpdateTimestamp = ref( mode === MODE_ADD );
        const lastEditTimestamp = computed( () => shouldUpdateTimestamp.value ? nowTimestamp : lastedit );
        const currentAltName = ref( aka );
        const computedAltDir = computed( () => isRTLString( currentAltName.value ) ? 'rtl' : 'ltr' );
        const currentLong = ref( long );
        const currentLat = ref( lat );
        const listingParameters = getListingInfo(listingType);
        const mapLink = computed( () => {
            const la = currentLat.value;
            const ln = currentLong.value;
            const base = 'https://wikivoyage.toolforge.org/w/geomap.php';
            return la && ln ? `${base}?lat=${parseDMS(la)}&lon=${parseDMS(ln)}&zoom=15` : base;
        } );
        const tabsData = ref( [
            {
                name: 'edit',
                label: 'edit'
            }, {
                name: 'preview',
                label: 'preview'
            }
        ] );
        const form = ref(null);
        onMounted( () => {
            if ( form.value ) {
                hideEmptyFormValues( form.value, listingParameters );
                initColor( form.value, mode );
                initStringFormFields( form.value, mode );
            }
        } );

        let previewTimeout;
        const currentTab = ref( 'edit' );
        const onUpdateTab = ( activeTab ) => {
            if ( activeTab === 'preview' ) {
                clearInterval( previewTimeout );
                mw.util.throttle( () => {
                    previewTimeout = setTimeout( () => {
                        showPreview( {} )
                    currentTab.value = activeTab;
                    }, 200 );
                }, 300 )();
            } else {
                currentTab.value = activeTab;
            }
        };

        return {
            computedAltDir,
            shouldUpdateTimestamp,
            currentAltName,
            currentTab,
            currentLat,
            currentLong,
            mapLink,
            tabsData,
            onUpdateTab,
            form,
            lastEditTimestamp,
            showLastEditedField
        };
    }
};
