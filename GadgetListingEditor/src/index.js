const TRANSLATIONS_ALL = require( './translations.js' );
const { LANG } = require( './globalConfig.js' );
const translateModule = require( './translate.js' );
const { loadConfig } = require( './Config.js' );

module.exports = ( function ( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, PROJECT_CONFIG ) {
	'use strict';

	var PROJECT_CONFIG_KEYS = [
		'SHOW_LAST_EDITED_FIELD', 'SUPPORTED_SECTIONS',
		'listingTypeRegExp', 'REPLACE_NEW_LINE_CHARS', 'LISTING_TEMPLATES_OMIT',
		'VALIDATE_CALLBACKS_EMAIL',
		'ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP',
		'LISTING_TYPE_PARAMETER', 'LISTING_CONTENT_PARAMETER',
		'DEFAULT_LISTING_TEMPLATE', 'SLEEP_TEMPLATE_PARAMETERS',
		'LISTING_TEMPLATE_PARAMETERS', 'WIKIDATAID', 'SPECIAL_CHARS'
	];

	// check project has been setup correctly with no missing keys.
	PROJECT_CONFIG_KEYS.forEach( function ( key ) {
		if ( PROJECT_CONFIG[ key ] === undefined ) {
			throw new Error( `Project must define project setting ${key}` );
		}
	} );

	const userLanguage = mw.config.get( 'wgUserLanguage' );
	var TRANSLATIONS = Object.assign(
		{},
		TRANSLATIONS_ALL.en,
		TRANSLATIONS_ALL[ userLanguage ]
	);

	Object.keys( TRANSLATIONS_ALL.en ).forEach( function ( key ) {
		// check the key is present in all the other configurations
		Object.keys( TRANSLATIONS_ALL ).forEach( function ( lang ) {
			if ( lang === 'en' ) {
				return; // no need to check against itself
			} else {
				if ( TRANSLATIONS_ALL[ lang ][ key ] === undefined && userLanguage === lang) {
					mw.log.warn( `Language missing translation ${key} will fall back to English.` );
				}
			}
		} );
	} );

	translateModule.init( TRANSLATIONS );

	const Config = function() {
		var WIKIDATAID = PROJECT_CONFIG.WIKIDATAID;

		var lookupField = function ( property ) {
			return TRANSLATIONS[`property${property}`] || [];
		};


		//	- doNotUpload: hide upload option
		//	- remotely_sync: for fields which can auto-acquire values, leave the local value blank when syncing
		var WIKIDATA_CLAIMS = {
			'coords':		{ 'p': 'P625', 'label': 'coordinates', 'fields': lookupField( 'P625'), 'remotely_sync': false, },
			'url':			{ 'p': 'P856', 'label': 'website', 'fields': lookupField( 'P856') }, // link
			'email':		{ 'p': 'P968', 'label': 'e-mail', 'fields': lookupField( 'P968') },
			'iata':			{ 'p': 'P238', 'label': 'IATA code (if Alt is empty)', 'fields': lookupField( 'P238'), 'doNotUpload': true, },
			'image':		{ 'p': 'P18', 'label': 'image', 'fields': lookupField( 'P18'), 'remotely_sync': true, }
		};

		// set this flag to false if the listing editor should strip away any
		// listing template parameters that are not explicitly configured in the
		// LISTING_TEMPLATES parameter arrays (such as wikipedia, phoneextra, etc).
		// if the flag is set to true then unrecognized parameters will be allowed
		// as long as they have a non-empty value.
		var ALLOW_UNRECOGNIZED_PARAMETERS = PROJECT_CONFIG.ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP;

		// name of the generic listing template to use when a more specific
		// template ("see", "do", etc) is not appropriate
		var DEFAULT_LISTING_TEMPLATE = PROJECT_CONFIG.DEFAULT_LISTING_TEMPLATE;
		var LISTING_TYPE_PARAMETER = PROJECT_CONFIG.LISTING_TYPE_PARAMETER;
		var LISTING_CONTENT_PARAMETER = PROJECT_CONFIG.LISTING_CONTENT_PARAMETER;
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
		var LISTING_TEMPLATE_PARAMETERS = PROJECT_CONFIG.LISTING_TEMPLATE_PARAMETERS;
		// map the template name to configuration information needed by the listing
		// editor
		var LISTING_TEMPLATES = {};

		PROJECT_CONFIG.SUPPORTED_SECTIONS.forEach( function ( key ) {
			if ( key === 'sleep' ) {
				// override the default settings for "sleep" listings since that
				// listing type uses "checkin"/"checkout" instead of "hours"
				LISTING_TEMPLATES[ key ] = $.extend(
					true, {},
					LISTING_TEMPLATE_PARAMETERS,
					PROJECT_CONFIG.SLEEP_TEMPLATE_PARAMETERS
				);
			} else {
				LISTING_TEMPLATES[ key ] = LISTING_TEMPLATE_PARAMETERS;
			}
		} );

		( PROJECT_CONFIG.LISTING_TEMPLATES_OMIT || [] ).forEach( function ( key ) {
			delete LISTING_TEMPLATES[ key ];
		} );

		const {
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		} = require( './selectors.js' );

		// expose public members
		return {
			LANG,
			WIKIDATAID,
			WIKIDATA_CLAIMS,
			TRANSLATIONS,
			ALLOWED_NAMESPACE,
			DEFAULT_LISTING_TEMPLATE,
			LISTING_TYPE_PARAMETER,
			LISTING_CONTENT_PARAMETER,
			ALLOW_UNRECOGNIZED_PARAMETERS,
			SECTION_TO_TEMPLATE_TYPE,
			LISTING_TEMPLATES,
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		};
	}();
	loadConfig( Config, PROJECT_CONFIG );

	return {
		initListingEditorDialog: require( './initListingEditorDialog.js' )
	}
} );

//</nowiki>
