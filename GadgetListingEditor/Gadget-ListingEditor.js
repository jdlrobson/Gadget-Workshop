/******************************************************************
Listing Editor v2.4.2
	Original author:
	- torty3
	Additional contributors:
	- Andyrom75
	- ARR8
	- RolandUnger
	- Wrh2
	Changelog: https://en.wikivoyage.org/wiki/Wikivoyage:Listing_editor#Changelog

	TODO
	- Add support for mobile devices.
	- wrapContent is breaking the expand/collapse logic on the VFD page.
	- populate the input-type select list from LISTING_TEMPLATES
	- Allow syncing Wikipedia link back to Wikidata with wbsetsitelink
	- Allow hierarchy of preferred sources, rather than just one source, for Wikidata sync
		- E.g. get URL with language of work = english before any other language version if exists
		- E.g. get fall back to getting coordinate of headquarters if geographic coordinates unavailable. Prioritize getting coordinates of entrance before any other coordinates if all present
		- E.g. Can use multiple sources to fetch address
		- Figure out how to get this to upload properly
********************************************************************/
//<nowiki>

module.exports = ( function ( ALLOWED_NAMESPACE, TRANSLATIONS, SECTION_TO_TEMPLATE_TYPE ) {
	'use strict';

	/* ***********************************************************************
	 * CUSTOMIZATION INSTRUCTIONS:
	 *
	 * Different Wikivoyage language versions have different implementations of
	 * the listing template, so this module must be customized for each. The
	 * Config and Callbacks modules should be the
	 * ONLY code that requires customization - Core should be
	 * shared across all language versions. If for some reason the Core module
	 * must be modified, ideally the module should be modified for all language
	 * versions so that the code can stay in sync.
	 * ***********************************************************************/

	// see http://toddmotto.com/mastering-the-module-pattern/ for an overview
	// of the module design pattern being used in this gadget

	/* ***********************************************************************
	 * Config contains properties that will likely need to be
	 * modified for each Wikivoyage language version. Properties in this
	 * module will be referenced from the other ListingEditor modules.
	 * ***********************************************************************/
	var PROJECT_CONFIG_ENWIKIVOYAGE = {
		iata: function ( value ) {
			return `{{IATA|${value}}}`
		},
		LISTING_TEMPLATES_OMIT: [],
		SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT: true,
		ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP: true,
		LISTING_TYPE_PARAMETER: 'type',
		LISTING_CONTENT_PARAMETER: 'content',
		DEFAULT_LISTING_TEMPLATE: 'listing',
		DEFAULT_PLACEHOLDERS: {
			'name':				'name of place',
			'alt':				'also known as',
			'url':				'https://www.example.com',
			'address':			'address of place',
			'directions':		'how to get here',
			'phone':			'+55 555 555 5555',
			'tollfree':			'+1 800 100 1000',
			'fax':				'+55 555 555 555',
			'email':			'info@example.com',
			'lastedit':			'2020-01-15',
			'lat':				'11.11111',
			'long':				'111.11111',
			'hours':			'9AM-5PM or 09:00-17:00',
			'checkin':			'check in time',
			'checkout':			'check out time',
			'price':			'entry or service price',
			'wikidata-label':	'wikidata record',
			'wikipedia':		'wikipedia article',
			'image':			'image of place',
			'content':			'description of place',
			'summary':			'reason listing was changed'
		},
		SLEEP_TEMPLATE_PARAMETERS: {
			'hours': { hideDivIfEmpty: 'div_hours', skipIfEmpty: true },
			'checkin': { hideDivIfEmpty: null, skipIfEmpty: false },
			'checkout': { hideDivIfEmpty: null, skipIfEmpty: false }
		},
		LISTING_TEMPLATE_PARAMETERS: {
			'type': { id:'input-type', hideDivIfEmpty: 'div_type', newline: true },
			'name': { id:'input-name' },
			'alt': { id:'input-alt' },
			'url': { id:'input-url' },
			'email': { id:'input-email', newline: true },
			'address': { id:'input-address' },
			'lat': { id:'input-lat' },
			'long': { id:'input-long' },
			'directions': { id:'input-directions', newline: true },
			'phone': { id:'input-phone' },
			'tollfree': { id:'input-tollfree' },
			'fax': { id:'input-fax', hideDivIfEmpty: 'div_fax', newline: true, skipIfEmpty: true },
			'hours': { id:'input-hours' },
			'checkin': { id:'input-checkin', hideDivIfEmpty: 'div_checkin', skipIfEmpty: true },
			'checkout': { id:'input-checkout', hideDivIfEmpty: 'div_checkout', skipIfEmpty: true },
			'price': { id:'input-price', newline: true },
			'wikipedia': { id:'input-wikipedia', skipIfEmpty: true },
			'image': { id:'input-image', skipIfEmpty: true },
			'wikidata': { id:'input-wikidata-value', newline: true, skipIfEmpty: true },
			'lastedit': { id:'input-lastedit', newline: true, skipIfEmpty: true },
			'content': { id:'input-content', newline: true }
		},
		WIKIDATAID: '19826574',
		SPECIAL_CHARS: []
	};

	var PROJECT_CONFIG_DIRECTORY = {
		enwikivoyage: PROJECT_CONFIG_ENWIKIVOYAGE
	};

	var TRANSLATIONS_EDITOR_FORM = {
		en: {
			editSummary: 'Edit Summary',
			name: 'Name',
			alt: 'Alt',
			website: 'Website',
			address: 'Address',
			directions: 'Directions',
			phone: 'Phone',
			tollfree: 'Tollfree',
			fax: 'Fax',
			lastUpdated: 'Last Updated',
			syncWikidata: 'Sync shared fields to/from Wikidata',
			syncWikidataTitle: 'This simply gets the values from Wikidata and replaces the local values. Useful for new listings.',
			syncWikidataLabel: '(quick fetch)',
			content: 'Content',
			minorTitle: 'Check the box if the change to the listing is minor, such as a typo correction',
			minorLabel: 'minor change?',
			preview: 'Preview',
			email: 'Email',
			type: 'Type',
			latitude: 'Latitude',
			longitude: 'Longitude',
			findOnMap: 'find on map',
			hours: 'Hours',
			checkin: 'Check-in',
			checkout: 'Check-out',
			price: 'Price',
			wpWd: 'Get ID from Wikipedia article',
			wikidataRemoveTitle: 'Delete the Wikidata entry from this listing',
			wikidataRemoveLabel: 'remove',
			image: 'Image',
			listingTooltip: 'Check the box if the business is no longer in operation or if the listing should be deleted for some other reason, and it will be removed from this article',
			listingLabel: 'delete this listing?',
			listingUpdatedTooltip: 'Check the box if the information in this listing has been verified to be current and accurate, and the last updated date will be changed to the current date',
			listingUpdatedLabel: 'mark the listing as up-to-date?'
		}
	};

	var TRANSLATIONS_EDITOR_FORM = Object.assign(
		{},
		TRANSLATIONS_EDITOR_FORM_LOOKUP.en,
		TRANSLATIONS_EDITOR_FORM_LOOKUP[ mw.config.get( 'wgUserLanguage' ) ]
	);

	var DB_NAME = mw.config.get( 'wgDBname' );
	var PROJECT_CONFIG = Object.assign( {}, PROJECT_CONFIG_ENWIKIVOYAGE, PROJECT_CONFIG_DIRECTORY[ DB_NAME ] )

	var Config = function( ALLOWED_NAMESPACE ) {
		var PAGE_VIEW_LANGUAGE = mw.config.get( 'wgPageViewLanguage' );
		var LANG = mw.config.get( 'wgUserLanguage', 'en' );
		var WIKIDATAID = PROJECT_CONFIG.WIKIDATAID;
		var COMMONS_URL = '//commons.wikimedia.org';
		var WIKIDATA_URL = '//www.wikidata.org';
		var WIKIPEDIA_URL = '//' + PAGE_VIEW_LANGUAGE + '.wikipedia.org';
		var WIKIDATA_SITELINK_WIKIPEDIA = LANG + 'wiki';

		// --------------------------------------------------------------------
		// TRANSLATE AND CONFIGURE
		// --------------------------------------------------------------------
		//	- doNotUpload: hide upload option
		//	- remotely_sync: for fields which can auto-acquire values, leave the local value blank when syncing

		var WIKIDATA_CLAIMS = {
			'coords':		{ 'p': 'P625', 'label': 'coordinates', 'fields': ['lat', 'long'], 'remotely_sync': false, },
			'url':			{ 'p': 'P856', 'label': 'website', 'fields': ['url'], }, // link
			'email':		{ 'p': 'P968', 'label': 'e-mail', 'fields': ['email'], },
			'iata':			{ 'p': 'P238', 'label': 'IATA code (if Alt is empty)', 'fields': ['alt'], 'doNotUpload': true, },
			'image':		{ 'p': 'P18', 'label': 'image', 'fields': ['image'], 'remotely_sync': true, },
			//'directions':	{ 'p': 'P2795', 'label': 'directions', 'fields': ['directions'], },
		};

		var lookupField = function ( property ) {
			return TRANSLATIONS['property' + property] || [];
		};

		var WIKIDATA_CLAIMS = {
			'coords':		{ 'p': 'P625', 'label': 'coordinates', 'fields': lookupField( 'P625'), 'remotely_sync': false, },
			'url':			{ 'p': 'P856', 'label': 'website', 'fields': lookupField( 'P856') }, // link
			'email':		{ 'p': 'P968', 'label': 'e-mail', 'fields': lookupField( 'P968') },
			'iata':			{ 'p': 'P238', 'label': 'IATA code (if Alt is empty)', 'fields': lookupField( 'P238'), 'doNotUpload': true, },
			'image':		{ 'p': 'P18', 'label': 'image', 'fields': lookupField( 'P18'), 'remotely_sync': true, }
		};

		// --------------------------------------------------------------------
		// CONFIGURE THE FOLLOWING BASED ON WIKIVOYAGE COMMUNITY PREFERENCES
		// --------------------------------------------------------------------

		// if the browser window width is less than MAX_DIALOG_WIDTH (pixels), the
		// listing editor dialog will fill the available space, otherwise it will
		// be limited to the specified width
		var MAX_DIALOG_WIDTH = 1200;
		// set this flag to false if the listing editor should strip away any
		// listing template parameters that are not explicitly configured in the
		// LISTING_TEMPLATES parameter arrays (such as wikipedia, phoneextra, etc).
		// if the flag is set to true then unrecognized parameters will be allowed
		// as long as they have a non-empty value.
		var ALLOW_UNRECOGNIZED_PARAMETERS = PROJECT_CONFIG.ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP;

		// --------------------------------------------------------------------
		// CONFIGURE THE FOLLOWING TO MATCH THE LISTING TEMPLATE PARAMS & OUTPUT
		// --------------------------------------------------------------------

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
		// override the default settings for "sleep" listings since that
		// listing type uses "checkin"/"checkout" instead of "hours"
		var SLEEP_TEMPLATE_PARAMETERS = $.extend(true, {}, LISTING_TEMPLATE_PARAMETERS, PROJECT_CONFIG.SLEEP_TEMPLATE_PARAMETERS );

		// map the template name to configuration information needed by the listing
		// editor
		var LISTING_TEMPLATES = {
			'listing': LISTING_TEMPLATE_PARAMETERS,
			'see': LISTING_TEMPLATE_PARAMETERS,
			'do': LISTING_TEMPLATE_PARAMETERS,
			'buy': LISTING_TEMPLATE_PARAMETERS,
			'eat': LISTING_TEMPLATE_PARAMETERS,
			'drink': LISTING_TEMPLATE_PARAMETERS,
			'go': LISTING_TEMPLATE_PARAMETERS,
			'sleep': SLEEP_TEMPLATE_PARAMETERS
		};

		( PROJECT_CONFIG.LISTING_TEMPLATES_OMIT || [] ).forEach( function ( key ) {
			delete LISTING_TEMPLATES[ key ];
		} );

		// --------------------------------------------------------------------
		// CONFIGURE THE FOLLOWING TO IMPLEMENT THE UI FOR THE LISTING EDITOR
		// --------------------------------------------------------------------

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
		
		var INTL_CURRENCIES = [ '€', '$', '£', '¥', '₩' ];
		var SPECIAL_CHARS = PROJECT_CONFIG.SPECIAL_CHARS;
		
		var DEFAULT_PLACEHOLDERS = PROJECT_CONFIG.DEFAULT_PLACEHOLDERS;

		// the below HTML is the UI that will be loaded into the listing editor
		// dialog box when a listing is added or edited. EACH WIKIVOYAGE
		// LANGUAGE SITE CAN CUSTOMIZE THIS HTML - fields can be removed,
		// added, displayed differently, etc. Note that it is important that
		// any changes to the HTML structure are also made to the
		// LISTING_TEMPLATES parameter arrays since that array provides the
		// mapping between the editor HTML and the listing template fields.
		var EDITOR_FORM_HTML = '<form id="listing-editor">' +
			'<div class="listing-col">' +
				'<div class="editor-fullwidth">' +
				'<div id="div_name" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-name">' + TRANSLATIONS_EDITOR_FORM.name + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-name"></div>' +
				'</div>' +
				'<div id="div_alt" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-alt">' + TRANSLATIONS_EDITOR_FORM.alt + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-alt"></div>' +
				'</div>' +
				'<div id="div_url" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-url">' + TRANSLATIONS_EDITOR_FORM.website + '<span class="wikidata-update"></span></label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-url"></div>' +
				'</div>' +
				'<div id="div_address" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-address">' + TRANSLATIONS_EDITOR_FORM.address + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-address"></div>' +
				'</div>' +
				'<div id="div_directions" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-directions">' + TRANSLATIONS_EDITOR_FORM.directions + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-directions"></div>' +
				'</div>' +
				'<div id="div_phone" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-phone">' + TRANSLATIONS_EDITOR_FORM.phone + '</label></div>' +
					'<div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-phone"><div class="input-cc" data-for="input-phone"></div></div>' +
				'</div>' +
				'<div id="div_tollfree" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-tollfree">' + TRANSLATIONS_EDITOR_FORM.tollfree + '</label></div>' +
					'<div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-tollfree"><div class="input-cc" data-for="input-tollfree"></div></div>' +
				'</div>' +
				'<div id="div_fax" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-fax">' + TRANSLATIONS_EDITOR_FORM.fax + '</label></div>' +
					'<div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-fax"><div class="input-cc" data-for="input-fax"></div></div>' +
				'</div>' +
				'<div id="div_email" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-email">' + TRANSLATIONS_EDITOR_FORM.email + '<span class="wikidata-update"></span></label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-email"></div>' +
				'</div>' +
				'<div id="div_lastedit" style="display: none;">' +
					'<div class="editor-label-col"><label for="input-lastedit">' + TRANSLATIONS_EDITOR_FORM.lastUpdated + '</label></div>' +
					'<div><input type="text" size="10" id="input-lastedit"></div>' +
				'</div>' +
				'<div id="div_wikidata_update" style="display: none">' +
					'<div class="editor-label-col">&#160;</div>' +
					'<div><span class="wikidata-update"></span><a href="javascript:" id="wikidata-shared">' + TRANSLATIONS_EDITOR_FORM.syncWikidata + '</a><small>&nbsp;<a href="javascript:" title="' + TRANSLATIONS_EDITOR_FORM.syncWikidataTitle + '" class="listing-tooltip" id="wikidata-shared-quick">' + TRANSLATIONS_EDITOR_FORM.syncWikidataLabel + '</a></small></div>' +
				'</div>' +
				'</div>' +
			'</div>' +
			'<div class="listing-col">' +
				'<div class="editor-fullwidth">' +
				'<div id="div_type" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-type">' + TRANSLATIONS_EDITOR_FORM.type + '</label></div>' +
					'<div>' +
						'<select id="input-type">' +
							'<option value="listing">listing</option>' +
							'<option value="see">see</option>' +
							'<option value="do">do</option>' +
							'<option value="buy">buy</option>' +
							'<option value="eat">eat</option>' +
							'<option value="drink">drink</option>' +
							'<option value="go">go</option>' +
							'<option value="sleep">sleep</option>' +
						'</select>' +
					'</div>' +
				'</div>' +
				'<div id="div_lat" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-lat">' + TRANSLATIONS_EDITOR_FORM.latitude + '<span class="wikidata-update"></span></label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-lat">' +
						// update the Callbacks.initFindOnMapLink
						// method if this field is removed or modified
						'<div class="input-other"><a id="geomap-link" target="_blank" href="https://wikivoyage.toolforge.org/w/geomap.php">' + TRANSLATIONS_EDITOR_FORM.findOnMap + '</a></div>' +
					'</div>' +
				'</div>' +
				'<div id="div_long" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-long">' + TRANSLATIONS_EDITOR_FORM.longitude + '<span class="wikidata-update"></span></label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-long">' +
					'</div>' +
				'</div>' +
				'<div id="div_hours" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-hours">' + TRANSLATIONS_EDITOR_FORM.hours + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-hours"></div>' +
				'</div>' +
				'<div id="div_checkin" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-checkin">' + TRANSLATIONS_EDITOR_FORM.checkin + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-checkin"></div>' +
				'</div>' +
				'<div id="div_checkout" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-checkout">' + TRANSLATIONS_EDITOR_FORM.checkout + '</label></div>' +
					'<div><input type="text" class="editor-fullwidth" id="input-checkout"></div>' +
				'</div>' +
				'<div id="div_price" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-price">' + TRANSLATIONS_EDITOR_FORM.price + '</label></div>' +
					// update the Callbacks.initStringFormFields
					// method if the currency symbols are removed or modified
					'<div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-price">' +
						'<div class="input-price">' +
							'<span id="span_natl_currency" title="' + TRANSLATIONS.natlCurrencyTitle + '"></span>' +
							'<span id="span_intl_currencies" title="' + TRANSLATIONS.intlCurrenciesTitle + '">';

		for (var i = 0; i < INTL_CURRENCIES.length; i++) {
			EDITOR_FORM_HTML +=	'<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">' + INTL_CURRENCIES[i] + '</a></span>';
		}

		EDITOR_FORM_HTML +=					
							'</span>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'<div id="div_wikidata" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-wikidata-label">Wikidata</label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-wikidata-label">' +
						'<input type="hidden" id="input-wikidata-value">' +
						'<a href="javascript:" id="wp-wd" title="' + TRANSLATIONS_EDITOR_FORM.wpWd + '" style="display:none"><small>&#160;WP</small></a>' +
						'<span id="wikidata-value-display-container" style="display:none">' +
							'<small>' +
							'&#160;<span id="wikidata-value-link"></span>' +
							'&#160;|&#160;<a href="javascript:" id="wikidata-remove" title="' + TRANSLATIONS_EDITOR_FORM.wikidataRemoveTitle + '">' + TRANSLATIONS_EDITOR_FORM.wikidataRemoveLabel + '</a>' +
							'</small>' +
						'</span>' +
					'</div>' +
				'</div>' +
				'<div id="div_wikipedia" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-wikipedia">Wikipedia<span class="wikidata-update"></span></label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-wikipedia">' +
						'<span id="wikipedia-value-display-container" style="display:none">' +
							'<small>&#160;<span id="wikipedia-value-link"></span></small>' +
						'</span>' +
					'</div>' +
				'</div>' +
				'<div id="div_image" class="editor-row">' +
					'<div class="editor-label-col"><label for="input-image">' + TRANSLATIONS_EDITOR_FORM.image + '<span class="wikidata-update"></span></label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-image">' +
						'<spaqn id="image-value-display-container" style="display:none">' +
							'<small>&#160;<span id="image-value-link"></span></small>' +
						'</span>' +
					'</div>' +
				'</div>' +
				'</div>' +
			'</div>' +
			'<div id="div_content" class="editor-row">' +
				'<div class="editor-label-col"><label for="input-content">Content';
		if (SPECIAL_CHARS.length){
			EDITOR_FORM_HTML +=	'<br />(';
			for (i = 0; i < SPECIAL_CHARS.length; i++) {
				EDITOR_FORM_HTML +=	'<span class="listing-charinsert" data-for="input-content"> <a href="javascript:">' + SPECIAL_CHARS[i] + '</a></span>';
			}
			EDITOR_FORM_HTML +=	'&nbsp;)';
		}
		EDITOR_FORM_HTML +=
				'</label></div>' +
				'<div><textarea rows="8" class="editor-fullwidth" id="input-content"></textarea></div>' +
			'</div>' +
			// update the Callbacks.hideEditOnlyFields method if
			// the status row is removed or modified
			'<div id="div_status" class="editor-fullwidth">' +
				'<div class="editor-label-col"><label>Status</label></div>' +
				'<div>' +
					'<span id="span-closed">' +
						'<input type="checkbox" id="input-closed">' +
						'<label for="input-closed" class="listing-tooltip" title="' + TRANSLATIONS_EDITOR_FORM.listingTooltip + '">' + TRANSLATIONS_EDITOR_FORM.listinglLabel + '</label>' +
					'</span>' +
					// update the Callbacks.updateLastEditDate
					// method if the last edit input is removed or modified
					'<span id="span-last-edit">' +
						'<input type="checkbox" id="input-last-edit" />' +
						'<label for="input-last-edit" class="listing-tooltip" title="' + TRANSLATIONS_EDITOR_FORM.listingUpdatedTooltip + '">' + TRANSLATIONS_EDITOR_FORM.listingUpdatedLabel + '</label>' +
					'</span>' +
				'</div>' +
			'</div>' +
			// update the Callbacks.hideEditOnlyFields method if
			// the summary table is removed or modified
			'<div id="div_summary" class="editor-fullwidth">' +
				'<div class="listing-divider"></div>' +
				'<div class="editor-row">' +
					'<div class="editor-label-col"><label for="input-summary">' + TRANSLATIONS_EDITOR_FORM.editSummary + '</label></div>' +
					'<div>' +
						'<input type="text" class="editor-partialwidth" id="input-summary">' +
						'<span id="span-minor"><input type="checkbox" id="input-minor"><label for="input-minor" class="listing-tooltip" title="' + TRANSLATIONS_EDITOR_FORM.minorTitle + '">' + TRANSLATIONS_EDITOR_FORM.minorLabel + '</label></span>' +
					'</div>' +
				'</div>' +
			'</div>' +
			'<div id="listing-preview" style="display: none;">' +
				'<div class="listing-divider"></div>' +
				'<div class="editor-row">' +
					'<div title="Preview">' + TRANSLATIONS_EDITOR_FORM.preview + '</div>' +
					'<div id="listing-preview-text"></div>' +
				'</div>' +
			'</div>' +
			'</form>';

		// expose public members
		return {
			LANG: LANG,
			WIKIDATAID: WIKIDATAID,
			COMMONS_URL: COMMONS_URL,
			WIKIDATA_URL: WIKIDATA_URL,
			WIKIDATA_CLAIMS: WIKIDATA_CLAIMS,
			WIKIPEDIA_URL: WIKIPEDIA_URL,
			WIKIDATA_SITELINK_WIKIPEDIA: WIKIDATA_SITELINK_WIKIPEDIA,
			TRANSLATIONS: TRANSLATIONS,
			MAX_DIALOG_WIDTH: MAX_DIALOG_WIDTH,
			ALLOWED_NAMESPACE: ALLOWED_NAMESPACE,
			DEFAULT_LISTING_TEMPLATE: DEFAULT_LISTING_TEMPLATE,
			LISTING_TYPE_PARAMETER: LISTING_TYPE_PARAMETER,
			LISTING_CONTENT_PARAMETER: LISTING_CONTENT_PARAMETER,
			ALLOW_UNRECOGNIZED_PARAMETERS: ALLOW_UNRECOGNIZED_PARAMETERS,
			SECTION_TO_TEMPLATE_TYPE: SECTION_TO_TEMPLATE_TYPE,
			LISTING_TEMPLATES: LISTING_TEMPLATES,
			DEFAULT_PLACEHOLDERS: DEFAULT_PLACEHOLDERS,
			EDITOR_FORM_SELECTOR: EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR: EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR: EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR: EDITOR_MINOR_EDIT_SELECTOR,
			SYNC_FORM_SELECTOR: SYNC_FORM_SELECTOR,
			EDITOR_FORM_HTML: EDITOR_FORM_HTML
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
		var initStringFormFields = function(form, mode) {
			var STRING_SELECTOR = '.listing-charinsert';
			$(STRING_SELECTOR, form).on( 'click', function() {
				var target = $(this).attr('data-for');
				var fieldInput = $('#'+target);
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
		var initFindOnMapLink = function(form, mode) {
			var latlngStr = '?lang=' + Config.LANG;
			//*****
			// page & location cause the geomap-link crash
			// to investigate if it's a geomap-link bug/limitation or if those parameters shall not be used
			//*****
			//latlngStr += '&page=' + encodeURIComponent(mw.config.get('wgTitle'));
			/*if ($('#input-address', form).val() !== '') {
				latlngStr += '&location=' + encodeURIComponent($('#input-address', form).val());
			} else if ($('#input-name', form).val() !== '') {
				latlngStr += '&location=' + encodeURIComponent($('#input-name', form).val());
			}
			$('#input-address', form).change( function () {
				var link = $('#geomap-link').attr('href');
				var index = link.indexOf('&location');
				if (index < 0) index = link.length;
				$('#geomap-link').attr('href', link.substr(0,index) + '&location='
						+ encodeURIComponent($('#input-address').val()));
			});*/
			// try to find and collect the best available coords
			if ( $('#input-lat', form).val() && $('#input-long', form).val() ) {
				// listing specific coords
				latlngStr += '&lat=' + Core.parseDMS($('#input-lat', form).val()) + '&lon=' + Core.parseDMS($('#input-long', form).val()) + '&zoom=15';
			} else if ( $('.mw-indicators .geo').lenght ) {
				// coords added by Template:Geo
				latlngStr += '&lat=' + Core.parseDMS($('.mw-indicators .geo .latitude').text()) + '&lon=' + Core.parseDMS($('.mw-indicators .geo .longitude').text()) + '&zoom=15';
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
					newLink = newLink + '&lat=' + coord.lat + '&lon=' + coord.lon;
					if (indexZoom < 0)
						newLink = newLink + '&zoom=15';
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
			coord.lat = Core.parseDMS(coord.lat);
			coord.lon = Core.parseDMS(coord.lon);
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
				'listingType': listingType,
				'form': form,
				url: mw.config.get('wgScriptPath') + '/api.php?' + $.param({
					action: 'parse',
					prop: 'text',
					contentmodel: 'wikitext',
					format: 'json',
					disablelimitreport: true,
					'text': '{{#invoke:TypeToColor|convert|'+listingType+'}}',
				}),
				beforeSend: function() {
					if (localStorage.getItem('listing-'+listingType)) {
						changeColor(localStorage.getItem('listing-'+listingType), form);
						return false;
					}
					else { return true; }
				},
				success: function (data) {
					var color = $(data.parse.text['*']).text().trim();
					localStorage.setItem('listing-'+listingType, color);
					changeColor(color, form);
				},
			});
		};
		var changeColor = function(color, form) {
			$('#input-type', form).css( 'box-shadow', '-20px 0 0 0 #' + color + ' inset' );
		};
		var initColor = function(form, mode) {
			typeToColor( $('#input-type', form).val(), form );
			$('#input-type', form).on('change', function () {
				typeToColor(this.value, form);
			});
		};
		CREATE_FORM_CALLBACKS.push(initColor);

		var isRTL = function (s){ // based on https://stackoverflow.com/questions/12006095/javascript-how-to-check-if-character-is-rtl
			var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF'+'\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
			rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
			rtlDirCheck = new RegExp('^[^'+ltrChars+']*['+rtlChars+']');
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
			for (var key in Config.DEFAULT_PLACEHOLDERS){
				$("#input-" + key,form).attr( 'placeholder', Config.DEFAULT_PLACEHOLDERS[key] );
			}
		};
		CREATE_FORM_CALLBACKS.push(setDefaultPlaceholders);

		var wikidataLookup = function(form, mode) {
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
				select: function(event, ui) {
					$("#input-wikidata-value").val(ui.item.id);
					wikidataLink("", ui.item.id);
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				var label = mw.html.escape(item.label) + " <small>" + mw.html.escape(item.id) + "</small>";
				if (item.description) {
					label += "<br /><small>" + mw.html.escape(item.description) + "</small>";
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
				form: form,
				ajaxData: {
					namespace: 0
				},
				updateLinkFunction: wikipediaLink
			};
			SisterSite.initializeSisterSiteAutocomplete(wikipediaSiteData);
			var commonsSiteData = {
				apiUrl: SisterSite.API_COMMONS,
				selector: $('#input-image', form),
				form: form,
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
				href: Config.WIKIPEDIA_URL + '/wiki/' + mw.util.wikiUrlencode(value),
				linkTitle: Config.TRANSLATIONS.viewWikipediaPage
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
				href: Config.COMMONS_URL + '/wiki/' + mw.util.wikiUrlencode('File:' + value),
				linkTitle: Config.TRANSLATIONS.viewCommonsPage
			};
			sisterSiteLinkDisplay(commonsSiteLinkData, form);
		};
		var sisterSiteLinkDisplay = function(siteLinkData, form) {
			var value = $(siteLinkData.inputSelector, form).val();
			var placeholderWD = $(siteLinkData.inputSelector, form).attr('placeholder');
			var placeholderDef = Config.DEFAULT_PLACEHOLDERS[siteLinkData.inputSelector.substring(7)]; //skip #input-
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
							res[key].latitude = Core.trimDecimal(res[key].latitude, 6);
							res[key].longitude = Core.trimDecimal(res[key].longitude, 6);
							msg += '\n' + Config.WIKIDATA_CLAIMS[key].label + ': ' + res[key].latitude + ' ' + res[key].longitude;
						}
						else if (key === 'iata') {
							msg += '\n' + Config.WIKIDATA_CLAIMS[key].label + ': ' + res[key];
							res[key] = PROJECT_CONFIG.iata( res[key] );
						}
						else if (key === 'email') {
							res[key] = res[key].replace('mailto:', '');
							msg += '\n' + Config.WIKIDATA_CLAIMS[key].label + ': ' + res[key];
						}
						else msg += '\n' + Config.WIKIDATA_CLAIMS[key].label + ': ' + res[key];
					}
				}
				var wikipedia = SisterSite.wikidataWikipedia(jsonObj, wikidataRecord);
				if (wikipedia) {
					msg += '\n' + Config.TRANSLATIONS.sharedWikipedia + ': ' + wikipedia;
				}

				if (msg) {
					if (confirm(Config.TRANSLATIONS.wikidataShared + '\n' + msg)) {
						for (key in res) {
							if (res[key]) {
								var editorField = [];
								for( var i = 0; i < Config.WIKIDATA_CLAIMS[key].fields.length; i++ ) { editorField[i] = '#'+Config.LISTING_TEMPLATES.listing[Config.WIKIDATA_CLAIMS[key].fields[i]].id; }

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
					alert(Config.TRANSLATIONS.wikidataSharedNotFound);
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
				var msg = '<form id="listing-editor-sync">' +
					Config.TRANSLATIONS.wikidataSyncBlurb +
					'<p>' +
					'<fieldset>' +
						'<span>' +
							'<span class="wikidata-update"></span>' +
							'<a href="javascript:" class="syncSelect" name="wd" title="' + Config.TRANSLATIONS.selectAll + '">Wikidata</a>' +
						'</span>' +
						'<a href="javascript:" id="autoSelect" class="listing-tooltip" title="' + Config.TRANSLATIONS.selectAlternatives + '">Auto</a>' +
						'<span>' +
							'<a href="javascript:" class="syncSelect" name="wv" title="' + Config.TRANSLATIONS.selectAll + '">Wikivoyage</a>' +
							'<span class="wikivoyage-update"></span>' +
						'</span>' +
					'</fieldset>' +
					'<div class="editor-fullwidth">';

				var res = {};
				for (var key in Config.WIKIDATA_CLAIMS) {
					res[key] = {};
					res[key].value = SisterSite.wikidataClaim(jsonObj, wikidataRecord, Config.WIKIDATA_CLAIMS[key].p);
					res[key].guidObj = SisterSite.wikidataClaim(jsonObj, wikidataRecord, Config.WIKIDATA_CLAIMS[key].p, true);
					if (key === 'iata') {
						if( res[key].value ) {
							res[key].value = PROJECT_CONFIG.iata( res[key].value );
						}
						msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
					}
					else if (key === 'email') {
						if( res[key].value ) { res[key].value = res[key].value.replace('mailto:', ''); }
						msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
					}
					else if (key === 'coords') {
						if ( res[key].value ) {
							res[key].value.latitude = Core.trimDecimal(res[key].value.latitude, 6); 
							res[key].value.longitude = Core.trimDecimal(res[key].value.longitude, 6);
							msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value.latitude, res[key].value.longitude], res[key].guidObj);
						}
						else { msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj); }
					}
					else msg += createRadio(Config.WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj);
				}
				var wikipedia = SisterSite.wikidataWikipedia(jsonObj, wikidataRecord);
				msg += createRadio({'label': Config.TRANSLATIONS.sharedWikipedia, 'fields': ['wikipedia'], 'doNotUpload': true, 'remotely_sync': true}, [wikipedia], $('#input-wikidata-value').val());

				msg += '</div><p><small><a href="javascript:" class="clear">' + Config.TRANSLATIONS.cancelAll + '</a></small>';
				msg += '</form>';

				// copied from dialog above. ideally should be global variable TODO
				var windowWidth = $(window).width();
				var dialogWidth = (windowWidth > Config.MAX_DIALOG_WIDTH) ? (0.85*Config.MAX_DIALOG_WIDTH) : 'auto';
				$(msg).dialog({
					title: Config.TRANSLATIONS.syncTitle,
					width: dialogWidth,
					dialogClass: 'listing-editor-dialog',

					buttons: [
						{
							text: Config.TRANSLATIONS.submit,
							click: submitFunction,
						},
						{
							text: Config.TRANSLATIONS.cancel, click: function() {
								$(this).dialog('close');
							}
						},
					],
					open: function() {
						$('#div_wikidata_update').hide();
						$('#wikidata-remove').hide();
						$('#input-wikidata-label').prop('disabled', true);
					},
					close: function() {
						$('#div_wikidata_update').show();
						$('#wikidata-remove').show();
						$('#input-wikidata-label').prop('disabled', false);
						document.getElementById("listing-editor-sync").outerHTML = ""; // delete the dialog. Direct DOM manipulation so the model gets updated. This is to avoid issues with subsequent dialogs no longer matching labels with inputs because IDs are already in use.
					}
				});
				if($(msg).find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
					submitFunction();
					$(Config.SYNC_FORM_SELECTOR).dialog('close');
					alert(Config.TRANSLATIONS.wikidataSharedMatch);
				}
				wikidataLink("", $("#input-wikidata-value").val()); // called to append the Wikidata link to the dialog title

				$('.clear').on( 'click',  function() {
					$(Config.SYNC_FORM_SELECTOR).find('input:radio:not([id]):enabled').prop('checked', true);
				});
				$('.syncSelect').on( 'click',  function() {
					var field = $(this).attr('name'); // wv or wd
					$(Config.SYNC_FORM_SELECTOR + ' input[type=radio]').prop('checked', false);
					$(Config.SYNC_FORM_SELECTOR + ' input[id$='+field+']').prop('checked', true);
				});
				$('#autoSelect').on( 'click',  function() { // auto select non-empty values
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
			for (j = 0; j < claimValue.length; j++) { if( claimValue[j] === null ) { claimValue[j] = ''; } }
			field.label = field.label.split(/(\s+)/)[0]; // take first word
			var html = '';
			var editorField = [];
			var remoteFlag = false;
			for ( var i = 0; i < field.fields.length; i++ ) { editorField[i] = '#'+Config.LISTING_TEMPLATES.listing[field.fields[i]].id; }
			// NOTE: this assumes a standard listing type. If ever a field in a nonstandard listing type is added to Wikidata sync, this must be changed

			for (j = 0; j < claimValue.length; j++) {
				// compare the present value to the Wikidata value
				if ( field.p === Config.WIKIDATA_CLAIMS.coords.p) {
				//If coords, then compared the values after trimming the WD one into decimal and converting into decimal and trimming the present one 
					if((Core.trimDecimal(Number(claimValue[j]), 6) != Core.trimDecimal(Core.parseDMS($(editorField[j]).val()), 6)) )
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
				//html += '<div><i>' + field.label + ' ' + Config.TRANSLATIONS.synchronized + '</i></div>';
				html += '<div class="choose-row" style="display:none">';
			}else { html += '<div class="sync_label">' + field.label + '</div><div class="choose-row">'; } // usual case, create heading
				html += '<div>' +
					'&nbsp;<label for="' + field.label + '-wd">';

			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += makeSyncLinks(claimValue, field.p, false);
			}
			for (j = 0; j < claimValue.length; j++) { html += claimValue[j] + '\n'; }
			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += '</a>';
			}

			html += '</label>' +
				'</div>' +
				'<div id="has-guid">' +
					'<input type="radio" id="' + field.label + '-wd" name="' + field.label + '"';
					if ( remoteFlag === true ) { html += 'checked' } html += '>' +
					'<input type="hidden" value="' + guid + '">' +
				'</div>';
				if ( remoteFlag === false ) { html +=
				'<div>' +
					'<input type="radio" name="' + field.label + '" checked>' +
				'</div>';
				}
				html += '<div id="has-json">';
					html += '<input type="radio" ';
					if ( (remoteFlag !== true) && (field.doNotUpload !== true) ) { html += 'id="' + field.label + '-wv" name="' + field.label + '"'; }
					else { html += 'disabled' }
					html += '><input type="hidden" value=\'' + JSON.stringify(field) + '\'>' +
				'</div>' +
				'<div>' +
					'&nbsp;<label for="' + field.label + '-wv">';

			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += makeSyncLinks(editorField, field.p, true);
			}
			for (i = 0; i < editorField.length; i++ ) { html += $(editorField[i]).val() + '\n'; }
			if ( [Config.WIKIDATA_CLAIMS.coords.p, Config.WIKIDATA_CLAIMS.url.p, Config.WIKIDATA_CLAIMS.image.p].indexOf(field.p) >= 0 ) {
				html += '</a>';
			}

			html += '</label></div></div>\n';
			return html;
		};

		var submitFunction = function() {
			$(Config.SYNC_FORM_SELECTOR).find('input[id]:radio:checked').each(function () {
				var label = $('label[for="'+ $(this).attr('id') +'"]');
				var syncedValue = label.text().split('\n');
				var field = JSON.parse($(this).parents('.choose-row').find('#has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
				var editorField = [];
				for( var i = 0; i < field.fields.length; i++ ) { editorField[i] = '#'+Config.LISTING_TEMPLATES.listing[field.fields[i]].id; }
				var guidObj = $(this).parents('.choose-row').find('#has-guid > input:hidden:not(:radio)').val();

				if ( field.p === Config.WIKIDATA_CLAIMS.coords.p ) { //first latitude, then longitude
					var DDValue = [];
					for ( i = 0; i < editorField.length; i++) {
						DDValue[i] = syncedValue[i] ? Core.trimDecimal(Core.parseDMS(syncedValue[i]), 6) : '';
						updateFieldIfNotNull(editorField[i], syncedValue[i], field.remotely_sync); 
					}
					// TODO: make the find on map link work for placeholder coords
					if( (DDValue[0]==='') && (DDValue[1]==='') ) {
							syncedValue = ''; // dummy empty value to removeFromWikidata
					} else if( !isNaN(DDValue[0]) && !isNaN(DDValue[1]) ){
						var precision = Math.min(DDValue[0].toString().replace(/\d/g, "0").replace(/$/, "1"), DDValue[1].toString().replace(/\d/g, "0").replace(/$/, "1"));
						syncedValue = '{ "latitude": ' + DDValue[0] + ', "longitude": ' + DDValue[1] + ', "precision": ' + precision + ' }';
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
						if( field.p === Config.WIKIDATA_CLAIMS.email.p ) { syncedValue = 'mailto:'+syncedValue; }
						syncedValue = '"'+syncedValue+'"';
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
					/*else*/ if ( jsonObj.entities[field.p].datatype === 'monolingualtext' ) { syncedValue = '{"text": ' + syncedValue + ', "language": "' + Config.LANG + '"}'; }
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

			$(this).dialog('close');
		};
		var makeSyncLinks = function(value, mode, valBool) {
			var htmlPart = '<a target="_blank" rel="noopener noreferrer"';
			var i;
			switch(mode) {
				case Config.WIKIDATA_CLAIMS.coords.p:
					htmlPart += 'href="https://geohack.toolforge.org/geohack.php?params=';
					for (i = 0; i < value.length; i++) { htmlPart += Core.parseDMS(valBool ? $(value[i]).val() : value[i]) + ';'; }
					htmlPart += '_type:landmark">'; // sets the default zoom
					break;
				case Config.WIKIDATA_CLAIMS.url.p:
					htmlPart += 'href="';
					for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
					htmlPart += '">';
					break;
				case Config.WIKIDATA_CLAIMS.image.p:
					htmlPart += 'href="https://'+ Config.LANG +'.wikivoyage.org/wiki/File:';
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
					label: label,
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
				href: Config.WIKIDATA_URL + '/wiki/' + mw.util.wikiUrlencode(value),
				title: Config.TRANSLATIONS.viewWikidataPage,
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
			if (month < 10) month = '0' + month;
			var day = d.getDate();
			if (day < 10) day = '0' + day;
			return year + '-' + month + '-' + day;
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
				validationFailureMessages.push(Config.TRANSLATIONS.validationEmptyListing);
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
			_validateFieldAgainstRegex(validationFailureMessages, VALID_EMAIL_REGEX, '#input-email', Config.TRANSLATIONS.validationEmail);
		};
		//VALIDATE_FORM_CALLBACKS.push(validateEmail);

		/**
		 * Implement SIMPLE validation on Wikipedia field to verify that the
		 * user is entering the article title and not a URL.
		 */
		var validateWikipedia = function(validationFailureMessages) {
			var VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_WIKIPEDIA_REGEX, '#input-wikipedia', Config.TRANSLATIONS.validationWikipedia);
		};
		VALIDATE_FORM_CALLBACKS.push(validateWikipedia);

		/**
		 * Implement SIMPLE validation on the Commons field to verify that the
		 * user has not included a "File" or "Image" namespace.
		 */
		var validateImage = function(validationFailureMessages) {
			var VALID_IMAGE_REGEX = new RegExp('^(?!(file|image|' + Config.TRANSLATIONS.image + '):)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_IMAGE_REGEX, '#input-image', Config.TRANSLATIONS.validationImage);
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
			CREATE_FORM_CALLBACKS: CREATE_FORM_CALLBACKS,
			SUBMIT_FORM_CALLBACKS: SUBMIT_FORM_CALLBACKS,
			VALIDATE_FORM_CALLBACKS: VALIDATE_FORM_CALLBACKS
		};
	}();

	var SisterSite = function() {
		var API_WIKIDATA = Config.WIKIDATA_URL+'/w/api.php';
		var API_WIKIPEDIA = Config.WIKIPEDIA_URL+'/w/api.php';
		var API_COMMONS = Config.COMMONS_URL+'/w/api.php';
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
					var valueWithoutFileNamespace = (titleResults[i].indexOf("File:") != -1) ? titleResults[i].substring("File:".length) : titleResults[i];
					var titleResult = { value: valueWithoutFileNamespace, label: titleResults[i], description: $(jsonObj[2])[i], link: $(jsonObj[3])[i] };
					results.push(titleResult);
				}
				return results;
			};
			_initializeAutocomplete(siteData, ajaxData, parseAjaxResponse);
		};
		var _initializeAutocomplete = function(siteData, ajaxData, parseAjaxResponse) {
			var autocompleteOptions = {
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
				snaktype: snaktype,
				value: value,
				format: 'json',
			};
			var ajaxSuccess = function(jsonObj) {
				//console.log(jsonObj);
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
			var ajaxSuccess = function(jsonObj) {
				//console.log(jsonObj);
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
		};
		var _changeOnWikidata = function(guidObj, prop, value, snaktype) {
			var ajaxData = {
				action: 'wbsetclaimvalue',
				claim: guidObj,
				snaktype: snaktype,
				value: value,
			};
			var ajaxSuccess = function(jsonObj) {
				//console.log(jsonObj);
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
			var revUrl = 'https:' + mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('$1', '') + mw.config.get('wgPageName') + '?oldid=' + mw.config.get('wgCurRevisionId'); // surprising that there is no API call for this
			var ajaxData = {
				action: 'wbsetreference',
				statement: jsonObj.claim.id,
				snaks: '{"'+WIKIDATA_PROP_WMURL+'":[{"snaktype":"value","property":"'+WIKIDATA_PROP_WMURL+'","datavalue":{"type":"wikibase-entityid","value":{"entity-type":"item","numeric-id":"' + Config.WIKIDATAID + '"}}}],' +
					'"'+WIKIDATA_PROP_WMPRJ+'": [{"snaktype":"value","property":"'+WIKIDATA_PROP_WMPRJ+'","datavalue":{"type":"string","value":"' + revUrl + '"}}]}',
			};
			var ajaxSuccess = function(jsonObj) {
				//console.log(jsonObj);
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
		};
		var _unreferenceWikidata = function(statement, references) {
			var ajaxData = {
				action: 'wbremovereferences',
				statement: statement,
				references: references,
			};
			var ajaxSuccess = function(jsonObj) {
				//console.log(jsonObj);
			};
			var api = new mw.ForeignApi( SisterSite.API_WIKIDATA );
			api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
		};
		// expose public members
		return {
			API_WIKIDATA: API_WIKIDATA,
			API_WIKIPEDIA: API_WIKIPEDIA,
			API_COMMONS: API_COMMONS,
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
	var Core = function() {
		var api = new mw.Api();
		var MODE_ADD = 'add';
		var MODE_EDIT = 'edit';
		// selector that identifies the edit link as created by the
		// addEditButtons() function
		var EDIT_LINK_SELECTOR = '.vcard-edit-button';
		var SAVE_FORM_SELECTOR = '#progress-dialog';
		var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
		var sectionText, inlineListing, replacements = {};
		var NATL_CURRENCY_SELECTOR = '#span_natl_currency';
		var NATL_CURRENCY = [];
		var CC_SELECTOR = '.input-cc'; // Country calling code
		var CC = '';
		var LC = '';

		/**
		 * Generate the form UI for the listing editor. If editing an existing
		 * listing, pre-populate the form input fields with the existing values.
		 */
		var createForm = function(mode, listingParameters, listingTemplateAsMap) {
			var form = $(Config.EDITOR_FORM_HTML);
			// make sure the select dropdown includes any custom "type" values
			var listingType = listingTemplateAsMap[Config.LISTING_TYPE_PARAMETER];
			if (isCustomListingType(listingType)) {
				$('#' + listingParameters[Config.LISTING_TYPE_PARAMETER].id, form).append( $( '<option></option>').attr( {value: listingType }).text( listingType ) );
			}
			// populate the empty form with existing values
			for (var parameter in listingParameters) {
				var parameterInfo = listingParameters[parameter];
				if (listingTemplateAsMap[parameter]) {
					$('#' + parameterInfo.id, form).val(listingTemplateAsMap[parameter]);
				} else if (parameterInfo.hideDivIfEmpty) {
					$('#' + parameterInfo.hideDivIfEmpty, form).hide();
				}
			}
			// Adding national currency symbols
			var natlCurrency = $(NATL_CURRENCY_SELECTOR, form);
			if (NATL_CURRENCY.length > 0) {
				for (i = 0; i < NATL_CURRENCY.length; i++) {
					natlCurrency.append('<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">' + NATL_CURRENCY[i] + '</a></span>');
				}
				natlCurrency.append(' |');
			} else natlCurrency.hide();
			// Adding country calling code
			var phones = $(CC_SELECTOR, form);
			if (CC !== '' || LC !== '') {
				phones.each( function() {
					i = $(this).attr('data-for');
					if (CC !== '')
						$(this).append( '<span class="listing-charinsert" data-for="'+ i +'"><a href="javascript:">' + CC + ' </a></span>' );
					if (LC !== '')
						$(this).append( '<span class="listing-charinsert" data-for="'+ i +'"><a href="javascript:">' + LC + ' </a></span>' );
				});
			} else phones.hide();
			for (var i=0; i < Callbacks.CREATE_FORM_CALLBACKS.length; i++) {
				Callbacks.CREATE_FORM_CALLBACKS[i](form, mode);
			}
			return form;
		};

		/**
		 * Determine whether a listing entry is within a paragraph rather than
		 * an entry in a list; inline listings will be formatted slightly
		 * differently than entries in lists (no newlines in the template syntax,
		 * skip empty fields).
		 */
		var isInline = function(entry) {
			// if the edit link clicked is within a paragraph AND, since
			// newlines in a listing description will cause the Mediawiki parser
			// to close an HTML list (thus triggering the "is edit link within a
			// paragraph" test condition), also verify that the listing is
			// within the expected listing template span tag and thus hasn't
			// been incorrectly split due to newlines.
			return (entry.closest('p').length !== 0 && entry.closest('span.vcard').length !== 0);
		};

		/**
		 * Given a DOM element, find the nearest editable section (h2 or h3) that
		 * it is contained within.
		 */
		var findSectionHeading = function(element) {
			return element.closest('div.mw-h3section, div.mw-h2section');
		};

		/**
		 * Given an editable heading, examine it to determine what section index
		 * the heading represents. First heading is 1, second is 2, etc.
		 */
		var findSectionIndex = function(heading) {
			if (heading === undefined) {
				return 0;
			}
			var link = heading.find('.mw-editsection a').attr('href');
			return (link !== undefined) ? link.split('=').pop() : 0;
		};

		/**
		 * Given an edit link that was clicked for a listing, determine what index
		 * that listing is within a section. First listing is 0, second is 1, etc.
		 */
		var findListingIndex = function(sectionHeading, clicked) {
			var count = 0;
			$(EDIT_LINK_SELECTOR, sectionHeading).each(function() {
				if (clicked.is($(this))) {
					return false;
				}
				count++;
			});
			return count;
		};

		/**
		 * Return the listing template type appropriate for the section that
		 * contains the provided DOM element (example: "see" for "See" sections,
		 * etc). If no matching type is found then the default listing template
		 * type is returned.
		 */
		var findListingTypeForSection = function(entry) {
			var sectionType = entry.closest('div.mw-h2section').children('h2').find('.mw-headline').attr('id');
			for (var sectionId in Config.SECTION_TO_TEMPLATE_TYPE) {
				if (sectionType == sectionId) {
					return Config.SECTION_TO_TEMPLATE_TYPE[sectionId];
				}
			}
			return Config.DEFAULT_LISTING_TEMPLATE;
		};

		var replaceSpecial = function(str) {
			return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
		};

		/**
		 * Return a regular expression that can be used to find all listing
		 * template invocations (as configured via the LISTING_TEMPLATES map)
		 * within a section of wikitext. Note that the returned regex simply
		 * matches the start of the template ("{{listing") and not the full
		 * template ("{{listing|key=value|...}}").
		 */
		var getListingTypesRegex = function() {
			var regex = [];
			for (var key in Config.LISTING_TEMPLATES) {
				regex.push(key);
			}
			return new RegExp('({{\\s*(' + regex.join('|') + ')\\b)(\\s*[\\|}])','ig');
		};

		/**
		 * Given a listing index, return the full wikitext for that listing
		 * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
		 * template invocation, 1 returns the second, etc.
		 */
		var getListingWikitextBraces = function(listingIndex) {
			sectionText = sectionText.replace(/[^\S\n]+/g,' ');
			// find the listing wikitext that matches the same index as the listing index
			var listingRegex = getListingTypesRegex();
			// look through all matches for "{{listing|see|do...}}" within the section
			// wikitext, returning the nth match, where 'n' is equal to the index of the
			// edit link that was clicked
			var listingSyntax, regexResult, listingMatchIndex;
			for (var i = 0; i <= listingIndex; i++) {
				regexResult = listingRegex.exec(sectionText);
				listingMatchIndex = regexResult.index;
				listingSyntax = regexResult[1];
			}
			// listings may contain nested templates, so step through all section
			// text after the matched text to find MATCHING closing braces
			// the first two braces are matched by the listing regex and already
			// captured in the listingSyntax variable
			var curlyBraceCount = 2;
			var endPos = sectionText.length;
			var startPos = listingMatchIndex + listingSyntax.length;
			var matchFound = false;
			for (var j = startPos; j < endPos; j++) {
				if (sectionText[j] === '{') {
					++curlyBraceCount;
				} else if (sectionText[j] === '}') {
					--curlyBraceCount;
				}
				if (curlyBraceCount === 0 && (j + 1) < endPos) {
					listingSyntax = sectionText.substring(listingMatchIndex, j + 1);
					matchFound = true;
					break;
				}
			}
			if (!matchFound) {
				listingSyntax = sectionText.substring(listingMatchIndex);
			}
			return $.trim(listingSyntax);
		};

		/**
		 * Convert raw wiki listing syntax into a mapping of key-value pairs
		 * corresponding to the listing template parameters.
		 */
		var wikiTextToListing = function(listingTemplateWikiSyntax) {
			var typeRegex = getListingTypesRegex();
			// convert "{{see" to {{listing|type=see"
			listingTemplateWikiSyntax = listingTemplateWikiSyntax.replace(typeRegex,'{{listing| ' + Config.LISTING_TYPE_PARAMETER + '=$2$3');
			// remove the trailing braces
			listingTemplateWikiSyntax = listingTemplateWikiSyntax.slice(0,-2);
			var listingTemplateAsMap = {};
			var lastKey;
			var listParams = listingTemplateToParamsArray(listingTemplateWikiSyntax);
			for (var j=1; j < listParams.length; j++) {
				var param = listParams[j];
				var index = param.indexOf('=');
				if (index > 0) {
					// param is of the form key=value
					var key = $.trim(param.substr(0, index));
					var value = $.trim(param.substr(index+1));
					listingTemplateAsMap[key] = value;
					lastKey = key;
				} else if (lastKey && listingTemplateAsMap[lastKey].length) {
					// there was a pipe character within a param value, such as
					// "key=value1|value2", so just append to the previous param
					listingTemplateAsMap[lastKey] += '|' + param;
				}
			}
			for (var loopKey1 in listingTemplateAsMap) {
				// if the template value contains an HTML comment that was
				// previously converted to a placehold then it needs to be
				// converted back to a comment so that the placeholder is not
				// displayed in the edit form
				listingTemplateAsMap[loopKey1] = restoreComments(listingTemplateAsMap[loopKey1], false);
			}
			if (listingTemplateAsMap[Config.LISTING_CONTENT_PARAMETER]) {
				// convert paragraph tags to newlines so that the content is more
				// readable in the editor window
				listingTemplateAsMap[Config.LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[Config.LISTING_CONTENT_PARAMETER].replace(/\s*<p>\s*/g, '\n\n');
				listingTemplateAsMap[Config.LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[Config.LISTING_CONTENT_PARAMETER].replace(/\s*<br\s*\/?>\s*/g, '\n');
			}
			// sanitize the listing type param to match the configured values, so
			// if the listing contained "Do" it will still match the configured "do"
			for (var loopKey2 in Config.LISTING_TEMPLATES) {
				if (listingTemplateAsMap[Config.LISTING_TYPE_PARAMETER].toLowerCase() === loopKey2.toLowerCase()) {
					listingTemplateAsMap[Config.LISTING_TYPE_PARAMETER] = loopKey2;
					break;
				}
			}
			return listingTemplateAsMap;
		};

		/**
		 * Split the raw template wikitext into an array of params. The pipe
		 * symbol delimits template params, but this method will also inspect the
		 * content to deal with nested templates or wikilinks that might contain
		 * pipe characters that should not be used as delimiters.
		 */
		var listingTemplateToParamsArray = function(listingTemplateWikiSyntax) {
			var results = [];
			var paramValue = '';
			var pos = 0;
			while (pos < listingTemplateWikiSyntax.length) {
				var remainingString = listingTemplateWikiSyntax.substr(pos);
				// check for a nested template or wikilink
				var patternMatch = findPatternMatch(remainingString, "{{", "}}");
				if (patternMatch.length === 0) {
					patternMatch = findPatternMatch(remainingString, "[[", "]]");
				}
				if (patternMatch.length > 0) {
					paramValue += patternMatch;
					pos += patternMatch.length;
				} else if (listingTemplateWikiSyntax.charAt(pos) === '|') {
					// delimiter - push the previous param and move on to the next
					results.push(paramValue);
					paramValue = '';
					pos++;
				} else {
					// append the character to the param value being built
					paramValue += listingTemplateWikiSyntax.charAt(pos);
					pos++;
				}
			}
			if (paramValue.length > 0) {
				// append the last param value
				results.push(paramValue);
			}
			return results;
		};

		/**
		 * Utility method for finding a matching end pattern for a specified start
		 * pattern, including nesting. The specified value must start with the
		 * start value, otherwise an empty string will be returned.
		 */
		var findPatternMatch = function(value, startPattern, endPattern) {
			var matchString = '';
			var startRegex = new RegExp('^' + replaceSpecial(startPattern), 'i');
			if (startRegex.test(value)) {
				var endRegex = new RegExp('^' + replaceSpecial(endPattern), 'i');
				var matchCount = 1;
				for (var i = startPattern.length; i < value.length; i++) {
					var remainingValue = value.substr(i);
					if (startRegex.test(remainingValue)) {
						matchCount++;
					} else if (endRegex.test(remainingValue)) {
						matchCount--;
					}
					if (matchCount === 0) {
						matchString = value.substr(0, i);
						break;
					}
				}
			}
			return matchString;
		};

		/**
		 * This method is invoked when an "add" or "edit" listing button is
		 * clicked and will execute an Ajax request to retrieve all of the raw wiki
		 * syntax contained within the specified section. This wiki text will
		 * later be modified via the listing editor and re-submitted as a section
		 * edit.
		 */
		var initListingEditorDialog = function(mode, clicked) {
			var listingType;
			if (mode === MODE_ADD) {
				listingType = findListingTypeForSection(clicked);
			}
			var sectionHeading = findSectionHeading(clicked);
			var sectionIndex = findSectionIndex(sectionHeading);
			var listingIndex = (mode === MODE_ADD) ? -1 : findListingIndex(sectionHeading, clicked);
			inlineListing = (mode === MODE_EDIT && isInline(clicked));

			NATL_CURRENCY = [];
			var dataSel = $( '.countryData' ).attr('data-currency');
			if ((dataSel !== undefined) && (dataSel !== '')) {
				NATL_CURRENCY = dataSel.split( ',' ).map( function( item ) {
					return item.trim();
				});
			}
			CC = '';
			dataSel = $( '.countryData' ).attr('data-country-calling-code');
			if ((dataSel !== undefined) && (dataSel !== '')) CC = dataSel;
			LC = '';
			dataSel = $( '.countryData' ).attr('data-local-dialing-code');
			if ((dataSel !== undefined) && (dataSel !== '')) LC = dataSel;

			$.ajax({
				url: mw.util.wikiScript(''),
				data: { title: mw.config.get('wgPageName'), action: 'raw', section: sectionIndex },
				cache: false // required
			}).done(function(data, textStatus, jqXHR) {
				sectionText = data;
				openListingEditorDialog(mode, sectionIndex, listingIndex, listingType);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(Config.TRANSLATIONS.ajaxInitFailure + ': ' + textStatus + ' ' + errorThrown);
			});
		};

		/**
		 * This method is called asynchronously after the initListingEditorDialog()
		 * method has retrieved the existing wiki section content that the
		 * listing is being added to (and that contains the listing wiki syntax
		 * when editing).
		 */
		var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType) {
			sectionText = stripComments(sectionText);
			mw.loader.using( ['jquery.ui'], function () {
				var listingTemplateAsMap, listingTemplateWikiSyntax;
				if (mode == MODE_ADD) {
					listingTemplateAsMap = {};
					listingTemplateAsMap[Config.LISTING_TYPE_PARAMETER] = listingType;
				} else {
					listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
					listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
					listingType = listingTemplateAsMap[Config.LISTING_TYPE_PARAMETER];
				}
				var listingParameters = getListingInfo(listingType);
				// if a listing editor dialog is already open, get rid of it
				if ($(Config.EDITOR_FORM_SELECTOR).length > 0) {
					$(Config.EDITOR_FORM_SELECTOR).dialog('destroy').remove();
				}
				// if a sync editor dialog is already open, get rid of it
				if ($(Config.SYNC_FORM_SELECTOR).length > 0) {
					$(Config.SYNC_FORM_SELECTOR).dialog('destroy').remove();
				}
				var form = $(createForm(mode, listingParameters, listingTemplateAsMap));
				// wide dialogs on huge screens look terrible
				var windowWidth = $(window).width();
				var dialogWidth = (windowWidth > Config.MAX_DIALOG_WIDTH) ? Config.MAX_DIALOG_WIDTH : 'auto';
				// modal form - must submit or cancel
				form.dialog({
					modal: true,
					height: 'auto',
					width: dialogWidth,
					title: (mode == MODE_ADD) ? Config.TRANSLATIONS.addTitle : Config.TRANSLATIONS.editTitle,
					dialogClass: 'listing-editor-dialog',
					buttons: [
					{
						text: '?',
						id: 'listing-help',
						click: function() { window.open(Config.TRANSLATIONS.helpPage);}
					},
					{
						text: Config.TRANSLATIONS.submit, click: function() {
							if ($(Config.EDITOR_CLOSED_SELECTOR).is(':checked')) {
								// no need to validate the form upon deletion request
								formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
								$(this).dialog('close');
								// if a sync editor dialog is open, get rid of it
								if ($(Config.SYNC_FORM_SELECTOR).length > 0) {
									$(Config.SYNC_FORM_SELECTOR).dialog('close');
								}
							}
							else if (validateForm()) {
								formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
								$(this).dialog('close');
								// if a sync editor dialog is open, get rid of it
								if ($(Config.SYNC_FORM_SELECTOR).length > 0) {
									$(Config.SYNC_FORM_SELECTOR).dialog('close');
								}
							}
						}
					},
					{
						text: Config.TRANSLATIONS.preview,
						title: Config.TRANSLATIONS.preview,
						id: 'listing-preview-button',
						click: function() {
							formToPreview(listingTemplateAsMap);
						}
					},
					{
						text: Config.TRANSLATIONS.previewOff,
						title: Config.TRANSLATIONS.previewOff,
						id: 'listing-previewOff',
						style: 'display: none',
						click: function() {
							hidePreview();
						}
					},
					{
						text: Config.TRANSLATIONS.refresh,
						title: Config.TRANSLATIONS.refreshTitle,
						icon: 'ui-icon-refresh',
						id: 'listing-refresh',
						style: 'display: none',
						click: function() {
							refreshPreview(listingTemplateAsMap);
						}
					},
					{
						text: Config.TRANSLATIONS.cancel,
						click: function() {
							$(this).dialog('destroy').remove();
							// if a sync editor dialog is open, get rid of it
							if ($(Config.SYNC_FORM_SELECTOR).length > 0) {
								$(Config.SYNC_FORM_SELECTOR).dialog('destroy').remove();
							}
						}
					}
					],
					create: function() {
						$('.ui-dialog-buttonpane').append('<div class="listing-license">' + Config.TRANSLATIONS.licenseText + '</div>');
						$('body').on('dialogclose', Config.EDITOR_FORM_SELECTOR, function(event) { //if closed with X buttons
							// if a sync editor dialog is open, get rid of it
							if ($(Config.SYNC_FORM_SELECTOR).length > 0) {
								$(Config.SYNC_FORM_SELECTOR).dialog('destroy').remove();
							}
						});
					}
				});
			});
		};

		/**
		 * Commented-out listings can result in the wrong listing being edited, so
		 * strip out any comments and replace them with placeholders that can be
		 * restored prior to saving changes.
		 */
		var stripComments = function(text) {
			var comments = text.match(/<!--[\s\S]*?-->/mig);
			if (comments !== null ) {
				for (var i = 0; i < comments.length; i++) {
					var comment = comments[i];
					var rep = '<<<COMMENT' + i + '>>>';
					text = text.replace(comment, rep);
					replacements[rep] = comment;
				}
			}
			return text;
		};

		/**
		 * Search the text provided, and if it contains any text that was
		 * previously stripped out for replacement purposes, restore it.
		 */
		var restoreComments = function(text, resetReplacements) {
			for (var key in replacements) {
				var val = replacements[key];
				text = text.replace(key, val);
			}
			if (resetReplacements) {
				replacements = {};
			}
			return text;
		};

		/**
		 * Given a listing type, return the appropriate entry from the
		 * LISTING_TEMPLATES array. This method returns the entry for the default
		 * listing template type if not enty exists for the specified type.
		 */
		var getListingInfo = function(type) {
			return (isCustomListingType(type)) ? Config.LISTING_TEMPLATES[Config.DEFAULT_LISTING_TEMPLATE] : Config.LISTING_TEMPLATES[type];
		};

		/**
		 * Determine if the specified listing type is a custom type - for example "go"
		 * instead of "see", "do", "listing", etc.
		 */
		var isCustomListingType = function(listingType) {
			return !(listingType in Config.LISTING_TEMPLATES);
		};

		/**
		 * Logic invoked on form submit to analyze the values entered into the
		 * editor form and to block submission if any fatal errors are found.
		 */
		var validateForm = function() {
			var validationFailureMessages = [];
			for (var i=0; i < Callbacks.VALIDATE_FORM_CALLBACKS.length; i++) {
				Callbacks.VALIDATE_FORM_CALLBACKS[i](validationFailureMessages);
			}
			if (validationFailureMessages.length > 0) {
				alert(validationFailureMessages.join('\n'));
				return false;
			}
			// newlines in listing content won't render properly in lists, so replace them with <br> tags
			$('#input-content').val($.trim($('#input-content').val()).replace(/\n/g, '<br />'));
			// add trailing period in content. Note: replace(/(?<!\.)$/, '.') is not supported by IE
			// Trailing period shall not be added if one of the following char is present: ".", "!" or "?"
			if ( $('#input-content').val() ) {
				$('#input-content').val(($.trim($('#input-content').val())+'.').replace(/([\.\!\?])\.+$/, '$1'));
			}

			// remove trailing period from price and address block
			$('#input-price').val($.trim($('#input-price').val()).replace(/\.$/, ''));
			$('#input-address').val($.trim($('#input-address').val()).replace(/\.$/, ''));
			// in case of decimal format, decimal digits will be limited to 6
			if ( $.isNumeric($('#input-lat').val()) ) {
				$('#input-lat').val(Core.trimDecimal(Number($('#input-lat').val()),6));
			}
			if ( $.isNumeric($('#input-long').val()) ) {
				$('#input-long').val(Core.trimDecimal(Number($('#input-long').val()),6));
			}

			var webRegex = new RegExp('^https?://', 'i');
			var url = $('#input-url').val();
			if (!webRegex.test(url) && url !== '') {
				$('#input-url').val('http://' + url);
			}
			return true;
		};

		/**
		 * Convert the listing editor form entry fields into wiki text. This
		 * method converts the form entry fields into a listing template string,
		 * replaces the original template string in the section text with the
		 * updated entry, and then submits the section text to be saved on the
		 * server.
		 */
		var formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
			var listing = listingTemplateAsMap;
			var defaultListingParameters = getListingInfo(Config.DEFAULT_LISTING_TEMPLATE);
			var listingTypeInput = defaultListingParameters[Config.LISTING_TYPE_PARAMETER].id;
			var listingType = $("#" + listingTypeInput).val();
			var listingParameters = getListingInfo(listingType);
			for (var parameter in listingParameters) {
				listing[parameter] = $("#" + listingParameters[parameter].id).val();
			}
			for (var i=0; i < Callbacks.SUBMIT_FORM_CALLBACKS.length; i++) {
				Callbacks.SUBMIT_FORM_CALLBACKS[i](listing, mode);
			}
			var text = listingToStr(listing);
			var summary = editSummarySection();
			if (mode == MODE_ADD) {
				summary = updateSectionTextWithAddedListing(summary, text, listing);
			} else {
				summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
			}
			summary += $("#input-name").val();
			if ($(Config.EDITOR_SUMMARY_SELECTOR).val() !== '') {
				summary += ' - ' + $(Config.EDITOR_SUMMARY_SELECTOR).val();
			}
			var minor = $(Config.EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;
			saveForm(summary, minor, sectionNumber, '', '');
			return;
		};

		var showPreview = function(listingTemplateAsMap) {
			var listing = listingTemplateAsMap;
			var defaultListingParameters = getListingInfo(Config.DEFAULT_LISTING_TEMPLATE);
			var listingTypeInput = defaultListingParameters[Config.LISTING_TYPE_PARAMETER].id;
			var listingType = $("#" + listingTypeInput).val();
			var listingParameters = getListingInfo(listingType);
			for (var parameter in listingParameters) {
				listing[parameter] = $("#" + listingParameters[parameter].id).val();
			}
			var text = listingToStr(listing);

			$.ajax ({
				url: mw.config.get('wgScriptPath') + '/api.php?' + $.param({
					action: 'parse',
					prop: 'text',
					contentmodel: 'wikitext',
					format: 'json',
					'text': text,
				}),
				error: function (jqXHR, txt) {
					$('#listing-preview').hide();
				},
				success: function (data) {
					$('#listing-preview-text').html(data.parse.text['*']);
				},
			});
		};

		var formToPreview = function(listingTemplateAsMap) {
			if ( !$('#listing-preview').is(':visible') ) {
				$('#listing-preview').show();
				$('#listing-refresh').show();
				$('#listing-preview-button').hide();
				$('#listing-previewOff').show();
				showPreview(listingTemplateAsMap);
			} else {
				$('#listing-preview').hide();
				$('#listing-refresh').hide();
				$('#listing-previewOff').hide();
				$('#listing-preview-button').show();
			}
		};

		var refreshPreview = function(listingTemplateAsMap) {
			if ( $('#listing-preview').is(':visible') ) {
				showPreview(listingTemplateAsMap);
			}
		};

		var hidePreview = function() {
			$('#listing-preview').hide();
			$('#listing-previewOff').hide();
			$('#listing-refresh').hide();
			$('#listing-preview-button').show();
		};

		/**
		 * Begin building the edit summary by trying to find the section name.
		 */
		var editSummarySection = function() {
			var sectionName = getSectionName();
			return (sectionName.length) ? '/* ' + sectionName + ' */ ' : "";
		};

		var getSectionName = function() {
			var HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
			var result = HEADING_REGEX.exec(sectionText);
			return (result !== null) ? result[1].trim() : "";
		};

		/**
		 * After the listing has been converted to a string, add additional
		 * processing required for adds (as opposed to edits), returning an
		 * appropriate edit summary string.
		 */
		var updateSectionTextWithAddedListingDefault = function(originalEditSummary, listingWikiText, listing) {
			var summary = originalEditSummary;
			summary += Config.TRANSLATIONS.added;
			// add the new listing to the end of the section. if there are
			// sub-sections, add it prior to the start of the sub-sections.
			var index = sectionText.indexOf('===');
			if (index === 0) {
				index = sectionText.indexOf('====');
			}
			if (index > 0) {
				sectionText = sectionText.substr(0, index) + '* ' + listingWikiText
						+ '\n' + sectionText.substr(index);
			} else {
				sectionText += '\n'+ '* ' + listingWikiText;
			}
			sectionText = restoreComments(sectionText, true);
			return summary;
		};

		var updateSectionTextWithAddedListingIt = function (originalEditSummary, listingWikiText, listing) {
			sectionText = restoreComments(sectionText, true);
			summary += Config.TRANSLATIONS.added;
			//Creo un listing commentato dello stesso tipo di quello che aggiungerò.
			//Se nella sezione in cui andrò a scrivere troverò questo listing commentato, lo rimpiazzerò col nuovo.
			var commentedListing = "<!--* {{" + listing[Config.LISTING_TYPE_PARAMETER]+ "\n| nome= | alt= | sito= | email=\n| indirizzo= | lat= | long= | indicazioni=\n| tel= | numero verde= | fax=\n|";
			if (listing[Config.LISTING_TYPE_PARAMETER] !== 'sleep') {
				commentedListing += " orari= | prezzo=\n";
			} else {
				commentedListing += " checkin= | checkout= | prezzo=\n";
			}
			commentedListing += "| descrizione=\n}}-->\n";
			var index = 0;
			var index1 = sectionText.indexOf('===');
			var index2 = sectionText.indexOf('<!--===');
			var index3 = sectionText.indexOf('====');
			var index4 = sectionText.indexOf('=== ' + Config.TRANSLATIONS.budget + ' ===');
			var index5 = sectionText.indexOf('<!--=== ' + Config.TRANSLATIONS.midrange + ' ===-->');
			var index6 = sectionText.indexOf('=== ' + Config.TRANSLATIONS.splurge + ' ===');
			var index7 = sectionText.indexOf('<!--=== ' + Config.TRANSLATIONS.splurge + ' ===');
			var splurgeOffset = 0;
			if (index7 > 0) {
				splurgeOffset = 4;
			}
			if ( (index1 === 0) && (index2 === 0) ) {
				index = index3;
			} else if (index1 === 0) {
				index = index2;
			} else if (index2 === 0) {
				index = index1;
			} else if (index1 < index2) {
				index = index1;
			} else if (index6 > 0) {
				index = index6;
			} else {
				index = index2;
			}
			if (index > 0) {
				var strApp = sectionText.substr(0, index).replace(/(\r\n|\n|\r)/gm," ").trim();
				if (strApp.substring(strApp.length-5) == '{{-}}') {
					var indexApp = sectionText.lastIndexOf('{{-}}');
					sectionText = sectionText.substr(0, indexApp).replace(commentedListing,'') + '* ' + listingWikiText + '\n{{-}}' + sectionText.substr(indexApp+5);
				} else {
					if( (index4 > 0) && (index6 > 0) ) {
						//Mi assicuro di essere in Dove mangiare/dormire (le uniche divise per fascia di prezzo)
						if ( index5 > 0) {
							//Il primo elemento viene aggiunto nella sottosezione "Prezzi medi" (rimuovendone il commento)
							sectionText = sectionText.substr(0, index6-splurgeOffset).replace('<!--=== ' + Config.TRANSLATIONS.midrange + ' ===-->\n' + commentedListing,'=== ' + Config.TRANSLATIONS.midrange + ' ===\n') + '* ' + listingWikiText + '\n\n' + sectionText.substr(index6-splurgeOffset);
						} else {
							//I successivi elementi vengono accodati nella sottosezione "Prezzi medi" (già priva di commento)
							sectionText = sectionText.substr(0, index6-splurgeOffset).replace(/\n+$/,'\n') + '* ' + listingWikiText + '\n\n' + sectionText.substr(index6-splurgeOffset);
						}
					} else {
						var addbr = '';
						if( sectionText.substr(index-2, 1).charCodeAt(0) != 10 )
							addbr = '\n';
						sectionText = sectionText.substr(0, index-1).replace(commentedListing,'') + addbr + '* ' + listingWikiText + '\n' + sectionText.substr(index-1);
					}
				}
			} else {
				var strApp2 = sectionText.replace(/(\r\n|\n|\r)/gm," ").trim();
				if (strApp2.substring(strApp2.length-5) == '{{-}}') {
					var indexApp2 = sectionText.lastIndexOf('{{-}}');
					sectionText = sectionText.substr(0, indexApp2).replace(commentedListing,'') + '* ' + listingWikiText + '\n{{-}}';
				} else {
					sectionText = sectionText.replace(commentedListing,'') + '\n'+ '* ' +listingWikiText;
				}
			}
			return summary;
		};

		var updateSectionTextWithAddedListing = function (originalEditSummary, listingWikiText, listing) {
			switch ( DB_NAME ) {
				case 'itwikivoyage':
					return updateSectionTextWithAddedListingIt(originalEditSummary, listingWikiText, listing);
				default:
					return updateSectionTextWithAddedListingDefault(originalEditSummary, listingWikiText, listing);
			}
		};

		/**
		 * After the listing has been converted to a string, add additional
		 * processing required for edits (as opposed to adds), returning an
		 * appropriate edit summary string.
		 */
		var updateSectionTextWithEditedListing = function(editSummary, listingWikiText, listingTemplateWikiSyntax) {
			// escaping '$&' since in replace regex it means "substitute the whole content"
			listingWikiText = listingWikiText.replace( /\$&/g, '&#36;&');
			if ($(Config.EDITOR_CLOSED_SELECTOR).is(':checked')) {
				listingWikiText = '';
				editSummary += Config.TRANSLATIONS.removed;
				// TODO: RegEx change to delete the complete row when listing is preceeded by templates showing just icons
				var listRegex = new RegExp('(\\n+[\\:\\*\\#]*)?\\s*' + replaceSpecial(listingTemplateWikiSyntax));
				sectionText = sectionText.replace(listRegex, listingWikiText);
			} else {
				editSummary += Config.TRANSLATIONS.updated;
				sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
			}
			sectionText = restoreComments(sectionText, true);
			sectionText = sectionText.replace( /&#36;/g, '$' ); // '&#36;'->'$' restore on global sectionText var
			return editSummary;
		};

		/**
		 * Render a dialog that notifies the user that the listing editor changes
		 * are being saved.
		 */
		var savingForm = function() {
			// if a progress dialog is already open, get rid of it
			if ($(SAVE_FORM_SELECTOR).length > 0) {
				$(SAVE_FORM_SELECTOR).dialog('destroy').remove();
			}
			var progress = $('<div id="progress-dialog">' + Config.TRANSLATIONS.saving + '</div>');
			progress.dialog({
				modal: true,
				height: 100,
				width: 300,
				title: ''
			});
			$(".ui-dialog-titlebar").hide();
		};

		/**
		 * Execute the logic to post listing editor changes to the server so that
		 * they are saved. After saving the page is refreshed to show the updated
		 * article.
		 */
		var saveForm = function(summary, minor, sectionNumber, cid, answer) {
			var editPayload = {
				action: "edit",
				title: mw.config.get( "wgPageName" ),
				section: sectionNumber,
				text: sectionText,
				summary: summary,
				captchaid: cid,
				captchaword: answer
			};
			if (minor) {
				$.extend( editPayload, { minor: 'true' } );
			}
			api.postWithToken(
				"csrf",
				editPayload
			).done(function(data, jqXHR) {
				if (data && data.edit && data.edit.result == 'Success') {
					// since the listing editor can be used on diff pages, redirect
					// to the canonical URL if it is different from the current URL
					var canonicalUrl = $("link[rel='canonical']").attr("href");
					var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
					if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
						var sectionName = mw.util.escapeIdForLink(getSectionName());
						if (sectionName.length) {
							canonicalUrl += "#" + sectionName;
						}
						window.location.href = canonicalUrl;
					} else {
						window.location.reload();
					}
				} else if (data && data.error) {
					saveFailed(Config.TRANSLATIONS.submitApiError + ' "' + data.error.code + '": ' + data.error.info );
				} else if (data && data.edit.spamblacklist) {
					saveFailed(Config.TRANSLATIONS.submitBlacklistError + ': ' + data.edit.spamblacklist );
				} else if (data && data.edit.captcha) {
					$(SAVE_FORM_SELECTOR).dialog('destroy').remove();
					captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id);
				} else {
					saveFailed(Config.TRANSLATIONS.submitUnknownError);
				}
			}).fail(function(code, result) {
				if (code === "http") {
					saveFailed(Config.TRANSLATIONS.submitHttpError + ': ' + result.textStatus );
				} else if (code === "ok-but-empty") {
					saveFailed(Config.TRANSLATIONS.submitEmptyError);
				} else {
					saveFailed(Config.TRANSLATIONS.submitUnknownError + ': ' + code );
				}
			});
			savingForm();
		};

		/**
		 * If an error occurs while saving the form, remove the "saving" dialog,
		 * restore the original listing editor form (with all user content), and
		 * display an alert with a failure message.
		 */
		var saveFailed = function(msg) {
			$(SAVE_FORM_SELECTOR).dialog('destroy').remove();
			$(Config.EDITOR_FORM_SELECTOR).dialog('open');
			alert(msg);
		};

		/**
		 * If the result of an attempt to save the listing editor content is a
		 * Captcha challenge then display a form to allow the user to respond to
		 * the challenge and resubmit.
		 */
		var captchaDialog = function(summary, minor, sectionNumber, captchaImgSrc, captchaId) {
			// if a captcha dialog is already open, get rid of it
			if ($(CAPTCHA_FORM_SELECTOR).length > 0) {
				$(CAPTCHA_FORM_SELECTOR).dialog('destroy').remove();
			}
			var captcha = $('<div id="captcha-dialog">').text(Config.TRANSLATIONS.externalLinks);
			var image = $('<img class="fancycaptcha-image">')
					.attr('src', captchaImgSrc)
					.appendTo(captcha);
			var label = $('<label for="input-captcha">').text(Config.TRANSLATIONS.enterCaptcha).appendTo(captcha);
			var input = $('<input id="input-captcha" type="text">').appendTo(captcha);
			captcha.dialog({
				modal: true,
				title: Config.TRANSLATIONS.enterCaptcha,
				buttons: [
					{
						text: Config.TRANSLATIONS.submit, click: function() {
							saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val());
							$(this).dialog('destroy').remove();
						}
					},
					{
						text: Config.TRANSLATIONS.cancel, click: function() {
							$(this).dialog('destroy').remove();
						}
					}
				]
			});
		};

		/**
		 * Convert the listing map back to a wiki text string.
		 */
		var listingToStr = function(listing) {
			var listingType = listing[Config.LISTING_TYPE_PARAMETER];
			var listingParameters = getListingInfo(listingType);
			var saveStr = '{{';
			if( isCustomListingType(listingType) ) { // type parameter specified explicitly only on custom type
				saveStr += Config.DEFAULT_LISTING_TEMPLATE;
				saveStr += ' | ' + Config.LISTING_TYPE_PARAMETER + '=' + listingType;
			} else {
				saveStr += listingType;
			}
			if (!inlineListing && listingParameters[Config.LISTING_TYPE_PARAMETER].newline) {
				saveStr += '\n';
			}
			for (var parameter in listingParameters) {
				if (parameter === Config.LISTING_TYPE_PARAMETER) {
					// "type" parameter was handled previously
					continue;
				}
				if (parameter === Config.LISTING_CONTENT_PARAMETER) {
					// processed last
					continue;
				}
				if (listing[parameter] !== '' || (!listingParameters[parameter].skipIfEmpty && !inlineListing)) {
					saveStr += '| ' + parameter + '=' + listing[parameter];
				}
				if (!saveStr.match(/\n$/)) {
					if (!inlineListing && listingParameters[parameter].newline) {
						saveStr = rtrim(saveStr) + '\n';
					} else if (!saveStr.match(/ $/)) {
						saveStr += ' ';
					}
				}
			}
			if (Config.ALLOW_UNRECOGNIZED_PARAMETERS) {
				// append any unexpected values
				for (var key in listing) {
					if (listingParameters[key]) {
						// this is a known field
						continue;
					}
					if (listing[key] === '') {
						// skip unrecognized fields without values
						continue;
					}
					saveStr += '| ' + key + '=' + listing[key];
					saveStr += (inlineListing) ? ' ' : '\n';
				}
			}
			saveStr += '| ' + Config.LISTING_CONTENT_PARAMETER + '=' + listing[Config.LISTING_CONTENT_PARAMETER];
			saveStr += (inlineListing || !listingParameters[Config.LISTING_CONTENT_PARAMETER].newline) ? ' ' : '\n';
			saveStr += '}}';
			return saveStr;
		};

		/**
		 * Trim whitespace at the end of a string.
		 */
		var rtrim = function(str) {
			return str.replace(/\s+$/, '');
		};

		/**
		 * Trim decimal precision if it exceeds the specified number of
		 * decimal places.
		 */
		var trimDecimal = function(value, precision) {
			if ($.isNumeric(value) && value.toString().length > value.toFixed(precision).toString().length) {
				value = value.toFixed(precision);
			}
			return value;
		};

		/**
		 * Parse coordinates in DMS notation, to convert it into DD notation in Wikidata format (i.e. without "°" symbol).
		 * If the input is already in DD notation, input value is returned unchanged.
		 * Notes:
		 * 1) Common notation is use as a proforma for potential future use because the split currently works to be more flexible skipping any char that is not a number, a minus, a dot or a cardinal point
		 * 2) Missing parts are forced to be empty to use a common approach, altough M & S could be also "0" in fact North America coords 48°N 100°W are equivalent to 48° 0' 0" N, 100° 0' 0" W,
		 *    but for compatibility with the DD notation where there is no alternative way to write it (i.e. 48° -100°), so the following parts are just empty, not 0
		 * 3) The parsed parts could have also erroneous data if the input is badly formatted (e.g. 48°EE'00"N 100°00'4000""W"), but these checks will be performed inside convertDMS2DD
		 */
		var parseDMS = function(input) {
			// Uniform alternative notation, into one common notation DD° MM' SS" [NSEW], then the DMS components are splitted into its 4 atomic component
			var parts = input.toString().replace(/[‘’′]/g, "'").replace(/[“”″]/g, '"').replace(/''/g, '"').replace(/−/g, '-').replace(/[_/\t\n\r]/g, " ").replace(/\s/g, '').replace(/([°'"])/g,"$1 ").replace(/([NSEW])/gi, function(v) { return ' '+v.toUpperCase(); }).replace(/(^ [NSEW])(.*)/g,"$2$1").split(/[^\d\w\.-]+/);
			for (var i=0; i<4; i++)
				if( !parts[i] )
					parts[i] = '';
			return convertDMS2DD( parts[0], parts[1], parts[2], parts[3] );
		};
		
		/**
		 * Convert splitted elements of coordinates in DMS notation into DD notation.
		 * If the input is already in DD notation (i.e. only degrees is a number), input value is returned unchanged.
		 * Notes:
		 * 1) Each D, M & S is checked to be a valid number plus M & S are checked to be in a valid range. If one parameter is not valid, NaN (Not a Number) is returned
		 * 2) Empty string (provided from initial parsing section in parseDMS) are considered valid by isNaN function (i.e. isNaN('') is false)
		 */
		var convertDMS2DD = function(degrees, minutes, seconds, direction) {
			var dd = NaN;
			if( isNaN(degrees) )
				return NaN;
			else {
				degrees = Number(degrees);
				if( degrees <= -180 || degrees > 180 )
					return NaN;
				else
					dd = degrees;
			}
			if( isNaN(minutes) )
				return NaN;
			else {
				degrees = Number(minutes);
				if( minutes < 0 || minutes >= 60 )
					return NaN;
				else
					dd = dd + minutes/60;
			}
			if( isNaN(seconds) )
				return NaN;
			else {
				degrees = Number(seconds);
				if( seconds < 0 || seconds >= 60 )
					return NaN;
				else
					dd = dd + seconds/(3600);
			}
			if (direction == "S" || direction == "W") {
				dd = dd * -1;
			} // Don't do anything for N or E
			return dd;
		};

		// expose public members
		return {
			initListingEditorDialog: initListingEditorDialog,
			MODE_ADD: MODE_ADD,
			MODE_EDIT: MODE_EDIT,
			trimDecimal: trimDecimal,
			parseDMS: parseDMS
		};
	}();

	return Core;

} );

//</nowiki>
