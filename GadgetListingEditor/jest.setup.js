/* global require, global */
'use strict';

const config = require( './dist/Gadget-ListingEditor.json' );
const mockMediaWiki = require( '@wikimedia/mw-node-qunit/src/mockMediaWiki.js' );
global.mw = mockMediaWiki();
global.mw.config = {
    get: ( key ) => {
        switch ( key ) {
            case 'wgUserLanguage':
                return 'en';
            case 'wgPageViewLanguage':
                return 'en';
            default:
                return `-- ${key} --`;
        }
    }
};
global.$ = require( 'jquery' );
global.mw.util.wikiUrlencode = ( a ) => a;
global.mw.util.showPortlet = function () {};
global.mw.Api.prototype.saveOption = function () {};
global.mw.loader.require = ( name ) => {
    switch( name ) {
        case 'vue':
            return {
                defineComponent: ( name ) => {
                    return name
                }
            }
        default:
            return {};
    }
};
const { init } = require( './src/translate' );
const { loadConfig } = require( './src/Config.js' );
init( require( './src/i18n/en' ) );

const LISTING_TEMPLATE_PARAMETERS = {
    "type": {
        "id": "input-type",
        "hideDivIfEmpty": "div_type",
        "newline": true
    },
    "name": {
        "id": "input-name"
    },
    "alt": {
        "id": "input-alt"
    },
    "url": {
        "id": "input-url"
    },
    "email": {
        "id": "input-email",
        "newline": true
    },
    "address": {
        "id": "input-address"
    },
    "lat": {
        "id": "input-lat"
    },
    "long": {
        "id": "input-long"
    },
    "directions": {
        "id": "input-directions",
        "newline": true
    },
    "phone": {
        "id": "input-phone"
    },
    "tollfree": {
        "id": "input-tollfree"
    },
    "fax": {
        "id": "input-fax",
        "hideDivIfEmpty": "div_fax",
        "newline": true,
        "skipIfEmpty": true
    },
    "hours": {
        "id": "input-hours"
    },
    "checkin": {
        "id": "input-checkin",
        "hideDivIfEmpty": "div_checkin",
        "skipIfEmpty": true
    },
    "checkout": {
        "id": "input-checkout",
        "hideDivIfEmpty": "div_checkout",
        "skipIfEmpty": true
    },
    "price": {
        "id": "input-price",
        "newline": true
    },
    "wikipedia": {
        "id": "input-wikipedia",
        "skipIfEmpty": true
    },
    "image": {
        "id": "input-image",
        "skipIfEmpty": true
    },
    "wikidata": {
        "id": "input-wikidata-value",
        "newline": true,
        "skipIfEmpty": true
    },
    "lastedit": {
        "id": "input-lastedit",
        "newline": true,
        "skipIfEmpty": true
    },
    "content": {
        "id": "input-content",
        "newline": true
    }
};

loadConfig( {
    sectionType: config.sectionType,
    listingTypeRegExp: "({{\\s*(%s)\\b)(\\s*[\\|}])",
    WIKIDATA_CLAIMS: {
        "coords": {
            "p": "P625",
            "label": "coordinates",
            "fields": [
                "lat",
                "long"
            ],
            "remotely_sync": false
        },
        "url": {
            "p": "P856",
            "label": "website",
            "fields": [
                "url"
            ]
        },
        "email": {
            "p": "P968",
            "label": "e-mail",
            "fields": [
                "email"
            ]
        },
        "iata": {
            "p": "P238",
            "label": "IATA",
            "fields": [
                "alt"
            ],
            "doNotUpload": true
        },
        "image": {
            "p": "P18",
            "label": "image",
            "fields": [
                "image"
            ],
            "remotely_sync": true
        }
    },
    DEFAULT_LISTING_TEMPLATE: 'listing',
    ALLOW_UNRECOGNIZED_PARAMETERS: true,
    LISTING_CONTENT_PARAMETER: 'content',
    LISTING_TYPE_PARAMETER: 'type',
    LISTING_TEMPLATES_OMIT: [],
    SUPPORTED_SECTIONS: [
        "listing",
        "see",
        "do",
        "buy",
        "eat",
        "drink",
        "go",
        "sleep"
    ],
    LISTING_TEMPLATE_PARAMETERS,
    LISTING_TEMPLATES: {
        "listing": LISTING_TEMPLATE_PARAMETERS,
        "see": {
            "type": {
                "id": "input-type",
                "hideDivIfEmpty": "div_type",
                "newline": true
            },
            "name": {
                "id": "input-name"
            },
            "alt": {
                "id": "input-alt"
            },
            "url": {
                "id": "input-url"
            },
            "email": {
                "id": "input-email",
                "newline": true
            },
            "address": {
                "id": "input-address"
            },
            "lat": {
                "id": "input-lat"
            },
            "long": {
                "id": "input-long"
            },
            "directions": {
                "id": "input-directions",
                "newline": true
            },
            "phone": {
                "id": "input-phone"
            },
            "tollfree": {
                "id": "input-tollfree"
            },
            "fax": {
                "id": "input-fax",
                "hideDivIfEmpty": "div_fax",
                "newline": true,
                "skipIfEmpty": true
            },
            "hours": {
                "id": "input-hours"
            },
            "checkin": {
                "id": "input-checkin",
                "hideDivIfEmpty": "div_checkin",
                "skipIfEmpty": true
            },
            "checkout": {
                "id": "input-checkout",
                "hideDivIfEmpty": "div_checkout",
                "skipIfEmpty": true
            },
            "price": {
                "id": "input-price",
                "newline": true
            },
            "wikipedia": {
                "id": "input-wikipedia",
                "skipIfEmpty": true
            },
            "image": {
                "id": "input-image",
                "skipIfEmpty": true
            },
            "wikidata": {
                "id": "input-wikidata-value",
                "newline": true,
                "skipIfEmpty": true
            },
            "lastedit": {
                "id": "input-lastedit",
                "newline": true,
                "skipIfEmpty": true
            },
            "content": {
                "id": "input-content",
                "newline": true
            }
        }
    }
} );

window.Vue = require( 'vue' );
window.VueCompilerDOM = require( '@vue/compiler-dom' );
