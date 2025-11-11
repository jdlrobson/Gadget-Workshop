const TRANSLATIONS_ALL = require( './translations.js' );
const trimDecimal = require( './trimDecimal.js' );
const dialog = require( './dialogs.js' );
const makeTranslateFunction = require( './makeTranslateFunction.js' );

module.exports = ( function ( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, PROJECT_CONFIG ) {
	'use strict';
	const parseDMS = PROJECT_CONFIG.doNotParseDMS ? (a) => a : require( './parseDMS.js' );

	var PROJECT_CONFIG_KEYS = [
		'SHOW_LAST_EDITED_FIELD', 'SUPPORTED_SECTIONS', 'iata',
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

	const translate = makeTranslateFunction( TRANSLATIONS );

	var Config = function( ALLOWED_NAMESPACE ) {
		var PAGE_VIEW_LANGUAGE = mw.config.get( 'wgPageViewLanguage' );
		var LANG = mw.config.get( 'wgUserLanguage', 'en' );
		var WIKIDATAID = PROJECT_CONFIG.WIKIDATAID;
		var COMMONS_URL = '//commons.wikimedia.org';
		var WIKIDATA_URL = '//www.wikidata.org';
		var WIKIPEDIA_URL = `//${PAGE_VIEW_LANGUAGE}.wikipedia.org`;
		var WIKIDATA_SITELINK_WIKIPEDIA = `${PAGE_VIEW_LANGUAGE}wiki`;

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

		// these selectors should match a value defined in the EDITOR_FORM_HTML
		// if the selector refers to a field that is not used by a Wikivoyage
		// language version the variable should still be defined, but the
		// corresponding element in EDITOR_FORM_HTML can be removed and thus
		// the selector will not match anything and the functionality tied to
		// the selector will never execute.
		var EDITOR_FORM_SELECTOR = '#listing-editor';
		var EDITOR_CLOSED_SELECTOR = '#input-closed';
		var EDITOR_SUMMARY_SELECTOR = '#input-summary';
		var EDITOR_MINOR_EDIT_SELECTOR = '#input-minor';
		// the same for WIKIDATA_SYNC_FORM_HTML
		var SYNC_FORM_SELECTOR = '#listing-editor-sync';

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
			COMMONS_URL,
			WIKIDATA_URL,
			WIKIDATA_CLAIMS,
			WIKIPEDIA_URL,
			WIKIDATA_SITELINK_WIKIPEDIA,
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
			SYNC_FORM_SELECTOR,
			EDITOR_FORM_HTML
		};
	}( ALLOWED_NAMESPACE );

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
			var latlngStr = `?lang=${Config.LANG}`;
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
			if (mode !== Core.MODE_EDIT) {
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

		var wikidataLookup = function(form) {
			// get the display value for the pre-existing wikidata record ID
			var value = $("#input-wikidata-value", form).val();
			if (value) {
				wikidataLink(form, value);
				var ajaxUrl = SisterSite.API_WIKIDATA;
				var ajaxData = {
					action: 'wbgetentities',
					ids: value,
					languages: Config.LANG,
					props: 'labels'
				};
				var ajaxSuccess = function(jsonObj) {
					var value = $("#input-wikidata-value").val();
					var label = SisterSite.wikidataLabel(jsonObj, value);
					if (label === null) {
						label = "";
					}
					$("#input-wikidata-label").val(label);
				};
				SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
			}
			// set up autocomplete to search for results as the user types
			$('#input-wikidata-label', form).autocomplete({
				// eslint-disable-next-line object-shorthand
				source: function( request, response ) {
					var ajaxUrl = SisterSite.API_WIKIDATA;
					var ajaxData = {
						action: 'wbsearchentities',
						search: request.term,
						language: Config.LANG
					};
					var ajaxSuccess = function (jsonObj) {
						response(parseWikiDataResult(jsonObj));
					};
					SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
				},
				// eslint-disable-next-line object-shorthand
				select: function(event, ui) {
					$("#input-wikidata-value").val(ui.item.id);
					wikidataLink("", ui.item.id);
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				var label = `${mw.html.escape(item.label)} <small>${mw.html.escape(item.id)}</small>`;
				if (item.description) {
					label += `<br /><small>${mw.html.escape(item.description)}</small>`;
				}
				return $("<li>").data('ui-autocomplete-item', item).append($("<a>").html(label)).appendTo(ul);
			};
			// add a listener to the "remove" button so that links can be deleted
			$('#wikidata-remove', form).on( 'click', function() {
				wikidataRemove(form);
			});
			$('#input-wikidata-label', form).change(function() {
				if (!$(this).val()) {
					wikidataRemove(form);
				}
			});
			var wikidataRemove = function(form) {
				$("#input-wikidata-value", form).val("");
				$("#input-wikidata-label", form).val("");
				$("#wikidata-value-display-container", form).hide();
				$('#div_wikidata_update', form).hide();
			};
			$('#wp-wd', form).on( 'click', function() {
				var wikipediaLink = $("#input-wikipedia", form).val();
				getWikidataFromWikipedia(wikipediaLink, form);
			});
			$('#wikidata-shared', form).on( 'click', function() {
				var wikidataRecord = $("#input-wikidata-value", form).val();
				updateWikidataSharedFields(wikidataRecord);
			});
			$('#wikidata-shared-quick', form).on( 'click', function() {
				var wikidataRecord = $("#input-wikidata-value", form).val();
				quickUpdateWikidataSharedFields(wikidataRecord);
			});
			var wikipediaSiteData = {
				apiUrl: SisterSite.API_WIKIPEDIA,
				selector: $('#input-wikipedia', form),
				form,
				ajaxData: {
					namespace: 0
				},
				updateLinkFunction: wikipediaLink
			};
			SisterSite.initializeSisterSiteAutocomplete(wikipediaSiteData);
			var commonsSiteData = {
				apiUrl: SisterSite.API_COMMONS,
				selector: $('#input-image', form),
				form,
				ajaxData: {
					namespace: 6
				},
				updateLinkFunction: commonsLink
			};
			SisterSite.initializeSisterSiteAutocomplete(commonsSiteData);
		};
		var wikipediaLink = function(value, form) {
			var wikipediaSiteLinkData = {
				inputSelector: '#input-wikipedia',
				containerSelector: '#wikipedia-value-display-container',
				linkContainerSelector: '#wikipedia-value-link',
				href: `${Config.WIKIPEDIA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
				linkTitle: translate( 'viewWikipediaPage' )
			};
			sisterSiteLinkDisplay(wikipediaSiteLinkData, form);
			$("#wp-wd", form).show();
			if ( value === '' ) { $("#wp-wd").hide(); }
		};
		var commonsLink = function(value, form) {
			var commonsSiteLinkData = {
				inputSelector: '#input-image',
				containerSelector: '#image-value-display-container',
				linkContainerSelector: '#image-value-link',
				href: `${Config.COMMONS_URL}/wiki/${mw.util.wikiUrlencode(`File:${value}`)}`,
				linkTitle: translate( 'viewCommonsPage' )
			};
			sisterSiteLinkDisplay(commonsSiteLinkData, form);
		};
		var sisterSiteLinkDisplay = function(siteLinkData, form) {
			var value = $(siteLinkData.inputSelector, form).val();
			var placeholderWD = $(siteLinkData.inputSelector, form).attr('placeholder');
			var placeholderDef = translate( `placeholder-${siteLinkData.inputSelector.substring(7)}` ); //skip #input-
			if ( !placeholderWD || !value && (placeholderDef == placeholderWD) ) {
				$(siteLinkData.containerSelector, form).hide();
			} else {
				var link = $("<a />", {
					target: "_new",
					href: siteLinkData.href,
					title: siteLinkData.linkTitle,
					text: siteLinkData.linkTitle
				});
				$(siteLinkData.linkContainerSelector, form).html(link);
				$(siteLinkData.containerSelector, form).show();
			}
		};
		var updateFieldIfNotNull = function(selector, value, placeholderBool) {
			if ( value !== null ) {
				if ( placeholderBool !== true ) {
					$(selector).val(value);
				} else {
					$(selector).val('').attr('placeholder', value).attr('disabled', true);
				}
			}
		};
		var quickUpdateWikidataSharedFields = function(wikidataRecord) {
			var ajaxUrl = SisterSite.API_WIKIDATA;
			var ajaxData = {
				action: 'wbgetentities',
				ids: wikidataRecord,
				languages: Config.LANG
			};
			var ajaxSuccess = function (jsonObj) {
				var msg = '';
				var res = [];
				for (var key in Config.WIKIDATA_CLAIMS) {
					res[key] = SisterSite.wikidataClaim(jsonObj, wikidataRecord, Config.WIKIDATA_CLAIMS[key].p);
					if (res[key]) {
						if (key === 'coords') { //WD coords already stored in DD notation; no need to apply any conversion
							res[key].latitude = trimDecimal(res[key].latitude, 6);
							res[key].longitude = trimDecimal(res[key].longitude, 6);
							msg += `\n${Config.WIKIDATA_CLAIMS[key].label}: ${res[key].latitude} ${res[key].longitude}`;
						}
						else if (key === 'iata') {
							msg += `\n${Config.WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
							res[key] = PROJECT_CONFIG.iata.replace( '%s', res[key] );
						}
						else if (key === 'email') {
							res[key] = res[key].replace('mailto:', '');
							msg += `\n${Config.WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
						}
						else msg += `\n${Config.WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
					}
				}
				var wikipedia = SisterSite.wikidataWikipedia(jsonObj, wikidataRecord);
				if (wikipedia) {
					msg += `\n${translate( 'sharedWikipedia' )}: ${wikipedia}`;
				}

				if (msg) {
					if ( confirm( `${translate( 'wikidataShared' )}\n${msg}`)) {
						for (key in res) {
							if (res[key]) {
								var editorField = [];
								for( var i = 0; i < Config.WIKIDATA_CLAIMS[key].fields.length; i++ ) { editorField[i] = `#${Config.LISTING_TEMPLATES.listing[Config.WIKIDATA_CLAIMS[key].fields[i]].id}`; }

								if ( (key !== 'iata') || ($('#input-alt').val() === '') || (/^IATA: ...$/.test($('#input-alt').val())) ) {
									if (key === 'coords') {
										updateFieldIfNotNull(editorField[0], res[key].latitude, Config.WIKIDATA_CLAIMS[key].remotely_sync);
										updateFieldIfNotNull(editorField[1], res[key].longitude, Config.WIKIDATA_CLAIMS[key].remotely_sync);
									}
									else {
										updateFieldIfNotNull(editorField[0], res[key], Config.WIKIDATA_CLAIMS[key].remotely_sync);
										if (key === 'image') { commonsLink(res[key]); }
									}
								}
							}
						}
						updateFieldIfNotNull('#input-wikipedia', wikipedia, true);
						if (wikipedia) {
							wikipediaLink(wikipedia);
						}
					}
				} else {
					alert( translate( 'wikidataSharedNotFound' ) );
				}
			};
			SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
		};
		var updateWikidataSharedFields = function(wikidataRecord) {
			var ajaxUrl = SisterSite.API_WIKIDATA;
			var ajaxData = {
				action: 'wbgetentities',
				ids: wikidataRecord,
				languages: Config.LANG
			};
			var ajaxSuccess = function (jsonObj) {
				var msg = `<form id="listing-editor-sync">${
					translate( 'wikidataSyncBlurb' )
					}<p>` +
					`<fieldset>` +
						`<span>` +
							`<span class="wikidata-update"></span>` +
							`<a href="javascript:" class="syncSelect" name="wd" title="${translate( 'selectAll' )}">Wikidata</a>` +
						`</span>` +
						`<a href="javascript:" id="autoSelect" class="listing-tooltip" title="${translate( 'selectAlternatives' )}">Auto</a>` +
						`<span>` +
							`<a href="javascript:" class="syncSelect" name="wv" title="${translate( 'selectAll' )}">Wikivoyage</a>` +
							`<span class="wikivoyage-update"></span>` +
						`</span>` +
					`</fieldset>` +
					`<div class="editor-fullwidth">`;

				var res = {};
				for (var key in Config.WIKIDATA_CLAIMS) {
					res[key] = {};
					res[key].value = SisterSite.wikidataClaim(jsonObj, wikidataRecord, Config.WIKIDATA_CLAIMS[key].p);
					res[key].guidObj = SisterSite.wikidataClaim(jsonObj, wikidataRecord, Config.WIKIDATA_CLAIMS[key].p, true);
					if (key === 'iata') {
						if( res[key].value ) {
							res[key].value = PROJECT_CONFIG.iata.replace( '%s', res[key].value );
						}
						msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
					}
					else if (key === 'email') {
						if( res[key].value ) { res[key].value = res[key].value.replace('mailto:', ''); }
						msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
					}
					else if (key === 'coords') {
						if ( res[key].value ) {
							res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
							res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
							msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value.latitude, res[key].value.longitude], res[key].guidObj);
						}
						else { msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj); }
					}
					else msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
				}
				var wikipedia = SisterSite.wikidataWikipedia(jsonObj, wikidataRecord);
				msg += createRadio( {
					label: translate( 'sharedWikipedia' ),
					fields: ['wikipedia'],
					doNotUpload: true,
					'remotely_sync': true
				}, [wikipedia], $('#input-wikidata-value').val());

				msg += `</div><p><small><a href="javascript:" class="clear">${translate( 'cancelAll' )}</a></small>`;
				msg += '</form>';

				var $syncDialogElement = $( msg );
				dialog.open($syncDialogElement, {
					title: translate( 'syncTitle' ),
					dialogClass: 'listing-editor-dialog listing-editor-dialog--wikidata-shared',

					buttons: [
						{
							text: translate( 'submit' ),
							click: submitFunction,
						},
						{
							text: translate( 'cancel' ),
							// eslint-disable-next-line object-shorthand
							click: function() {
								dialog.close(this);
							}
						},
					],
					// eslint-disable-next-line object-shorthand
					open: function() {
						$('#div_wikidata_update').hide();
						$('#wikidata-remove').hide();
						$('#input-wikidata-label').prop('disabled', true);
					},
					// eslint-disable-next-line object-shorthand
					close: function() {
						$('#div_wikidata_update').show();
						$('#wikidata-remove').show();
						$('#input-wikidata-label').prop('disabled', false);
						document.getElementById("listing-editor-sync").outerHTML = ""; // delete the dialog. Direct DOM manipulation so the model gets updated. This is to avoid issues with subsequent dialogs no longer matching labels with inputs because IDs are already in use.
					}
				});
				if($syncDialogElement.find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
					submitFunction();
					dialog.close(Config.SYNC_FORM_SELECTOR);
					alert( translate( 'wikidataSharedMatch' ) );
				}
				wikidataLink("", $("#input-wikidata-value").val()); // called to append the Wikidata link to the dialog title

				$syncDialogElement.find('.clear').on( 'click',  function() {
					$(Config.SYNC_FORM_SELECTOR).find('input:radio:not([id]):enabled').prop('checked', true);
				});
				$syncDialogElement.find('.syncSelect').on( 'click',  function() {
					var field = $(this).attr('name'); // wv or wd
					$(`${Config.SYNC_FORM_SELECTOR} input[type=radio]`).prop('checked', false);
					$(`${Config.SYNC_FORM_SELECTOR} input[id$=${field}]`).prop('checked', true);
				});
				$syncDialogElement.find('#autoSelect').on( 'click',  function() { // auto select non-empty values
					$(Config.SYNC_FORM_SELECTOR).find('.choose-row').each(function () {
						var WD_value = $(this).find('label:first').text().trim().length;
						var WV_value = $(this).find('label:last').text().trim().length;
						$(this).find('input[type="radio"]:eq(1)').prop('checked', true); // init with no preferred value
						if (WD_value) {
							if (!WV_value) {
								$(this).find('input[type="radio"]:first').prop('checked', true); //if WD label has text while WV don't, select WD
							}
						} else if (WV_value) {
							$(this).find('input[type="radio"]:last').prop('checked', true); //if WD label has no text while WV do, select WV
						}
					});
				});
			};
			SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
		};
		var createRadio = function(field, claimValue, guid) {
			var j = 0;
			for (j = 0; j < claimValue.length; j++) {
				if( claimValue[j] === null ) {
					claimValue[j] = '';
				}
			}
			field.label = field.label.split(/(\s+)/)[0]; // take first word
			var html = '';
			var editorField = [];
			var remoteFlag = false;
			for ( var i = 0; i < field.fields.length; i++ ) {
				editorField[i] = `#${Config.LISTING_TEMPLATES.listing[field.fields[i]].id}`;
			}
			// NOTE: this assumes a standard listing type. If ever a field in a nonstandard listing type is added to Wikidata sync, this must be changed

			for (j = 0; j < claimValue.length; j++) {
				// compare the present value to the Wikidata value
				if ( field.p === Config.WIKIDATA_CLAIMS.coords.p) {
				//If coords, then compared the values after trimming the WD one into decimal and converting into decimal and trimming the present one
					if((trimDecimal(Number(claimValue[j]), 6) != trimDecimal(parseDMS($(editorField[j]).val()), 6)) )
						break;
				} else if ( field.p === Config.WIKIDATA_CLAIMS.image.p) {
				//If image, then compared the values after converting underscores into spaces on the local value
					if( claimValue[j] != $(editorField[j]).val().replace(/_/g, ' ') )
						break;
				}
				else if( claimValue[j] != $(editorField[j]).val() )
					break;
			}
			if ( (j === claimValue.length) && (field.remotely_sync !== true) ) { return ''; }
			// if everything on WV equals everything on WD, skip this field

			if ( (field.doNotUpload === true) && (claimValue[0] === '') ) { return ''; }
			// if do not upload is set and there is nothing on WD, skip

			// if remotely synced, and there aren't any value(s) here or they are identical, skip with a message
			// also create an invisible radio button so that updateFieldIfNotNull is called
			if ( (field.remotely_sync === true) && ( j === claimValue.length || ( ( $(editorField[0]).val() === '' ) && ( ($(editorField[1]).val() === '' ) || ($(editorField[1]).val() === undefined) ) ) ) ) { remoteFlag = true; }
			if ( remoteFlag === true )
			{
				html += '<div class="choose-row" style="display:none">';
			}else { html += `<div class="sync_label">${field.label}</div><div class="choose-row">`; } // usual case, create heading
				html += `<div>` +
					`&nbsp;<label for="${field.label}-wd">`;

			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += makeSyncLinks(claimValue, field.p, false);
			}
			for (j = 0; j < claimValue.length; j++) { html += `${claimValue[j]}\n`; }
			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += '</a>';
			}

			html += `</label>` +
				`</div>` +
				`<div id="has-guid">` +
					`<input type="radio" id="${field.label}-wd" name="${field.label}"`;
					if ( remoteFlag === true ) { html += 'checked' } html += `>` +
					`<input type="hidden" value="${guid}">` +
				`</div>`;
				if ( remoteFlag === false ) { html +=
				`<div>` +
					`<input type="radio" name="${field.label}" checked>` +
				`</div>`;
				}
				html += '<div id="has-json">';
					html += '<input type="radio" ';
					if ( (remoteFlag !== true) && (field.doNotUpload !== true) ) { html += `id="${field.label}-wv" name="${field.label}"`; }
					else { html += 'disabled' }
					html += `><input type="hidden" value='${JSON.stringify(field)}'>` +
				`</div>` +
				`<div>` +
					`&nbsp;<label for="${field.label}-wv">`;

			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += makeSyncLinks(editorField, field.p, true);
			}
			for (i = 0; i < editorField.length; i++ ) { html += `${$(editorField[i]).val()}\n`; }
			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += '</a>';
			}

			html += '</label></div></div>\n';
			return html;
		};

		var submitFunction = function() {
			$(Config.SYNC_FORM_SELECTOR).find('input[id]:radio:checked').each(function () {
				var label = $(`label[for="${$(this).attr('id')}"]`);
				var syncedValue = label.text().split('\n');
				var field = JSON.parse($(this).parents('.choose-row').find('#has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
				var editorField = [];
				for( var i = 0; i < field.fields.length; i++ ) { editorField[i] = `#${Config.LISTING_TEMPLATES.listing[field.fields[i]].id}`; }
				var guidObj = $(this).parents('.choose-row').find('#has-guid > input:hidden:not(:radio)').val();

				if ( field.p === Config.WIKIDATA_CLAIMS.coords.p ) { //first latitude, then longitude
					var DDValue = [];
					for ( i = 0; i < editorField.length; i++) {
						DDValue[i] = syncedValue[i] ? trimDecimal(parseDMS(syncedValue[i]), 6) : '';
						updateFieldIfNotNull(editorField[i], syncedValue[i], field.remotely_sync);
					}
					// TODO: make the find on map link work for placeholder coords
					if( (DDValue[0]==='') && (DDValue[1]==='') ) {
							syncedValue = ''; // dummy empty value to removeFromWikidata
					} else if( !isNaN(DDValue[0]) && !isNaN(DDValue[1]) ){
						var precision = Math.min(DDValue[0].toString().replace(/\d/g, "0").replace(/$/, "1"), DDValue[1].toString().replace(/\d/g, "0").replace(/$/, "1"));
						syncedValue = `{ "latitude": ${DDValue[0]}, "longitude": ${DDValue[1]}, "precision": ${precision} }`;
					}
				}
				else {
					syncedValue = syncedValue[0]; // remove dummy newline
					updateFieldIfNotNull(editorField[0], syncedValue, field.remotely_sync);
					//After the sync with WD force the link to the WP & Common resource to be hidden as naturally happen in quickUpdateWikidataSharedFields
					//a nice alternative is to update the links in both functions
					if( $(this).attr('name') == 'wikipedia' ) { wikipediaLink(syncedValue, $("#listing-editor")); }
					if( field.p === Config.WIKIDATA_CLAIMS.image.p ) { commonsLink(syncedValue, $("#listing-editor")); }
					if( syncedValue !== '') {
						if( field.p === Config.WIKIDATA_CLAIMS.email.p ) { syncedValue = `mailto:${syncedValue}`; }
						syncedValue = `"${syncedValue}"`;
					}
				}

				var ajaxUrl = SisterSite.API_WIKIDATA;
				var ajaxData = {
					action: 'wbgetentities',
					ids: field.p,
					props: 'datatype',
				};
				var ajaxSuccess = function(jsonObj) {
					//if ( TODO: add logic for detecting Wikipedia and not doing this test. Otherwise get an error trying to find undefined. Keep in mind that we would in the future call sitelink changing here maybe. Not urgent, error harmless ) { }
					/*else*/ if ( jsonObj.entities[field.p].datatype === 'monolingualtext' ) { syncedValue = `{"text": ${syncedValue}, "language": "${Config.LANG}"}`; }
					if ( guidObj === "null" ) { // no value on Wikidata, string "null" gets saved in hidden field. There should be no cases in which there is no Wikidata item but this string does not equal "null"
						if (syncedValue !== '') { SisterSite.sendToWikidata(field.p , syncedValue, 'value'); }
					}
					else {
						if ( syncedValue !== "" ) {
							// this is changing, for when guid is not null and neither is the value
							// Wikidata silently ignores a request to change a value to its existing value
							SisterSite.changeOnWikidata(guidObj, field.p, syncedValue, 'value');
						}
						else if( (field.p !== Config.WIKIDATA_CLAIMS.coords.p) || (DDValue[0] === '' && DDValue[1] === '') ) {
								SisterSite.removeFromWikidata(guidObj);
						}
					}
				};
				if( (field.doNotUpload !== true) && ($(this).attr('id').search(/-wd$/) === -1) ) { // -1: regex not found
					SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
				}
			});

			// TODO: after testing is done, remove all console.log statements, do something about errors. alert? ignore?

			dialog.close(this);
		};
		var makeSyncLinks = function(value, mode, valBool) {
			var htmlPart = '<a target="_blank" rel="noopener noreferrer"';
			var i;
			switch(mode) {
				case Config.WIKIDATA_CLAIMS.coords.p:
					htmlPart += 'href="https://geohack.toolforge.org/geohack.php?params=';
					for (i = 0; i < value.length; i++) { htmlPart += `${parseDMS(valBool ? $(value[i]).val() : value[i])};`; }
					htmlPart += '_type:landmark">'; // sets the default zoom
					break;
				case Config.WIKIDATA_CLAIMS.url.p:
					htmlPart += 'href="';
					for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
					htmlPart += '">';
					break;
				case Config.WIKIDATA_CLAIMS.image.p:
					htmlPart += `href="https://${Config.LANG}.wikivoyage.org/wiki/File:`;
					for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
					htmlPart += '">';
					break;
			}
			return htmlPart;
		};
		var getWikidataFromWikipedia = function(wikipedia, form) {
			var ajaxUrl = SisterSite.API_WIKIPEDIA;
			var ajaxData = {
				action: 'query',
				prop: 'pageprops',
				ppprop: 'wikibase_item',
				indexpageids: 1,
				titles: wikipedia,
			};
			var ajaxSuccess = function (jsonObj) {
				var wikidataID = SisterSite.wikipediaWikidata(jsonObj);

				if( wikidataID ) {
					$("#input-wikidata-value").val(wikidataID);
					$("#input-wikidata-label").val(wikidataID);
					wikidataLink(form, wikidataID);
				}
			};
			SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
		};
		var parseWikiDataResult = function(jsonObj) {
			var results = [];
			for (var i=0; i < $(jsonObj.search).length; i++) {
				var result = $(jsonObj.search)[i];
				var label = result.label;
				if (result.match && result.match.text) {
					label = result.match.text;
				}
				var data = {
					value: label,
					label,
					description: result.description,
					id: result.id
				};
				results.push(data);
			}
			return results;
		};
		var wikidataLink = function(form, value) {
			var link = $("<a />", {
				target: "_new",
				href: `${Config.WIKIDATA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
				title: translate( 'viewWikidataPage' ),
				text: value
			});
			$("#wikidata-value-link", form).html(link);
			$("#wikidata-value-display-container", form).show();
			$('#div_wikidata_update', form).show();
			if ( $(Config.SYNC_FORM_SELECTOR).prev().find(".ui-dialog-title").length ) { $(Config.SYNC_FORM_SELECTOR).prev().find(".ui-dialog-title").append( ' &mdash; ' ).append(link.clone()); } // add to title of Wikidata sync dialog, if it is open
		};
		CREATE_FORM_CALLBACKS.push(wikidataLookup);

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
			if (mode == Core.MODE_ADD || $(EDITOR_LAST_EDIT_SELECTOR).is(':checked')) {
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

	var SisterSite = function() {
		var API_WIKIDATA = `${Config.WIKIDATA_URL}/w/api.php`;
		var API_WIKIPEDIA = `${Config.WIKIPEDIA_URL}/w/api.php`;
		var API_COMMONS = `${Config.COMMONS_URL}/w/api.php`;
		var WIKIDATA_PROP_WMURL = 'P143'; // Wikimedia import URL
		var WIKIDATA_PROP_WMPRJ = 'P4656'; // Wikimedia project source of import

		var _initializeSisterSiteAutocomplete = function(siteData) {
			var currentValue = $(siteData.selector).val();
			if (currentValue) {
				siteData.updateLinkFunction(currentValue, siteData.form);
			}
			$(siteData.selector).change(function() {
				siteData.updateLinkFunction($(siteData.selector).val(), siteData.form);
			});
			siteData.selectFunction = function(event, ui) {
				siteData.updateLinkFunction(ui.item.value, siteData.form);
			};
			var ajaxData = siteData.ajaxData;
			ajaxData.action = 'opensearch';
			ajaxData.list = 'search';
			ajaxData.limit = 10;
			ajaxData.redirects = 'resolve';
			var parseAjaxResponse = function(jsonObj) {
				var results = [];
				var titleResults = $(jsonObj[1]);
				for (var i=0; i < titleResults.length; i++) {
					var result = titleResults[i];
					var valueWithoutFileNamespace = (result.indexOf("File:") != -1) ? result.substring("File:".length) : result;
					var titleResult = { value: valueWithoutFileNamespace, label: result, description: $(jsonObj[2])[i], link: $(jsonObj[3])[i] };
					results.push(titleResult);
				}
				return results;
			};
			_initializeAutocomplete(siteData, ajaxData, parseAjaxResponse);
		};
		var _initializeAutocomplete = function(siteData, ajaxData, parseAjaxResponse) {
			var autocompleteOptions = {
				// eslint-disable-next-line object-shorthand
				source: function(request, response) {
					ajaxData.search = request.term;
					var ajaxSuccess = function(jsonObj) {
						response(parseAjaxResponse(jsonObj));
					};
					_ajaxSisterSiteSearch(siteData.apiUrl, ajaxData, ajaxSuccess);
				}
			};
			if (siteData.selectFunction) {
				autocompleteOptions.select = siteData.selectFunction;
			}
			siteData.selector.autocomplete(autocompleteOptions);
		};
		// perform an ajax query of a sister site
		var _ajaxSisterSiteSearch = function(ajaxUrl, ajaxData, ajaxSuccess) {
			ajaxData.format = 'json';
			$.ajax({
				url: ajaxUrl,
				data: ajaxData,
				dataType: 'jsonp',
				success: ajaxSuccess
			});
		};
		// parse the wikidata "claim" object from the wikidata response
		var _wikidataClaim = function(jsonObj, value, property, guidBool) {
			var entity = _wikidataEntity(jsonObj, value);
			if (!entity || !entity.claims || !entity.claims[property]) {
				return null;
			}
			var propertyObj = entity.claims[property];
			if (!propertyObj || propertyObj.length < 1 || !propertyObj[0].mainsnak || !propertyObj[0].mainsnak.datavalue) {
				return null;
			}
			var index = 0;
			if( propertyObj[index].mainsnak.datavalue.type === "monolingualtext" ) { // have to select correct language, Wikidata sends all despite specifying
				while( propertyObj[index].mainsnak.datavalue.value.language !== Config.LANG ) {
					index = index + 1;
					if( !(propertyObj[index]) ) { return null; } // if we run out of langs and none of them matched
				}
				if (guidBool === true) { return propertyObj[index].id }
				return propertyObj[index].mainsnak.datavalue.value.text;
			}
			if (guidBool === true) { return propertyObj[index].id }
			return propertyObj[index].mainsnak.datavalue.value;
		};
		// parse the wikidata "entity" object from the wikidata response
		var _wikidataEntity = function(jsonObj, value) {
			if (!jsonObj || !jsonObj.entities || !jsonObj.entities[value]) {
				return null;
			}
			return jsonObj.entities[value];
		};
		// parse the wikidata display label from the wikidata response
		var _wikidataLabel = function(jsonObj, value) {
			var entityObj = _wikidataEntity(jsonObj, value);
			if (!entityObj || !entityObj.labels || !entityObj.labels.en) {
				return null;
			}
			return entityObj.labels.en.value;
		};
		// parse the wikipedia link from the wikidata response
		var _wikidataWikipedia = function(jsonObj, value) {
			var entityObj = _wikidataEntity(jsonObj, value);
			if (!entityObj || !entityObj.sitelinks || !entityObj.sitelinks[Config.WIKIDATA_SITELINK_WIKIPEDIA] || !entityObj.sitelinks[Config.WIKIDATA_SITELINK_WIKIPEDIA].title) {
				return null;
			}
			return entityObj.sitelinks[Config.WIKIDATA_SITELINK_WIKIPEDIA].title;
		};

		var _wikipediaWikidata = function(jsonObj) {
			if (!jsonObj || !jsonObj.query || jsonObj.query.pageids[0] == "-1" ) { // wikipedia returns -1 pageid when page is not found
				return null;
			}
			var pageID = jsonObj.query.pageids[0];
			return jsonObj['query']['pages'][pageID]['pageprops']['wikibase_item'];
		};
		var _sendToWikidata = function(prop, value, snaktype) {
			var ajaxData = {
				action: 'wbcreateclaim',
				entity: $('#input-wikidata-value').val(),
				property: prop,
				snaktype,
				value,
				format: 'json',
			};
			var ajaxSuccess = function(jsonObj) {
				SisterSite.referenceWikidata(jsonObj);
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} ); // async disabled because otherwise get edit conflicts with multiple changes submitted at once
		};
		var _removeFromWikidata = function(guidObj) {
			var ajaxData = {
				action: 'wbremoveclaims',
				claim: guidObj,
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, { async: false } );
		};
		var _changeOnWikidata = function(guidObj, prop, value, snaktype) {
			var ajaxData = {
				action: 'wbsetclaimvalue',
				claim: guidObj,
				snaktype,
				value
			};
			var ajaxSuccess = function(jsonObj) {
				if( jsonObj.claim ) {
					if( !(jsonObj.claim.references) ) { // if no references, add imported from
						SisterSite.referenceWikidata(jsonObj);
					}
					else if ( jsonObj.claim.references.length === 1 ) { // skip if >1 reference; too complex to automatically set
						var acceptedProps = [WIKIDATA_PROP_WMURL, WIKIDATA_PROP_WMPRJ]; // properties relating to Wikimedia import only
						var diff = $(jsonObj.claim.references[0]['snaks-order']).not(acceptedProps).get(); // x-compatible method for diff on arrays, from https://stackoverflow.com/q/1187518
						if( diff.length === 0 ) { // if the set of present properties is a subset of the set of acceptable properties
							SisterSite.unreferenceWikidata(jsonObj.claim.id, jsonObj.claim.references[0].hash); // then remove the current reference
							SisterSite.referenceWikidata(jsonObj); // and add imported from
						}
					}
				}
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
		};
		var _referenceWikidata = function(jsonObj) {
			var revUrl = `https:${mw.config.get('wgServer')}${mw.config.get('wgArticlePath').replace('$1', '')}${mw.config.get('wgPageName')}?oldid=${mw.config.get('wgCurRevisionId')}`; // surprising that there is no API call for this
			var ajaxData = {
				action: 'wbsetreference',
				statement: jsonObj.claim.id,
				snaks: `{"${WIKIDATA_PROP_WMURL}":[{"snaktype":"value","property":"${WIKIDATA_PROP_WMURL}","datavalue":{"type":"wikibase-entityid","value":{"entity-type":"item","numeric-id":"${Config.WIKIDATAID}"}}}],` +
					`"${WIKIDATA_PROP_WMPRJ}": [{"snaktype":"value","property":"${WIKIDATA_PROP_WMPRJ}","datavalue":{"type":"string","value":"${revUrl}"}}]}`,
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, { async: false } );
		};
		var _unreferenceWikidata = function(statement, references) {
			var ajaxData = {
				action: 'wbremovereferences',
				statement,
				references
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, { async: false } );
		};
		// expose public members
		return {
			API_WIKIDATA,
			API_WIKIPEDIA,
			API_COMMONS,
			initializeSisterSiteAutocomplete: _initializeSisterSiteAutocomplete,
			ajaxSisterSiteSearch: _ajaxSisterSiteSearch,
			wikidataClaim: _wikidataClaim,
			wikidataWikipedia: _wikidataWikipedia,
			wikidataLabel: _wikidataLabel,
			wikipediaWikidata: _wikipediaWikidata,
			sendToWikidata: _sendToWikidata,
			removeFromWikidata: _removeFromWikidata,
			changeOnWikidata: _changeOnWikidata,
			referenceWikidata: _referenceWikidata,
			unreferenceWikidata: _unreferenceWikidata
		};
	}();

	/* ***********************************************************************
	 * Core contains code that should be shared across different
	 * Wikivoyage languages. This code uses the custom configurations in the
	 * Config and Callback modules to initialize
	 * the listing editor and process add and update requests for listings.
	 * ***********************************************************************/
	var Core = require( './Core.js' )( Callbacks, Config, PROJECT_CONFIG, translate );

	return Core;
} );

//</nowiki>
