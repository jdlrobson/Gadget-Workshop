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

	const missingTranslations = require( './missingTranslations.js' )(
		userLanguage
	);
	missingTranslations.forEach( ( missing ) => {
		mw.log.warn( `Language missing translation ${missing.key} will fall back to English.` );
	} );

	translateModule.init( TRANSLATIONS );

	// TODO: Move to getConfig.
	const Config = function() {
		var WIKIDATAID = PROJECT_CONFIG.WIKIDATAID;

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
		const {
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		} = require( './selectors.js' );

		// expose public members
		return {
			LANG,
			WIKIDATAID,
			TRANSLATIONS,
			ALLOWED_NAMESPACE,
			DEFAULT_LISTING_TEMPLATE,
			LISTING_TYPE_PARAMETER,
			LISTING_CONTENT_PARAMETER,
			ALLOW_UNRECOGNIZED_PARAMETERS,
			SECTION_TO_TEMPLATE_TYPE,
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
