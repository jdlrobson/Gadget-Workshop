function generateWikidataClaims( config ) {
    const { LISTING_TEMPLATE_PARAMETERS } = config;
    const CLAIM_NAMES = {};

    const mapToClaimKey = ( id ) => {
        const claimKeyMaps = {
            'input-lat': 'lat',
            'input-long': 'long',
            'input-image': 'image',
            'input-url': 'url',
            'input-email': 'email',
            'input-alt': 'alt'
        };
        return claimKeyMaps[ id ];
    };
    Object.keys( LISTING_TEMPLATE_PARAMETERS ).forEach( key => {
        const id =  LISTING_TEMPLATE_PARAMETERS[ key ].id;
        const claimKey = mapToClaimKey( id );
        if ( claimKey ) {
            CLAIM_NAMES[ claimKey ] = key;
        }
    } );
    const WIKIDATA_FIELDS = {
        P18: [ CLAIM_NAMES.image ],
        P238: [ CLAIM_NAMES.alt ],
        P625: [ CLAIM_NAMES.lat, CLAIM_NAMES.long ],
        P856: [ CLAIM_NAMES.url ],
        P968: [ CLAIM_NAMES.email ]
    };

    const lookupField = function ( property ) {
        return WIKIDATA_FIELDS[ property ];
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
    LISTING_TEMPLATE_PARAMETERS,
    LISTING_TEMPLATES_OMIT
} ) {
    // map the template name to configuration information needed by the listing
    // editor
    const LISTING_TEMPLATES = {};

    SUPPORTED_SECTIONS.forEach( function ( key ) {
        if ( key === 'sleep' ) {
            // override the default settings for "sleep" listings since that
            // listing type uses "checkin"/"checkout" instead of "hours"
            LISTING_TEMPLATES[ key ] = $.extend(
                true, {},
                LISTING_TEMPLATE_PARAMETERS,
                SLEEP_TEMPLATE_PARAMETERS
            );
        } else {
            LISTING_TEMPLATES[ key ] = LISTING_TEMPLATE_PARAMETERS;
        }
    } );

    ( LISTING_TEMPLATES_OMIT || [] ).forEach( function ( key ) {
        delete LISTING_TEMPLATES[ key ];
    } );
    return LISTING_TEMPLATES;
}

let _loaded = false;
const loadConfig = ( newConfig, projectConfig ) => {
    if ( _loaded ) {
        mw.log.warn( 'Configuration was already loaded. @todo: fix this!' );
    }
    _loaded = true;
    config = Object.assign( {}, newConfig, projectConfig );
    config.LISTING_TEMPLATES = generateListingTemplateConfig( config );
    config.WIKIDATA_CLAIMS = generateWikidataClaims( config );
};

const extendConfig = ( newConfig ) => {
    config = Object.assign( {}, newConfig );
};

const getConfig = () => config;

module.exports = {
    extendConfig,
    loadConfig,
    getConfig
};
