const TRANSLATIONS_ALL = require( './translations.js' );
const parseDMS = require( './parseDMS.js' );
const { LANG } = require( './globalConfig.js' );
const translateModule = require( './translate.js' );
const translate = translateModule.translate;
const { loadCallbacks } = require( './Callbacks.js' );
const { MODE_ADD, MODE_EDIT } = require( './mode.js' );
const { loadConfig } = require( './Config.js' );

module.exports = ( function ( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, PROJECT_CONFIG ) {
	'use strict';

	var PROJECT_CONFIG_KEYS = [
		'SHOW_LAST_EDITED_FIELD', 'SUPPORTED_SECTIONS',
		'listingTypeRegExp', 'REPLACE_NEW_LINE_CHARS', 'LISTING_TEMPLATES_OMIT',
		'VALIDATE_CALLBACKS_EMAIL', 'SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT',
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
			EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		} = require( './selectors.js' );

		// the below HTML is the UI that will be loaded into the listing editor
		// dialog box when a listing is added or edited. EACH WIKIVOYAGE
		// LANGUAGE SITE CAN CUSTOMIZE THIS HTML - fields can be removed,
		// added, displayed differently, etc. Note that it is important that
		// any changes to the HTML structure are also made to the
		// LISTING_TEMPLATES parameter arrays since that array provides the
		// mapping between the editor HTML and the listing template fields.
		const EDITOR_FORM_HTML = require( './html.js' )(
			translate,
			PROJECT_CONFIG.SPECIAL_CHARS,
			PROJECT_CONFIG.SHOW_LAST_EDITED_FIELD
		);
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
			EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR,
			EDITOR_FORM_HTML
		};
	}();

	/* ***********************************************************************
	 * Callbacks implements custom functionality that may be
	 * specific to how a Wikivoyage language version has implemented the
	 * listing template. For example, English Wikivoyage uses a "last edit"
	 * date that needs to be populated when the listing editor form is
	 * submitted, and that is done via custom functionality implemented as a
	 * SUBMIT_FORM_CALLBACK function in this module.
	 * ***********************************************************************/
	var Callbacks = function() {
		// array of functions to invoke when creating the listing editor form.
		// these functions will be invoked with the form DOM object as the
		// first element and the mode as the second element.
		var CREATE_FORM_CALLBACKS = [];
		// array of functions to invoke when submitting the listing editor
		// form but prior to validating the form. these functions will be
		// invoked with the mapping of listing attribute to value as the first
		// element and the mode as the second element.
		var SUBMIT_FORM_CALLBACKS = [];
		// array of validation functions to invoke when the listing editor is
		// submitted. these functions will be invoked with an array of
		// validation messages as an argument; a failed validation should add a
		// message to this array, and the user will be shown the messages and
		// the form will not be submitted if the array is not empty.
		var VALIDATE_FORM_CALLBACKS = [];

		// --------------------------------------------------------------------
		// LISTING EDITOR UI INITIALIZATION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Add listeners to specific strings so that clicking on a string
		 * will insert it into the associated input.
		 */
		var initStringFormFields = function(form) {
			var STRING_SELECTOR = '.listing-charinsert';
			$(STRING_SELECTOR, form).on( 'click', function() {
				var target = $(this).attr('data-for');
				var fieldInput = $(`#${target}`);
				var caretPos = fieldInput[0].selectionStart;
				var oldField = fieldInput.val();
				var string = $(this).find('a').text();
				var newField = oldField.substring(0, caretPos) + string + oldField.substring(caretPos);
				fieldInput.val(newField);
				fieldInput.select();
				// now setting the cursor behind the string inserted
				fieldInput[0].setSelectionRange(caretPos + string.length, caretPos + string.length);
			});
		};
		CREATE_FORM_CALLBACKS.push(initStringFormFields);

		/**
		 * Add listeners on various fields to update the "find on map" link.
		 */
		var initFindOnMapLink = function(form) {
			var latlngStr = `?lang=${LANG}`;
			//*****
			// page & location cause the geomap-link crash
			// to investigate if it's a geomap-link bug/limitation or if those parameters shall not be used
			//*****
			// try to find and collect the best available coords
			if ( $('#input-lat', form).val() && $('#input-long', form).val() ) {
				// listing specific coords
				latlngStr += `&lat=${parseDMS($('#input-lat', form).val())}&lon=${parseDMS($('#input-long', form).val())}&zoom=15`;
			} else if ( $('.mw-indicators .geo').lenght ) {
				// coords added by Template:Geo
				latlngStr += `&lat=${parseDMS($('.mw-indicators .geo .latitude').text())}&lon=${parseDMS($('.mw-indicators .geo .longitude').text())}&zoom=15`;
			}
			// #geomap-link is a link in the EDITOR_FORM_HTML
			$('#geomap-link', form).attr('href', $('#geomap-link', form).attr('href') + latlngStr);
			$('#input-lat', form).change( function () {updateHrefCoord(form);} );
			$('#input-long', form).change( function () {updateHrefCoord(form);} );
		};
		CREATE_FORM_CALLBACKS.push(initFindOnMapLink);

		/**
		 * Update coords on href "find on map" link.
		 */
		var updateHrefCoord = function(form) {
			var link = $('#geomap-link').attr('href');
			if (!link) link = $('#geomap-link', form).attr('href');
			link = generateCoordUrl4Href(link, form);
			if ($('#geomap-link').attr('href'))
				$('#geomap-link').attr('href', link);
			else
				$('#geomap-link', form).attr('href', link);
		};

		/**
		 * Generate coords URL in get format to be attached on href attribute in "find on map" link.
		 */
		var generateCoordUrl4Href = function(link, form) {
			var coord = {lat: NaN, lon: NaN};
			var newLink = link;
			coord = getBestCoord(form); //coord has been already parsedDMS
			if ( link ) {
				var indexLat = link.indexOf('&lat');
				var indexZoom = link.indexOf('&zoom');
				if (indexLat >= 0)
					newLink = link.substr(0,indexLat); //remove coord inside the link
				if ( !isNaN(coord.lat) && !isNaN(coord.lon) ) { //add new coord if available
					newLink = `${newLink}&lat=${coord.lat}&lon=${coord.lon}`;
					if (indexZoom < 0)
						newLink = `${newLink}&zoom=15`;
					else
						newLink = newLink + link.substr(indexZoom);
				}
			}
			return newLink;
		};

		/**
		 * Get best available coords between the listing one and the article one.
		 */
		var getBestCoord = function(form) {
			var coord = {lat: NaN, lon: NaN};
			if ( $('#input-lat', form).val() && $('#input-long', form).val() ) {
				coord.lat = $('#input-lat', form).val();
				coord.lon = $('#input-long', form).val();
			} else if ( $('.mw-indicators .geo').lenght ) {
				coord.lat = $('.mw-indicators .geo .latitude').text();
				coord.lon = $('.mw-indicators .geo .longitude').text();
			}
			coord.lat = parseDMS(coord.lat);
			coord.lon = parseDMS(coord.lon);
			return coord;
		};

		var hideEditOnlyFields = function(form, mode) {
			if (mode !== MODE_EDIT) {
				$('#div_status', form).hide();
			}
		};
		CREATE_FORM_CALLBACKS.push(hideEditOnlyFields);

		var typeToColor = function(listingType, form) {
			$('#input-type', form).css( 'box-shadow', 'unset' );
			$.ajax ({
				listingType,
				form,
				url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
					action: 'parse',
					prop: 'text',
					contentmodel: 'wikitext',
					format: 'json',
					disablelimitreport: true,
					'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
				})}`,
				// eslint-disable-next-line object-shorthand
				beforeSend: function() {
					if (localStorage.getItem(`listing-${listingType}`)) {
						changeColor(localStorage.getItem(`listing-${listingType}`), form);
						return false;
					}
					else { return true; }
				},
				// eslint-disable-next-line object-shorthand
				success: function (data) {
					var color = $(data.parse.text['*']).text().trim();
					localStorage.setItem(`listing-${listingType}`, color);
					changeColor(color, form);
				},
			});
		};
		var changeColor = function(color, form) {
			$('#input-type', form).css( 'box-shadow', `-20px 0 0 0 #${color} inset` );
		};
		var initColor = function(form) {
			typeToColor( $('#input-type', form).val(), form );
			$('#input-type', form).on('change', function () {
				typeToColor(this.value, form);
			});
		};
		CREATE_FORM_CALLBACKS.push(initColor);

		var isRTL = function (s){ // based on https://stackoverflow.com/questions/12006095/javascript-how-to-check-if-character-is-rtl
			var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
			rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
			// eslint-disable-next-line no-misleading-character-class
			rtlDirCheck = new RegExp(`^[^${ltrChars}]*[${rtlChars}]`);
			return rtlDirCheck.test(s);
		};
		var autoDir = function(selector) {
			if (selector.val() && !isRTL(selector.val())) {
				selector.prop('dir', 'ltr');
			}
			selector.keyup(function() {
				if ( isRTL(selector.val()) ) {
					selector.prop('dir', 'rtl');
				}
				else {
					selector.prop('dir', 'ltr');
				}
			});
		};
		var autoDirParameters = function(form) {
			autoDir($('#input-alt', form));
		};
		CREATE_FORM_CALLBACKS.push(autoDirParameters);

		var setDefaultPlaceholders = function(form) {
			[
				'name',
				'alt',
				'url',
				'address',
				'directions',
				'phone',
				'tollfree',
				'fax',
				'email',
				'lastedit',
				'lat',
				'long',
				'hours',
				'checkin',
				'checkout',
				'price',
				'wikidata-label',
				'wikipedia',
				'image',
				'content',
				'summary'
			].forEach( function ( key ) {
				$(`#input-${key}`, form).attr( 'placeholder', translate(`placeholder-${key}` ) );
			} );
		};
		CREATE_FORM_CALLBACKS.push(setDefaultPlaceholders);

		// --------------------------------------------------------------------
		// LISTING EDITOR FORM SUBMISSION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Return the current date in the format "2015-01-15".
		 */
		var currentLastEditDate = function() {
			var d = new Date();
			var year = d.getFullYear();
			// Date.getMonth() returns 0-11
			var month = d.getMonth() + 1;
			if (month < 10) month = `0${month}`;
			var day = d.getDate();
			if (day < 10) day = `0${day}`;
			return `${year}-${month}-${day}`;
		};

		/**
		 * Only update last edit date if this is a new listing or if the
		 * "information up-to-date" box checked.
		 */
		var updateLastEditDate = function(listing, mode) {
			var LISTING_LAST_EDIT_PARAMETER = 'lastedit';
			var EDITOR_LAST_EDIT_SELECTOR = '#input-last-edit';
			if (mode == MODE_ADD || $(EDITOR_LAST_EDIT_SELECTOR).is(':checked')) {
				listing[LISTING_LAST_EDIT_PARAMETER] = currentLastEditDate();
			}
		};
		if ( PROJECT_CONFIG.SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT ) {
			SUBMIT_FORM_CALLBACKS.push(updateLastEditDate);
		}

		// --------------------------------------------------------------------
		// LISTING EDITOR FORM VALIDATION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Verify all listings have at least a name, address or alt value.
		 */
		var validateListingHasData = function(validationFailureMessages) {
			if ($('#input-name').val() === '' && $('#input-address').val() === '' && $('#input-alt').val() === '') {
				validationFailureMessages.push( translate( 'validationEmptyListing' ) );
			}
		};
		VALIDATE_FORM_CALLBACKS.push(validateListingHasData);

		/**
		 * Implement SIMPLE validation on email addresses. Invalid emails can
		 * still get through, but this method implements a minimal amount of
		 * validation in order to catch the worst offenders.
		 * Disabled for now, TODO: multiple email support.
		 */
		var validateEmail = function(validationFailureMessages) {
			var VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
			_validateFieldAgainstRegex(
				validationFailureMessages,
				VALID_EMAIL_REGEX, '#input-email',
				translate( 'validationEmail' )
			);
		};
		if ( PROJECT_CONFIG.VALIDATE_CALLBACKS_EMAIL ) {
			VALIDATE_FORM_CALLBACKS.push(validateEmail);
		}

		/**
		 * Implement SIMPLE validation on Wikipedia field to verify that the
		 * user is entering the article title and not a URL.
		 */
		var validateWikipedia = function(validationFailureMessages) {
			var VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_WIKIPEDIA_REGEX, '#input-wikipedia', translate( 'validationWikipedia' ) );
		};
		VALIDATE_FORM_CALLBACKS.push(validateWikipedia);

		/**
		 * Implement SIMPLE validation on the Commons field to verify that the
		 * user has not included a "File" or "Image" namespace.
		 */
		var validateImage = function(validationFailureMessages) {
			var VALID_IMAGE_REGEX = new RegExp(`^(?!(file|image|${translate( 'image' )}):)`, 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_IMAGE_REGEX, '#input-image', translate( 'validationImage' ) );
		};
		VALIDATE_FORM_CALLBACKS.push(validateImage);

		var _validateFieldAgainstRegex = function(validationFailureMessages, validationRegex, fieldPattern, failureMsg) {
			var fieldValue = $(fieldPattern).val().trim();
			if (fieldValue !== '' && !validationRegex.test(fieldValue)) {
				validationFailureMessages.push(failureMsg);
			}
		};

		// expose public members
		return {
			CREATE_FORM_CALLBACKS,
			SUBMIT_FORM_CALLBACKS,
			VALIDATE_FORM_CALLBACKS
		};
	}();
	loadCallbacks( Callbacks );
	loadConfig( Config, PROJECT_CONFIG );

	return {
		initListingEditorDialog: require( './initListingEditorDialog.js' )
	}
} );

//</nowiki>
