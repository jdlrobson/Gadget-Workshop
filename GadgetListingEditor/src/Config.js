/**
 * @typedef {Object} ListingWikidataClaimValue
 * @property {string} p
 * @property {string} label
 * @property {string[]} fields
 * @property {boolean} remotely_sync
 */
/**
 * @typedef {Record<string, ListingWikidataClaimValue>} ListingWikidataClaims
*/
/**
 * @typedef {Object} ListingTemplateParameterConfig
 * @property {string} id
 * @property {string|null} [hideDivIfEmpty]
 * @property {boolean} [skipIfEmpty]
 * @property {boolean} [newline]
 */
/**
 * @typedef {Record<string, ListingTemplateParameterConfig>} ListingTemplateParametersConfig
 */
/**
 * @typedef {Record<string, ListingTemplateParametersConfig>} ListingTemplateConfig
 */
/**
 * @typedef {Object} ListingConfig
 * @property {boolean} SHOW_LAST_EDITED_FIELD
 * @property {string[]} SUPPORTED_SECTIONS
 * @property {Record<string, string>} sectionType
 * @property {string} iata
 * @property {number} COORD_PRECISION
 * @property {string} EDITOR_TAG
 * @property {string} listingTypeRegExp
 * @property {Object} SECTION_TO_TEMPLATE_TYPE
 * @property {boolean} APPEND_FULL_STOP_TO_DESCRIPTION
 * @property {boolean} REPLACE_NEW_LINE_CHARS
 * @property {string[]} LISTING_TEMPLATES_OMIT
 * @property {boolean} VALIDATE_CALLBACKS_EMAIL
 * @property {boolean} SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT
 * @property {boolean} ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP
 * @property {string} LISTING_TYPE_PARAMETER
 * @property {string} LISTING_CONTENT_PARAMETER
 * @property {string} DEFAULT_LISTING_TEMPLATE
 * @property {ListingTemplateParametersConfig} SLEEP_TEMPLATE_PARAMETERS
 * @property {ListingTemplateParametersConfig} LISTING_TEMPLATE_PARAMETERS
 * @property {string} WIKIDATAID
 * @property {string[]} SPECIAL_CHARS
 * @property {ListingTemplateConfig} LISTING_TEMPLATES
 * @property {ListingWikidataClaims} WIKIDATA_CLAIMS
 */

/** @type {Partial<ListingConfig>} */
let config = {};
/**
 * @param {Partial<ListingConfig>} newConfig
 * @return {ListingWikidataClaims}
 */
function generateWikidataClaims( newConfig ) {
    const { LISTING_TEMPLATE_PARAMETERS } = newConfig;
    /** @type {Record<string, string>} */
    const CLAIM_NAMES = {};
    if ( !LISTING_TEMPLATE_PARAMETERS ) {
        throw new Error( 'Cannot generate Wikidata claims without LISTING_TEMPLATE_PARAMETERS.' );
    }

    /**
     * @param {string} id
     * @return {string}
     */
    const mapToClaimKey = ( id ) => {
        return id.replace( 'input-', '' );
    };
    Object.keys( LISTING_TEMPLATE_PARAMETERS ).forEach( key => {
        const id =  LISTING_TEMPLATE_PARAMETERS[ key ].id;
        const claimKey = mapToClaimKey( id );
        if ( claimKey ) {
            CLAIM_NAMES[ claimKey ] = key;
        }
    } );
    /** @type {Record<string,string[]>} */
    const WIKIDATA_FIELDS = {
        P18: [ CLAIM_NAMES.image ],
        P238: [ CLAIM_NAMES.alt ],
        P625: [ CLAIM_NAMES.lat, CLAIM_NAMES.long ],
        P856: [ CLAIM_NAMES.url ],
        P968: [ CLAIM_NAMES.email ]
    };

    /**
     * @param {string} property
     * @return {string[]}
     */
    const lookupField = function ( property ) {
        return WIKIDATA_FIELDS[ property ] || [];
    };


    //	- doNotUpload: hide upload option
    //	- remotely_sync: for fields which can auto-acquire values, leave the local value blank when syncing
    return {
        'coords':		{ 'p': 'P625', 'label': 'coordinates', 'fields': lookupField( 'P625'), 'remotely_sync': false, },
        'url':			{ 'p': 'P856', 'label': 'website', 'fields': lookupField( 'P856') }, // link
        'email':		{ 'p': 'P968', 'label': 'e-mail', 'fields': lookupField( 'P968') },
        'iata':			{ 'p': 'P238', 'label': 'IATA code (if Alt is empty)', 'fields': lookupField( 'P238'), 'doNotUpload': true, },
        'image':		{ 'p': 'P18', 'label': 'image', 'fields': lookupField( 'P18'), 'remotely_sync': true, }
    };
}

/**
 * @param {Partial<ListingConfig>} obj
 * @return {ListingTemplateConfig}
 */
function generateListingTemplateConfig( {
    SUPPORTED_SECTIONS,
    SLEEP_TEMPLATE_PARAMETERS,
    // The arrays below must include entries for each listing template
    // parameter in use for each Wikivoyage language version - for example
    // "name", "address", "phone", etc. If all listing template types use
    // the same parameters then a single configuration array is sufficient,
    // but if listing templates use different parameters or have different
    // rules about which parameters are required then the differences must
    // be configured - for example, English Wikivoyage uses "checkin" and
    // "checkout" in the "sleep" template, so a separate
    // SLEEP_TEMPLATE_PARAMETERS array has been created below to define the
    // different requirements for that listing template type.
    //
    // Once arrays of parameters are defined, the LISTING_TEMPLATES
    // mapping is used to link the configuration to the listing template
    // type, so in the English Wikivoyage example all listing template
    // types use the LISTING_TEMPLATE_PARAMETERS configuration EXCEPT for
    // "sleep" listings, which use the SLEEP_TEMPLATE_PARAMETERS
    // configuration.
    //
    // Fields that can used in the configuration array(s):
    //	- id: HTML input ID in the EDITOR_FORM_HTML for this element.
    //	- hideDivIfEmpty: id of a <div> in the EDITOR_FORM_HTML for this
    //	  element that should be hidden if the corresponding template
    //	  parameter has no value. For example, the "fax" field is
    //	  little-used and is not shown by default in the editor form if it
    //	  does not already have a value.
    //	- skipIfEmpty: Do not include the parameter in the wiki template
    //	  syntax that is saved to the article if the parameter has no
    //	  value. For example, the "image" tag is not included by default
    //	  in the listing template syntax unless it has a value.
    //	- newline: Append a newline after the parameter in the listing
    //	  template syntax when the article is saved.
    LISTING_TEMPLATE_PARAMETERS
} ) {
    // map the template name to configuration information needed by the listing
    // editor
    /** @type ListingTemplateConfig */
    const LISTING_TEMPLATES = {};

    ( SUPPORTED_SECTIONS || [] ).forEach( function ( key ) {
        if ( key === 'sleep' ) {
            // override the default settings for "sleep" listings since that
            // listing type uses "checkin"/"checkout" instead of "hours"
            LISTING_TEMPLATES[ key ] = $.extend(
                true, {},
                LISTING_TEMPLATE_PARAMETERS,
                SLEEP_TEMPLATE_PARAMETERS
            );
        } else if ( LISTING_TEMPLATE_PARAMETERS ) {
            LISTING_TEMPLATES[ key ] = LISTING_TEMPLATE_PARAMETERS;
        }
    } );
    return LISTING_TEMPLATES;
}

let _loaded = false;

/**
 * @param {Object} newConfig
 * @param {Object} projectConfig
 */
const loadConfig = ( newConfig, projectConfig ) => {
    if ( _loaded ) {
        mw.log.warn( 'Configuration was already loaded. @todo: fix this!' );
    }
    _loaded = true;
    config = Object.assign( {}, newConfig, projectConfig );
    config.LISTING_TEMPLATES = generateListingTemplateConfig( config );
    config.WIKIDATA_CLAIMS = generateWikidataClaims( config );
};

/**
 * @param {ListingConfig} newConfig
 */
const extendConfig = ( newConfig ) => {
    config = Object.assign( {}, newConfig );
};

/**
 * @return {ListingConfig}
 */
// @ts-ignore
const getConfig = () => config;

module.exports = {
    extendConfig,
    loadConfig,
    getConfig
};
