/******************************************************************
   Listing Editor v2.1
     Original author:
     - torty3
     Additional contributors:
     - Andyrom75
     - Wrh2
     v2.1 Changes:
     - Wikidata & Wikipedia fields added.
     - The Wikidata, image, and Wikipedia fields will now autocomplete, with
       lookups done by searching the relevant site.
     - Latitude, longitude, official link, wikipedia link, and image can be
       populated with the values stored at Wikidata by clicking on the "Update
       shared fields using values from Wikidata" link.
     - The "image" field is now shown by default.
     - Several cleanups to the underlying code.
     v2.0 Changes:
     - Update the listing editor dialog UI to provide more space for field
       entry, and to responsively collapse from two columns to one on small
       screens.
     - Use mw.Api().postWithToken instead of $.ajax to hopefully fix session
       token expiration issues.
     - Add support for editing of multi-paragraph listings.
     - Do not delete non-empty unrecognized listing template values (wikipedia,
       phoneextra, etc) when editing if the ALLOW_UNRECOGNIZED_PARAMETERS flag
       is set to true.
     - If listing editor form submit fails, re-display the listing editor form
       with the content entered by the user so that work is not lost.
     - Replace synchronous $.ajax call with asynchronous.
     - Allow edit summaries and marking edits as minor when editing listings.
     - Move 'add listing' link within the mw-editsection block.
     - Automatically replace newlines in listing content with <p> tags.
     - Fix bug where HTML comments inside listing fields prevented editing.
     - Provide configuration options so that some fields can be displayed only
       if they have non-empty values (examples: "fax" in the default
       configuration).
     - Add basic email address validation.
     - A failed captcha challenge no longer causes further captcha attempts to
       fail.
     - Significant code reorganization.
     TODO
     - Do not perform listing validations when deleting a listing.
     - Add support for mobile devices.
     - Add support for non-standard listing "type" values ("go", etc).
     - wrapContent is breaking the expand/collapse logic on the VFD page.
     - populate the input-type select list from LISTING_TEMPLATES
********************************************************************/
//<nowiki>

( function ( mw, $ ) {
	'use strict';
	// only run on supported skins
	// (on mobile this breaks section collapsing)
	if ( mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}

	/* ***********************************************************************
	 * CUSTOMIZATION INSTRUCTIONS:
	 *
	 * Different Wikivoyage language versions have different implementations of
	 * the listing template, so this module must be customized for each.  The
	 * ListingEditor.Config and ListingEditor.Callbacks modules should be the
	 * ONLY code that requires customization - ListingEditor.Core should be
	 * shared across all language versions.  If for some reason the Core module
	 * must be modified, ideally the module should be modified for all language
	 * versions so that the code can stay in sync.
	 * ***********************************************************************/

	var ListingEditor = {};

	// see http://toddmotto.com/mastering-the-module-pattern/ for an overview
	// of the module design pattern being used in this gadget

	/* ***********************************************************************
	 * ListingEditor.Config contains properties that will likely need to be
	 * modified for each Wikivoyage language version.  Properties in this
	 * module will be referenced from the other ListingEditor modules.
	 * ***********************************************************************/
	ListingEditor.Config = function() {

		// --------------------------------------------------------------------
		// TRANSLATE THE FOLLOWING BASED ON THE WIKIVOYAGE LANGUAGE IN USE
		// --------------------------------------------------------------------

		var LANG = 'fr';
		var COMMONS_URL = '//commons.wikimedia.org';
		var WIKIDATA_URL = '//www.wikidata.org';
		var WIKIPEDIA_URL = '//fr.wikipedia.org';
		var WIKIDATA_SITELINK_WIKIPEDIA = 'frwiki';
		var TRANSLATIONS = {
			'addTitle' : 'ajouter un titre',
			'editTitle' : 'Éditer un élément de listing existant',
			'add': 'ajouter un élément de listing',
			'edit': 'éditer',
			'saving': 'Enregistrer...',
			'submit': 'Soumettre',
			'cancel': 'Annuler',
			'validationEmptyListing': 'Entrez au moins un nom ou une adresse',
			'validationEmail': "Controler que l'adresse électronique soit correcte",
			'validationWikipedia': "Veuillez insérer le titre de la page Wikipédia seulement; Pas l'adresse URL complète",
			'validationImage': "Veuillez insérer le titre de l'image de Commons sans préfixe",
			'image': 'Fichier', //Préfixe local pour Image (ou File)
			'added': 'Listing ajouté pour ',
			'updated': 'Listing mis à jour: ',
			'removed': 'Listing effacé ',
			'helpPage': '//fr.wikivoyage.org/wiki/Aide:Éditeur_de_Listing',
			'enterCaptcha': 'Entrez le CAPTCHA',
			'externalLinks': 'Votre contribution inclus des liens externes.',
			// license text should match MediaWiki:Wikimedia-copyrightwarning
			'licenseText': 'En cliquant sur "Soumettre", vous acceptez les <a class="external" target="_blank" href="http://wikimediafoundation.org/wiki/Terms_of_use">conditions d\u0027utilisation</a>, et vous acceptez irrévocablement de placer votre contribution dans le cadre de la <a class="external" target="_blank" href="http://en.wikivoyage.org/wiki/Wikivoyage:Full_text_of_the_Attribution-ShareAlike_3.0_license">License CC-BY-SA 3.0</a>.',
			'ajaxInitFailure': "Erreur: Impossible d'initialiser l'éditeur de listing",
			'sharedImage': 'image',
			'sharedLatitude': 'latitude',
			'sharedLongitude': 'longitude',
			'sharedWebsite': 'site',
			'sharedWikipedia': 'wikipédia',
			'submitApiError': "Erreur: Le serveur a renvoyé une erreur lors de la tentative d'enregistrement de la liste. Veuillez réessayer.",
			'submitBlacklistError': "Erreur: Une valeur dans les données soumises a été mise en liste noire, s'il vous plaît supprimer le modèle en liste noire et essayez à nouveau",
			'submitUnknownError': "Erreur: Une erreur inconnue a été rencontrée lors de la tentative d'enregistrement de la liste. Veuillez réessayer.",
			'submitHttpError': "Erreur: Le serveur a répondu avec une erreur HTTP en essayant d'enregistrer le listing. Veuillez réessayer",
			'submitEmptyError': "Erreur: Le serveur a renvoyé une réponse vide lors de la tentative d'enregistrement du listing. Veuillez réessayer",
			'viewCommonsPage' : 'voir la page Commons',
			'viewWikidataPage' : "voir l'élément Wikidata",
			'viewWikipediaPage' : 'voir la page Wikipédia',
			'wikidataShared': "Les données suivantes ont été trouvées dans l'élément Wikidata. Mettre à jour les champs en utilisant ces valeurs?",
			'wikidataSharedNotFound': "Pas de données partagées dans l'élément Wikidata"
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
		var ALLOW_UNRECOGNIZED_PARAMETERS = true;

		// --------------------------------------------------------------------
		// UPDATE THE FOLLOWING TO MATCH WIKIVOYAGE ARTICLE SECTION NAMES
		// --------------------------------------------------------------------

		// map section heading ID to the listing template to use for that section
		var SECTION_TO_TEMPLATE_TYPE = {
			'Aller':'Aller',
			'Circuler':'Circuler',
			'Voir':'Voir', 
			'Faire':'Faire', 
			'Acheter':'Acheter', 
			'Manger':'Manger', 
			'Communiquer':'Listing', 
			'Boire_un_verre_.2F_Sortir':'Sortir', 
			'Sortir':'Sortir', 
			'Se_loger':'Se loger', 
			'S.C3.A9curit.C3.A9':'Listing',
			'G.C3.A9rer_le_quotidien':'Représentation diplomatique', 
			'Villes':'Ville', 
			'Autres_destinations':'Destination', 
			'Aux_environs':'Destination'
		};
		// If any of these patterns are present on a page then no 'add listing'
		// buttons will be added to the page
		var DISALLOW_ADD_LISTING_IF_PRESENT = ['#R\u00E9gions', '#\u00EEles'];

		// --------------------------------------------------------------------
		// CONFIGURE THE FOLLOWING TO MATCH THE LISTING TEMPLATE PARAMS & OUTPUT
		// --------------------------------------------------------------------

		// name of the generic listing template to use when a more specific
		// template ("see", "do", etc) is not appropriate
		var DEFAULT_LISTING_TEMPLATE = 'Listing';
		var LISTING_TYPE_PARAMETER = 'type';
		var LISTING_CONTENT_PARAMETER = 'description';
		// selector that identifies the HTML elements into which the 'edit' link
		// for each listing will be placed
		var EDIT_LINK_CONTAINER_SELECTOR = 'span.listing-metadata-items';
		// The arrays below must include entries for each listing template
		// parameter in use for each Wikivoyage language version - for example
		// "name", "address", "phone", etc.  If all listing template types use
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
		//   - id: HTML input ID in the EDITOR_FORM_HTML for this element.
		//   - hideDivIfEmpty: id of a <div> in the EDITOR_FORM_HTML for this
		//     element that should be hidden if the corresponding template
		//     parameter has no value. For example, the "fax" field is
		//     little-used and is not shown by default in the editor form if it
		//     does not already have a value.
		//   - skipIfEmpty: Do not include the parameter in the wiki template
		//     syntax that is saved to the article if the parameter has no
		//     value. For example, the "image" tag is not included by default
		//     in the listing template syntax unless it has a value.
		//   - newline: Append a newline after the parameter in the listing
		//     template syntax when the article is saved.
		var LISTING_TEMPLATE_PARAMETERS = {
			'type': { id:'input-type', hideDivIfEmpty: 'div_type', newline: true },
			'nom': { id:'input-name' },
			'lien nom': { id:'input-internallink', hideDivIfEmpty: 'div_internallink', skipIfEmpty: true },
			'alt': { id:'input-alt' },
			'url': { id:'input-url' },
			'wikipédia': { id:'input-wikipedia', skipIfEmpty: true },
			'wikidata': { id:'input-wikidata-value', newline: true, skipIfEmpty: true },
			'email': { id:'input-email', newline: true },
			'adresse': { id:'input-address' },
			'latitude': { id:'input-lat' },
			'longitude': { id:'input-long' },
			'direction': { id:'input-directions', newline: true },
			'téléphone': { id:'input-phone' },
			'fax': { id:'input-fax', hideDivIfEmpty: 'div_fax', newline: true },
			'horaire': { id:'input-hours' },
			'arrivée': { id:'input-checkin', hideDivIfEmpty: 'div_checkin', skipIfEmpty: true },
			'départ': { id:'input-checkout', hideDivIfEmpty: 'div_checkout', skipIfEmpty: true },
			'prix': { id:'input-price', newline: true },
			'image': { id:'input-image', skipIfEmpty: true },
			'mise à jour': { id:'input-lastedit', newline: true, skipIfEmpty: true },
			'description': { id:'input-content', newline: true }
		};
		// override the default settings for "sleep" listings since that
		// listing type uses "checkin"/"checkout" instead of "hours"
		var SLEEP_TEMPLATE_PARAMETERS = $.extend(true, {}, LISTING_TEMPLATE_PARAMETERS, {
			'horaire': { hideDivIfEmpty: null, skipIfEmpty: false },
			'arrivée': { hideDivIfEmpty: null, skipIfEmpty: false },
			'départ': { hideDivIfEmpty: null, skipIfEmpty: false }
		});
		// override the default settings for "city" and "destination" listings since that
		// listing type uses other parameters
		var CITY_TEMPLATE_PARAMETERS = $.extend(true, {}, LISTING_TEMPLATE_PARAMETERS, {
			'type': { id:'input-type', hideDivIfEmpty: 'div_type', newline: true },
			'nom': { id:'input-name' },
			'lien nom': { id:'input-internallink', hideDivIfEmpty: null, skipIfEmpty: false },
			'alt': { id:'input-alt' },
			'url': { id:'input-url' },
			'email': { hideDivIfEmpty: 'div_email', skipIfEmpty: true },
			'adresse': { hideDivIfEmpty: 'div_address', skipIfEmpty: true },
			'latitude': { id:'input-lat' },
			'longitude': { id:'input-long' },
			'direction': { id:'input-directions', newline: true },
			'téléphone': { hideDivIfEmpty: 'div_phone', skipIfEmpty: true },
			'fax': { hideDivIfEmpty: 'div_fax', skipIfEmpty: true },
			'horaire': { hideDivIfEmpty: 'div_hours', skipIfEmpty: true },
			'arrivée': { id:'input-checkin', hideDivIfEmpty: 'div_checkin', skipIfEmpty: true },
			'départ': { id:'input-checkout', hideDivIfEmpty: 'div_checkout', skipIfEmpty: true },
			'prix': { hideDivIfEmpty: 'div_price', skipIfEmpty: true },
			'wikipédia': { id:'input-wikipedia', skipIfEmpty: true },
			'image': { id:'input-image', skipIfEmpty: true },
			'wikidata': { id:'input-wikidata-value', newline: true, skipIfEmpty: true },
			'mise à jour': { hideDivIfEmpty: null, skipIfEmpty: true },
			'description': { id:'input-content', newline: true }
		});
		// map the template name to configuration information needed by the listing
		// editor
		var LISTING_TEMPLATES = {
			'Listing': LISTING_TEMPLATE_PARAMETERS,
			'Voir': LISTING_TEMPLATE_PARAMETERS,
			'Faire': LISTING_TEMPLATE_PARAMETERS,
			'Acheter': LISTING_TEMPLATE_PARAMETERS,
			'Manger': LISTING_TEMPLATE_PARAMETERS,
			'Sortir': LISTING_TEMPLATE_PARAMETERS,
			'Se loger': SLEEP_TEMPLATE_PARAMETERS,
			'Aller': LISTING_TEMPLATE_PARAMETERS,
			'Circuler': LISTING_TEMPLATE_PARAMETERS,
			'Représentation diplomatique': LISTING_TEMPLATE_PARAMETERS, 
			'Ville': CITY_TEMPLATE_PARAMETERS, 
			'Destination': CITY_TEMPLATE_PARAMETERS
		};

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
		// the below HTML is the UI that will be loaded into the listing editor
		// dialog box when a listing is added or edited.  EACH WIKIVOYAGE
		// LANGUAGE SITE CAN CUSTOMIZE THIS HTML - fields can be removed,
		// added, displayed differently, etc.  Note that it is important that
		// any changes to the HTML structure are also made to the
		// LISTING_TEMPLATES parameter arrays since that array provides the
		// mapping between the editor HTML and the listing template fields.
		var EDITOR_FORM_HTML = '<form id="listing-editor">' +
			'<div class="listing-col listing-span_1_of_2">' +
				'<table class="editor-fullwidth">' +
				'<tr id="div_name">' +
					'<td class="editor-label-col"><label for="input-name">Nom</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="nom du lieu" id="input-name"></td>' +
				'</tr>' +
				'<tr id="div_internallink">' +
					'<td class="editor-label-col"><label for="input-internallink">Lien</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="nom de la page sur Wikivoyage" id="input-internallink"></td>' +
				'</tr>' +
				'<tr id="div_alt">' +
					'<td class="editor-label-col"><label for="input-alt">Nom alternatif</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="aussi connu sous le nom..." id="input-alt"></td>' +
				'</tr>' +
				'<tr id="div_url">' +
					'<td class="editor-label-col"><label for="input-url">Site web<span class="wikidata-update"></span></label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="http://www.exemple.com" id="input-url"></td>' +
				'</tr>' +
				'<tr id="div_address">' +
					'<td class="editor-label-col"><label for="input-address">Adresse</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="adresse du lieu" id="input-address"></td>' +
				'</tr>' +
				'<tr id="div_directions">' +
					'<td class="editor-label-col"><label for="input-directions">Directions</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="comment y aller..." id="input-directions"></td>' +
				'</tr>' +
				'<tr id="div_phone">' +
					'<td class="editor-label-col"><label for="input-phone">Téléphone</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="+55 555 555-5555" id="input-phone"></td>' +
				'</tr>' +
				'<tr id="div_fax">' +
					'<td class="editor-label-col"><label for="input-fax">Fax</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="+55 555 555-555" id="input-fax"></td>' +
				'</tr>' +
				'<tr id="div_email">' +
					'<td class="editor-label-col"><label for="input-email">Email</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="hello@exemple.com" id="input-email"></td>' +
				'</tr>' +
				'<tr id="div_lastedit" style="display: none;">' +
					'<td class="editor-label-col"><label for="input-lastedit">Mise \u00E0 jour</label></td>' +
					'<td><input type="text" size="10" placeholder="2017-01-15" id="input-lastedit"></td>' +
				'</tr>' +
				'<tr id="div_wikidata_update" style="display: none">' +
					'<td class="editor-label-col">&#160;</td>' +
					'<td><span class="wikidata-update"></span><a href="javascript:" id="wikidata-shared">Mise \u00E0 jour par les donn\u00E9es provenant de Wikidata</a></td>' +
				'</tr>' +
				'</table>' +
			'</div>' +
			'<div class="listing-col listing-span_1_of_2">' +
				'<table class="editor-fullwidth">' +
				'<tr id="div_type">' +
					'<td class="editor-label-col"><label for="input-type">Type</label></td>' +
					'<td>' +
						'<select id="input-type" placeholder="type of listing">' +
							'<option value="Listing">Listing</option>' +
							'<option value="Aller">Aller</option>' +
							'<option value="Circuler">Circuler</option>' +
							'<option value="Voir">Voir</option>' +
							'<option value="Faire">Faire</option>' +
							'<option value="Acheter">Acheter</option>' +
							'<option value="Manger">Manger</option>' +
							'<option value="Sortir">Sortir</option>' +
							'<option value="Se loger">Se loger</option>' +
							'<option value="Représentation diplomatique">Représentation diplomatique</option>' +
							'<option value="Ville">Ville</option>' +
							'<option value="Destination">Destination</option>' +
						'</select>' +
					'</td>' +
				'</tr>' +
				'<tr id="div_lat">' +
					'<td class="editor-label-col"><label for="input-lat">Latitude<span class="wikidata-update"></span></label></td>' +
					'<td><input type="text" class="editor-partialwidth" placeholder="11.11111" id="input-lat">' +
					// update the ListingEditor.Callbacks.initFindOnMapLink
					// method if this field is removed or modified
					'&nbsp;<a id="geomap-link" target="_blank" href="http://maps.wikivoyage-ev.org/w/geomap.php">localisé sur la carte</a></td>' +
				'</tr>' +
				'<tr id="div_long">' +
					'<td class="editor-label-col"><label for="input-long">Longitude<span class="wikidata-update"></span></label></td>' +
					'<td><input type="text" class="editor-partialwidth" placeholder="111.11111" id="input-long"></td>' +
				'</tr>' +
				'<tr id="div_hours">' +
					'<td class="editor-label-col"><label for="input-hours">Horaire</label></td>' +
					'<td>' +
						// update the ListingEditor.Callbacks.initCurrencySymbolFormFields
						// method if the currency symbols are removed or modified
						'<input type="text" class="editor-partialwidth" placeholder="heures d\u0027ouverture" id="input-hours">' +
						'<span id="span_hours">' +
							'<span class="hours-template"> <a href="javascript:">{{Horaire|jour1|jour2|h1|min1|h2|min2|h3|min3|h4|min4}}</a></span>' +
						'</span>' +
					'</td>' +
				'<tr id="div_checkin">' +
					'<td class="editor-label-col"><label for="input-checkin">Arriv\u00E9e</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="heure d\u0027arriv\u00E9e" id="input-checkin"></td>' +
				'</tr>' +
				'<tr id="div_checkout">' +
					'<td class="editor-label-col"><label for="input-checkout">D\u00E9part</label></td>' +
					'<td><input type="text" class="editor-fullwidth" placeholder="heure de d\u00E9part" id="input-checkout"></td>' +
				'</tr>' +
				'<tr id="div_price">' +
					'<td class="editor-label-col"><label for="input-price">Prix</label></td>' +
					'<td>' +
						// update the ListingEditor.Callbacks.initCurrencySymbolFormFields
						// method if the currency symbols are removed or modified
						'<input type="text" class="editor-partialwidth" placeholder="prix d\u0027entrée ou du service" id="input-price">' +
						'<span id="span_currency">' +
							'<span class="currency-signs"> <a href="javascript:">{{Prix||}}</a></span>' +
							'<span class="currency-signs"> <a href="javascript:">\{{Prix||£}}</a></span>' +
							'<span class="currency-signs"> <a href="javascript:">{{Prix||€}}</a></span>' +
							'<span class="currency-signs"> <a href="javascript:">{{Prix||¥}}</a></span>' +
							'<span class="currency-signs"> <a href="javascript:">{{Prix||$}}</a></span>' +
						'</span>' +
					'</td>' +
				'</tr>' +
				'<tr id="div_wikidata">' +
					'<td class="editor-label-col"><label for="input-wikidata-label">Wikidata</label></td>' +
					'<td>' +
						'<input type="text" class="editor-partialwidth" placeholder="\u00E9l\u00E9ment wikidata" id="input-wikidata-label">' +
						'<input type="hidden" id="input-wikidata-value">' +
						'<span id="wikidata-value-display-container" style="display:none">' +
							'<small>' +
							'&#160;<span id="wikidata-value-link"></span>' +
							'&#160;|&#160;<a href="javascript:" id="wikidata-remove" title="Supprimer l\u0027entr\u00E9e Wikidata">\u00E9ffacer</a>' +
							'</small>' +
						'</span>' +
					'</td>' +
				'</tr>' +
				'<tr id="div_wikipedia">' +
					'<td class="editor-label-col"><label for="input-wikipedia">Wikip\u00E9dia<span class="wikidata-update"></span></label></td>' +
					'<td>' +
						'<input type="text" class="editor-partialwidth" placeholder="nom de l\u0027article sur wikip\u00E9dia" id="input-wikipedia">' +
						'<span id="wikipedia-value-display-container" style="display:none">' +
							'<small>' +
							'&#160;<span id="wikipedia-value-link"></span>' +
							'</small>' +
						'</span>' +
					'</td>' +
				'</tr>' +
				'<tr id="div_image">' +
					'<td class="editor-label-col"><label for="input-image">Image<span class="wikidata-update"></span></label></td>' +
					'<td>' +
						'<input type="text" class="editor-partialwidth" placeholder="image du lieu" id="input-image">' +
						'<span id="image-value-display-container" style="display:none">' +
							'<small>' +
							'&#160;<span id="image-value-link"></span>' +
							'</small>' +
						'</span>' +
					'</td>' +
				'</tr>' +
				'</table>' +
			'</div>' +
			'<table class="editor-fullwidth">' +
			'<tr id="div_content">' +
				'<td class="editor-label-col"><label for="input-content">Description</label></td>' +
				'<td><textarea rows="8" class="editor-fullwidth" placeholder="description du lieu" id="input-content"></textarea></td>' +
			'</tr>' +
			// update the ListingEditor.Callbacks.hideEditOnlyFields method if
			// the status row is removed or modified
			'<tr id="div_status">' +
				'<td class="editor-label-col"><label>Statut</label></td>' +
				'<td>' +
					'<span id="span-closed">' +
						'<input type="checkbox" id="input-closed">' +
						'<label for="input-closed" class="listing-tooltip" title="Cochez la case si l\u0027entreprise a cessé ses activités ou si l\u0027élément devrait être effacé pour une autre raison. Il sera effacé de cet article.">Effacer cet élément?</label>' +
					'</span>' +
					// update the ListingEditor.Callbacks.updateLastEditDate
					// method if the last edit input is removed or modified
					'<span id="span-last-edit">' +
						'<input type="checkbox" id="input-last-edit" />' +
						'<label for="input-last-edit" class="listing-tooltip" title="Cochez la case si les informations de cette liste ont été vérifiées comme étant à jour et exactes. La date de dernière mise à jour sera modifiée à la date actuelle">Marquer l\u0027élément comme étant à jour?</label>' +
					'</span>' +
				'</td>' +
			'</tr>' +
			'</table>' +
			// update the ListingEditor.Callbacks.hideEditOnlyFields method if
			// the summary table is removed or modified
			'<table class="editor-fullwidth" id="div_summary">' +
			'<tr><td colspan="2"><div class="listing-divider" /></td></tr>' +
			'<tr>' +
				'<td class="editor-label-col"><label for="input-summary">Résumé des modifications</label></td>' +
				'<td>' +
					'<input type="text" class="editor-partialwidth" placeholder="raisons des modifications" id="input-summary">' +
					'<span id="span-minor"><input type="checkbox" id="input-minor"><label for="input-minor" class="listing-tooltip" title="Cochez la case si la modification apportée à l\u0027élément est mineure, par exemple une correction de typographie">changement mineur?</label></span>' +
				'</td>' +
			'</tr>' +
			'</table>' +
			'</form>';

		// expose public members
		return {
			LANG: LANG,
			COMMONS_URL: COMMONS_URL,
			WIKIDATA_URL: WIKIDATA_URL,
			WIKIPEDIA_URL: WIKIPEDIA_URL,
			WIKIDATA_SITELINK_WIKIPEDIA: WIKIDATA_SITELINK_WIKIPEDIA,
			TRANSLATIONS: TRANSLATIONS,
			MAX_DIALOG_WIDTH: MAX_DIALOG_WIDTH,
			DISALLOW_ADD_LISTING_IF_PRESENT: DISALLOW_ADD_LISTING_IF_PRESENT,
			DEFAULT_LISTING_TEMPLATE: DEFAULT_LISTING_TEMPLATE,
			LISTING_TYPE_PARAMETER: LISTING_TYPE_PARAMETER,
			LISTING_CONTENT_PARAMETER: LISTING_CONTENT_PARAMETER,
			EDIT_LINK_CONTAINER_SELECTOR: EDIT_LINK_CONTAINER_SELECTOR,
			ALLOW_UNRECOGNIZED_PARAMETERS: ALLOW_UNRECOGNIZED_PARAMETERS,
			SECTION_TO_TEMPLATE_TYPE: SECTION_TO_TEMPLATE_TYPE,
			LISTING_TEMPLATES: LISTING_TEMPLATES,
			EDITOR_FORM_SELECTOR: EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR: EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR: EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR: EDITOR_MINOR_EDIT_SELECTOR,
			EDITOR_FORM_HTML: EDITOR_FORM_HTML
		};
	}();

	/* ***********************************************************************
	 * ListingEditor.Callbacks implements custom functionality that may be
	 * specific to how a Wikivoyage language version has implemented the
	 * listing template.  For example, English Wikivoyage uses a "last edit"
	 * date that needs to be populated when the listing editor form is
	 * submitted, and that is done via custom functionality implemented as a
	 * SUBMIT_FORM_CALLBACK function in this module.
	 * ***********************************************************************/
	ListingEditor.Callbacks = function() {
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
		 * Add listeners to the currency symbols so that clicking on a currency
		 * symbol will insert it into the price input.
		 */
		var initCurrencySymbolFormFields = function(form, mode) {
			var CURRENCY_SIGNS_SELECTOR = '.currency-signs';
			$(CURRENCY_SIGNS_SELECTOR, form).click(function() {
				var priceInput = $('#input-price');
				var caretPos = priceInput[0].selectionStart;
				var oldPrice = priceInput.val();
				var currencySymbol = $(this).find('a').text();
				var newPrice = oldPrice.substring(0, caretPos) + currencySymbol + oldPrice.substring(caretPos);
				priceInput.val(newPrice);
			});
		};
		CREATE_FORM_CALLBACKS.push(initCurrencySymbolFormFields);

		/**
		 * Add listeners to the hours field so that clicking on the template
		 * will insert it into the price input.
		 */
		var initHoursTemplateFormFields = function(form, mode) {
			var HOURS_SIGNS_SELECTOR = '.hours-template';
			$(HOURS_SIGNS_SELECTOR, form).click(function() {
				var hoursInput = $('#input-hours');
				var caretPos = hoursInput[0].selectionStart;
				var oldHours = hoursInput.val();
				var hoursTemptate = $(this).find('a').text();
				var newHours = oldHours.substring(0, caretPos) + hoursTemptate + oldHours.substring(caretPos);
				hoursInput.val(newHours);
			});
		};
		CREATE_FORM_CALLBACKS.push(initHoursTemplateFormFields);
		/**
		 * Add listeners on various fields to update the "find on map" link.
		 */
		var initFindOnMapLink = function(form, mode) {
			var latlngStr = '?lang=' + ListingEditor.Config.LANG;
			latlngStr += '&page=' + encodeURIComponent(mw.config.get('wgTitle'));
			// #geodata should be a hidden span added by Template:Geo
			// containing the lat/long coordinates of the destination
			if ($('#geodata').length) {
				var latlng = $('#geodata').text().split('; ');
				latlngStr += '&lat=' + latlng[0] + '&lon=' + latlng[1] + '&zoom=15';
			}
			if ($('#input-address', form).val() !== '') {
				latlngStr += '&location=' + encodeURIComponent($('#input-address', form).val());
			} else if ($('#input-name', form).val() !== '') {
				latlngStr += '&location=' + encodeURIComponent($('#input-name', form).val());
			}
			// #geomap-link is a link in the EDITOR_FORM_HTML
			$('#geomap-link', form).attr('href', $('#geomap-link', form).attr('href') + latlngStr);
			$('#input-address', form).change( function () {
				var link = $('#geomap-link').attr('href');
				var index = link.indexOf('&location');
				if (index < 0) index = link.length;
				$('#geomap-link').attr('href', link.substr(0,index) + '&location='
						+ encodeURIComponent($('#input-address').val()));
			});
		};
		CREATE_FORM_CALLBACKS.push(initFindOnMapLink);

		var hideEditOnlyFields = function(form, mode) {
			var EDITOR_STATUS_ROW = '#div_status';
			var EDITOR_SUMMARY_ROW = '#div_summary';
			if (mode !== ListingEditor.Core.MODE_EDIT) {
				$(EDITOR_STATUS_ROW, form).hide();
				$(EDITOR_SUMMARY_ROW, form).hide();
			}
		};
		CREATE_FORM_CALLBACKS.push(hideEditOnlyFields);

		var wikidataLookup = function(form, mode) {
			// get the display value for the pre-existing wikidata record ID
			var value = $("#input-wikidata-value", form).val();
			if (value) {
				wikidataLink(form, value);
				var ajaxUrl = ListingEditor.SisterSite.API_WIKIDATA;
				var ajaxData = {
					action: 'wbgetentities',
					ids: value,
					languages: ListingEditor.Config.LANG,
					props: 'labels'
				};
				var ajaxSuccess = function(jsonObj) {
					var value = $("#input-wikidata-value").val();
					var label = ListingEditor.SisterSite.wikidataLabel(jsonObj, value);
					if (label === null) {
						label = "";
					}
					$("#input-wikidata-label").val(label);
				};
				ListingEditor.SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
			}
			// set up autocomplete to search for results as the user types
			$('#input-wikidata-label', form).autocomplete({
				source: function( request, response ) {
					var ajaxUrl = ListingEditor.SisterSite.API_WIKIDATA;
					var ajaxData = {
						action: 'wbsearchentities',
						search: request.term,
						language: ListingEditor.Config.LANG
					};
					var ajaxSuccess = function (jsonObj) {
						response(parseWikiDataResult(jsonObj));
					};
					ListingEditor.SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
				},
				select: function(event, ui) {
					$("#input-wikidata-value").val(ui.item.id);
					wikidataLink("", ui.item.id);
				}
			}).data("ui-autocomplete")._renderItem = function(ul, item) {
				var label = item.label + " <small>" + item.id + "</small>";
				if (item.description) {
					label += "<br /><small>" + item.description + "</small>";
				}
				return $("<li>").data('ui-autocomplete-item', item).append($("<a>").html(label)).appendTo(ul);
			};
			// add a listener to the "remove" button so that links can be deleted
			$('#wikidata-remove', form).click(function() {
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
			$('#wikidata-shared', form).click(function() {
				var wikidataRecord = $("#input-wikidata-value", form).val();
				updateWikidataSharedFields(wikidataRecord);
			});
			var wikipediaSiteData = {
				apiUrl: ListingEditor.SisterSite.API_WIKIPEDIA,
				selector: $('#input-wikipedia', form),
				form: form,
				ajaxData: {
					namespace: 0
				},
				updateLinkFunction: wikipediaLink
			};
			ListingEditor.SisterSite.initializeSisterSiteAutocomplete(wikipediaSiteData);
			var commonsSiteData = {
				apiUrl: ListingEditor.SisterSite.API_COMMONS,
				selector: $('#input-image', form),
				form: form,
				ajaxData: {
					namespace: 6
				},
				updateLinkFunction: commonsLink
			};
			ListingEditor.SisterSite.initializeSisterSiteAutocomplete(commonsSiteData);
		};
		var wikipediaLink = function(value, form) {
			var wikipediaSiteLinkData = {
				inputSelector: '#input-wikipedia',
				containerSelector: '#wikipedia-value-display-container',
				linkContainerSelector: '#wikipedia-value-link',
				href: ListingEditor.Config.WIKIPEDIA_URL + '/wiki/' + mw.util.wikiUrlencode(value),
				linkTitle: ListingEditor.Config.TRANSLATIONS.viewWikipediaPage
			};
			sisterSiteLinkDisplay(wikipediaSiteLinkData, form);
		};
		var commonsLink = function(value, form) {
			var commonsSiteLinkData = {
				inputSelector: '#input-image',
				containerSelector: '#image-value-display-container',
				linkContainerSelector: '#image-value-link',
				href: ListingEditor.Config.COMMONS_URL + '/wiki/' + mw.util.wikiUrlencode('File:' + value),
				linkTitle: ListingEditor.Config.TRANSLATIONS.viewCommonsPage
			};
			sisterSiteLinkDisplay(commonsSiteLinkData, form);
		};
		var sisterSiteLinkDisplay = function(siteLinkData, form) {
			var value = $(siteLinkData.inputSelector, form).val();
			if (!value) {
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
		var updateFieldIfNotNull = function(selector, value) {
			if (value) {
				$(selector).val(value);
			}
		};
		var updateWikidataSharedFields = function(wikidataRecord) {
			var ajaxUrl = ListingEditor.SisterSite.API_WIKIDATA;
			var ajaxData = {
				action: 'wbgetentities',
				ids: wikidataRecord,
				languages: ListingEditor.Config.LANG
			};
			var ajaxSuccess = function (jsonObj) {
				var coords = ListingEditor.SisterSite.wikidataClaim(jsonObj, wikidataRecord, ListingEditor.SisterSite.WIKIDATA_CLAIM_COORD);
				var link = ListingEditor.SisterSite.wikidataClaim(jsonObj, wikidataRecord, ListingEditor.SisterSite.WIKIDATA_CLAIM_LINK);
				var image = ListingEditor.SisterSite.wikidataClaim(jsonObj, wikidataRecord, ListingEditor.SisterSite.WIKIDATA_CLAIM_IMAGE);
				var wikipedia = ListingEditor.SisterSite.wikidataWikipedia(jsonObj, wikidataRecord);
				var msg = '';
				if (coords) {
					// trim lat/long to six decimal places
					coords.latitude = ListingEditor.Core.trimDecimal(coords.latitude, 6);
					coords.longitude = ListingEditor.Core.trimDecimal(coords.longitude, 6);
					msg += '\n' + ListingEditor.Config.TRANSLATIONS.sharedLatitude + ': ' + coords.latitude;
					msg += '\n' + ListingEditor.Config.TRANSLATIONS.sharedLongitude + ': ' + coords.longitude;
				}
				if (link) {
					msg += '\n' + ListingEditor.Config.TRANSLATIONS.sharedWebsite + ': ' + link;
				}
				if (image) {
					msg += '\n' + ListingEditor.Config.TRANSLATIONS.sharedImage + ': ' + image;
				}
				if (wikipedia) {
					msg += '\n' + ListingEditor.Config.TRANSLATIONS.sharedWikipedia + ': ' + wikipedia;
				}
				if (msg) {
					if (confirm(ListingEditor.Config.TRANSLATIONS.wikidataShared + '\n' + msg)) {
						if (coords) {
							updateFieldIfNotNull('#input-lat', coords.latitude);
							updateFieldIfNotNull('#input-long', coords.longitude);
						}
						updateFieldIfNotNull('#input-url', link);
						updateFieldIfNotNull('#input-image', image);
						if (image) {
							commonsLink(image);
						}
						updateFieldIfNotNull('#input-wikipedia', wikipedia);
						if (wikipedia) {
							wikipediaLink(wikipedia);
						}
					}
				} else {
					alert(ListingEditor.Config.TRANSLATIONS.wikidataSharedNotFound);
				}
			};
			ListingEditor.SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
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
				href: ListingEditor.Config.WIKIDATA_URL + '/wiki/' + mw.util.wikiUrlencode(value),
				title: ListingEditor.Config.TRANSLATIONS.viewWikidataPage,
				text: value
			});
			$("#wikidata-value-link", form).html(link);
			$("#wikidata-value-display-container", form).show();
			$('#div_wikidata_update', form).show();
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
			var LISTING_LAST_EDIT_PARAMETER = 'mise à jour';
			var EDITOR_LAST_EDIT_SELECTOR = '#input-last-edit';
			if (mode == ListingEditor.Core.MODE_ADD || $(EDITOR_LAST_EDIT_SELECTOR).is(':checked')) {
				listing[LISTING_LAST_EDIT_PARAMETER] = currentLastEditDate();
			}
		};
		SUBMIT_FORM_CALLBACKS.push(updateLastEditDate);

		// --------------------------------------------------------------------
		// LISTING EDITOR FORM VALIDATION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Verify all listings have at least a name, address or alt value.
		 */
		var validateListingHasData = function(validationFailureMessages) {
			if ($('#input-name').val() === '' && $('#input-address').val() === '' && $('#input-alt').val() === '') {
				validationFailureMessages.push(ListingEditor.Config.TRANSLATIONS.validationEmptyListing);
			}
		};
		VALIDATE_FORM_CALLBACKS.push(validateListingHasData);

		/**
		 * Implement SIMPLE validation on email addresses.  Invalid emails can
		 * still get through, but this method implements a minimal amount of
		 * validation in order to catch the worst offenders.
		 */
		var validateEmail = function(validationFailureMessages) {
			var VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
			_validateFieldAgainstRegex(validationFailureMessages, VALID_EMAIL_REGEX, '#input-email', ListingEditor.Config.TRANSLATIONS.validationEmail);
		};
		VALIDATE_FORM_CALLBACKS.push(validateEmail);

		/**
		 * Implement SIMPLE validation on Wikipedia field to verify that the
		 * user is entering the article title and not a URL.
		 */
		var validateWikipedia = function(validationFailureMessages) {
			var VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_WIKIPEDIA_REGEX, '#input-wikipedia', ListingEditor.Config.TRANSLATIONS.validationWikipedia);
		};
		VALIDATE_FORM_CALLBACKS.push(validateWikipedia);

		/**
		 * Implement SIMPLE validation on the Commons field to verify that the
		 * user has not included a "File" or "Image" namespace.
		 */
		var validateImage = function(validationFailureMessages) {
			var VALID_IMAGE_REGEX = new RegExp('^(?!(file|image|' + ListingEditor.Config.TRANSLATIONS.image + '):)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_IMAGE_REGEX, '#input-image', ListingEditor.Config.TRANSLATIONS.validationImage);
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

	ListingEditor.SisterSite = function() {
		var API_WIKIDATA = ListingEditor.Config.WIKIDATA_URL + '/w/api.php';
		var API_WIKIPEDIA = ListingEditor.Config.WIKIPEDIA_URL + '/w/api.php';
		var API_COMMONS = ListingEditor.Config.COMMONS_URL + '/w/api.php';
		var WIKIDATA_CLAIM_COORD = 'P625';
		var WIKIDATA_CLAIM_LINK = 'P856';
		var WIKIDATA_CLAIM_IMAGE = 'P18';

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
		var _wikidataClaim = function(jsonObj, value, property) {
			var entity = _wikidataEntity(jsonObj, value);
			if (!entity || !entity.claims || !entity.claims[property]) {
				return null;
			}
			var propertyObj = entity.claims[property];
			if (!propertyObj || propertyObj.length < 1 || !propertyObj[0].mainsnak || !propertyObj[0].mainsnak.datavalue) {
				return null;
			}
			return propertyObj[0].mainsnak.datavalue.value;
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
			if (!entityObj || !entityObj.sitelinks || !entityObj.sitelinks[ListingEditor.Config.WIKIDATA_SITELINK_WIKIPEDIA] || !entityObj.sitelinks[ListingEditor.Config.WIKIDATA_SITELINK_WIKIPEDIA].title) {
				return null;
			}
			return entityObj.sitelinks[ListingEditor.Config.WIKIDATA_SITELINK_WIKIPEDIA].title;
		};
		// expose public members
		return {
			API_WIKIDATA: API_WIKIDATA,
			API_WIKIPEDIA: API_WIKIPEDIA,
			API_COMMONS: API_COMMONS,
			WIKIDATA_CLAIM_COORD: WIKIDATA_CLAIM_COORD,
			WIKIDATA_CLAIM_LINK: WIKIDATA_CLAIM_LINK,
			WIKIDATA_CLAIM_IMAGE: WIKIDATA_CLAIM_IMAGE,
			initializeSisterSiteAutocomplete: _initializeSisterSiteAutocomplete,
			ajaxSisterSiteSearch: _ajaxSisterSiteSearch,
			wikidataClaim: _wikidataClaim,
			wikidataWikipedia: _wikidataWikipedia,
			wikidataLabel: _wikidataLabel
		};
	}();

	/* ***********************************************************************
	 * ListingEditor.Core contains code that should be shared across different
	 * Wikivoyage languages.  This code uses the custom configurations in the
	 * ListingEditor.Config and ListingEditor.Callback modules to initialize
	 * the listing editor and process add and update requests for listings.
	 * ***********************************************************************/
	ListingEditor.Core = function() {
		var api = new mw.Api();
		var MODE_ADD = 'add';
		var MODE_EDIT = 'edit';
		// selector that identifies the edit link as created by the
		// addEditButtons() function
		var EDIT_LINK_SELECTOR = '.vcard-edit-button';
		var SAVE_FORM_SELECTOR = '#progress-dialog';
		var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
		var sectionText, inlineListing, replacements = {};

		/**
		 * Return false if the current page should not enable the listing editor.
		 * Examples where the listing editor should not be enabled include talk
		 * pages, edit pages, history pages, etc.
		 */
		var listingEditorAllowedForCurrentPage = function() {
			var namespace = mw.config.get( 'wgNamespaceNumber' );
			if (namespace !== 0 && namespace !== 2 && namespace !== 4) {
				return false;
			}
			if ( mw.config.get('wgAction') != 'view' || $('#mw-revision-info').length
					|| mw.config.get('wgCurRevisionId') != mw.config.get('wgRevisionId')
					|| $('#ca-viewsource').length ) {
				return false;
			}
			return true;
		};

		/**
		 * Generate the form UI for the listing editor.  If editing an existing
		 * listing, pre-populate the form input fields with the existing values.
		 */
		var createForm = function(mode, listingParameters, listingTemplateAsMap) {
			var form = $(ListingEditor.Config.EDITOR_FORM_HTML);
			// make sure the select dropdown includes any custom "type" values
			var listingType = listingTemplateAsMap[ListingEditor.Config.LISTING_TYPE_PARAMETER];
			if (isCustomListingType(listingType)) {
				$('#' + listingParameters[ListingEditor.Config.LISTING_TYPE_PARAMETER].id, form).append('<option value="' + listingType + '">' + listingType + '</option>');
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
			for (var i=0; i < ListingEditor.Callbacks.CREATE_FORM_CALLBACKS.length; i++) {
				ListingEditor.Callbacks.CREATE_FORM_CALLBACKS[i](form, mode);
			}
			return form;
		};

		/**
		 * Wrap the h2/h3 heading tag and everything up to the next section
		 * (including sub-sections) in a div to make it easier to traverse the DOM.
		 * This change introduces the potential for code incompatibility should the
		 * div cause any CSS or UI conflicts.
		 */
		var wrapContent = function() {
			$('#bodyContent h2').each(function(){
				$(this).nextUntil("h1, h2").addBack().wrapAll('<div class="mw-h2section" />');
			});
			$('#bodyContent h3').each(function(){
				$(this).nextUntil("h1, h2, h3").addBack().wrapAll('<div class="mw-h3section" />');
			});
		};

		/**
		 * Place an "add listing" link at the top of each section heading next to
		 * the "edit" link in the section heading.
		 */
		var addListingButtons = function() {
			if ($(ListingEditor.Config.DISALLOW_ADD_LISTING_IF_PRESENT.join(',')).length > 0) {
				return false;
			}
			for (var sectionId in ListingEditor.Config.SECTION_TO_TEMPLATE_TYPE) {
				sectionId = encodeURIComponent(sectionId).replace(/%20/g,'_').replace(/%/g,'.');
				// use a pattern rather than searching by ID directly in case
				// the article uses top-level headings in sub-sections
				var topHeading = $('h2 [id="' + sectionId + '"]');
				if (topHeading.length) {
					insertAddListingPlaceholder(topHeading);
					var parentHeading = topHeading.closest('div.mw-h2section');
					$('h3 .mw-headline', parentHeading).each(function() {
						insertAddListingPlaceholder(this);
					});
				}
			}
			$('.listingeditor-add').click(function() {
				initListingEditorDialog(MODE_ADD, $(this));
			});
		};

		/**
		 * Utility function for appending the "add listing" link text to a heading.
		 */
		var insertAddListingPlaceholder = function(parentHeading) {
			var editSection = $(parentHeading).next('.mw-editsection');
			editSection.append('<span class="mw-editsection-bracket">[</span><a href="javascript:" class="listingeditor-add">'+ListingEditor.Config.TRANSLATIONS.add+'</a><span class="mw-editsection-bracket">]</span>');
		};

		/**
		 * Place an "edit" link next to all existing listing tags.
		 */
		var addEditButtons = function() {
			var editButton = $('<span class="vcard-edit-button noprint">')
				.html('<a href="javascript:" class="listingeditor-edit">'+ListingEditor.Config.TRANSLATIONS.edit+'</a>' )
				.click(function() {
					initListingEditorDialog(MODE_EDIT, $(this));
				});
			// if there is already metadata present add a separator
			$(ListingEditor.Config.EDIT_LINK_CONTAINER_SELECTOR).each(function() {
				if (!isElementEmpty(this)) {
					$(this).append('&nbsp;|&nbsp;');
				}
			});
			// append the edit link
			$(ListingEditor.Config.EDIT_LINK_CONTAINER_SELECTOR).append( editButton );
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
		 * the heading represents.  First heading is 1, second is 2, etc.
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
		 * that listing is within a section.  First listing is 0, second is 1, etc.
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
		 * etc).  If no matching type is found then the default listing template
		 * type is returned.
		 */
		var findListingTypeForSection = function(entry) {
			var sectionType = entry.closest('div.mw-h2section').children('h2').find('.mw-headline').attr('id');
			for (var sectionId in ListingEditor.Config.SECTION_TO_TEMPLATE_TYPE) {
				if (sectionType == sectionId) {
					return ListingEditor.Config.SECTION_TO_TEMPLATE_TYPE[sectionId];
				}
			}
			return ListingEditor.Config.DEFAULT_LISTING_TEMPLATE;
		};

		var replaceSpecial = function(str) {
			return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
		};

		/**
		 * Return a regular expression that can be used to find all listing
		 * template invocations (as configured via the LISTING_TEMPLATES map)
		 * within a section of wikitext.  Note that the returned regex simply
		 * matches the start of the template ("{{listing") and not the full
		 * template ("{{listing|key=value|...}}").
		 */
		var getListingTypesRegex = function() {
			var regex = [];
			for (var key in ListingEditor.Config.LISTING_TEMPLATES) {
				regex.push(key);
			}
			return new RegExp('({{\\s*(' + regex.join('|') + ')\\b)\\s*([\\|}])','ig');
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
			listingTemplateWikiSyntax = listingTemplateWikiSyntax.replace(typeRegex,'{{Listing| ' + ListingEditor.Config.LISTING_TYPE_PARAMETER + '=$2$3');
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
				} else if (listingTemplateAsMap[lastKey].length) {
					// there was a pipe character within a param value, such as
					// "key=value1|value2", so just append to the previous param
					listingTemplateAsMap[lastKey] += '|' + param;
				}
			}
			for (var key in listingTemplateAsMap) {
				// if the template value contains an HTML comment that was
				// previously converted to a placehold then it needs to be
				// converted back to a comment so that the placeholder is not
				// displayed in the edit form
				listingTemplateAsMap[key] = restoreComments(listingTemplateAsMap[key], false);
			}
			if (listingTemplateAsMap[ListingEditor.Config.LISTING_CONTENT_PARAMETER]) {
				// convert paragraph tags to newlines so that the content is more
				// readable in the editor window
				listingTemplateAsMap[ListingEditor.Config.LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[ListingEditor.Config.LISTING_CONTENT_PARAMETER].replace(/\s*<p>\s*/g, '\n\n');
			}
			// sanitize the listing type param to match the configured values, so
			// if the listing contained "Do" it will still match the configured "do"
			for (var key in ListingEditor.Config.LISTING_TEMPLATES) {
				if (listingTemplateAsMap[ListingEditor.Config.LISTING_TYPE_PARAMETER].toLowerCase() === key.toLowerCase()) {
					listingTemplateAsMap[ListingEditor.Config.LISTING_TYPE_PARAMETER] = key;
					break;
				}
			}
			return listingTemplateAsMap;
		};

		/**
		 * Split the raw template wikitext into an array of params.  The pipe
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
		 * pattern, including nesting.  The specified value must start with the
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
		 * syntax contained within the specified section.  This wiki text will
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
			$.ajax({
				url: mw.util.wikiScript(''),
				data: { title: mw.config.get('wgPageName'), action: 'raw', section: sectionIndex },
				cache: false // required
			}).done(function(data, textStatus, jqXHR) {
				sectionText = data;
				openListingEditorDialog(mode, sectionIndex, listingIndex, listingType);
			}).fail(function(jqXHR, textStatus, errorThrown) {
				alert(ListingEditor.Config.TRANSLATIONS.ajaxInitFailure + ': ' + textStatus + ' ' + errorThrown);
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
					listingTemplateAsMap[ListingEditor.Config.LISTING_TYPE_PARAMETER] = listingType;
				} else {
					listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
					listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
					listingType = listingTemplateAsMap[ListingEditor.Config.LISTING_TYPE_PARAMETER];
				}
				var listingParameters = getListingInfo(listingType);
				// if a listing editor dialog is already open, get rid of it
				if ($(ListingEditor.Config.EDITOR_FORM_SELECTOR).length > 0) {
					$(ListingEditor.Config.EDITOR_FORM_SELECTOR).dialog('destroy').remove();
				}
				var form = $(createForm(mode, listingParameters, listingTemplateAsMap));
				// wide dialogs on huge screens look terrible
				var windowWidth = $(window).width();
				var dialogWidth = (windowWidth > ListingEditor.Config.MAX_DIALOG_WIDTH) ? ListingEditor.Config.MAX_DIALOG_WIDTH : 'auto';
				// modal form - must submit or cancel
				form.dialog({
					modal: true,
					height: 'auto',
					width: dialogWidth,
					title: (mode == MODE_ADD) ? ListingEditor.Config.TRANSLATIONS.addTitle : ListingEditor.Config.TRANSLATIONS.editTitle,
					dialogClass: 'listing-editor-dialog',
					buttons: [
					{
						text: '?',
						id: 'listing-help',
						click: function() { window.open(ListingEditor.Config.TRANSLATIONS.helpPage);}
					},
					{
						text: ListingEditor.Config.TRANSLATIONS.submit, click: function() {
							if (validateForm()) {
								formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
								$(this).dialog('close');
							}
						}
					},
					{
						text: ListingEditor.Config.TRANSLATIONS.cancel,
						click: function() {
							$(this).dialog('destroy').remove();
						}
					}
					],
					create: function() {
						$('.ui-dialog-buttonpane').append('<div class="listing-license">' + ListingEditor.Config.TRANSLATIONS.licenseText + '</div>');
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
			return (isCustomListingType(type)) ? ListingEditor.Config.LISTING_TEMPLATES[ListingEditor.Config.DEFAULT_LISTING_TEMPLATE] : ListingEditor.Config.LISTING_TEMPLATES[type];
		};

		/**
		 * Determine if the specified listing type is a custom type - for example "go"
		 * instead of "see", "do", "listing", etc.
		 */
		var isCustomListingType = function(listingType) {
			return !(listingType in ListingEditor.Config.LISTING_TEMPLATES);
		};

		/**
		 * Logic invoked on form submit to analyze the values entered into the
		 * editor form and to block submission if any fatal errors are found.
		 */
		var validateForm = function() {
			var validationFailureMessages = [];
			for (var i=0; i < ListingEditor.Callbacks.VALIDATE_FORM_CALLBACKS.length; i++) {
				ListingEditor.Callbacks.VALIDATE_FORM_CALLBACKS[i](validationFailureMessages);
			}
			if (validationFailureMessages.length > 0) {
				alert(validationFailureMessages.join('\n'));
				return false;
			}
			// newlines in listing content won't render properly in lists, so
			// replace them with <p> tags
			$('#input-content').val($.trim($('#input-content').val()).replace(/\n+/g, '<p>'));
			var webRegex = new RegExp('^https?://', 'i');
			var url = $('#input-url').val();
			if (!webRegex.test(url) && url !== '') {
				$('#input-url').val('http://' + url);
			}
			return true;
		};

		/**
		 * Convert the listing editor form entry fields into wiki text.  This
		 * method converts the form entry fields into a listing template string,
		 * replaces the original template string in the section text with the
		 * updated entry, and then submits the section text to be saved on the
		 * server.
		 */
		var formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
			var listing = listingTemplateAsMap;
			var defaultListingParameters = getListingInfo(ListingEditor.Config.DEFAULT_LISTING_TEMPLATE);
			var listingTypeInput = defaultListingParameters[ListingEditor.Config.LISTING_TYPE_PARAMETER].id;
			var listingType = $("#" + listingTypeInput).val();
			var listingParameters = getListingInfo(listingType);
			for (var parameter in listingParameters) {
				listing[parameter] = $("#" + listingParameters[parameter].id).val();
			}
			for (var i=0; i < ListingEditor.Callbacks.SUBMIT_FORM_CALLBACKS.length; i++) {
				ListingEditor.Callbacks.SUBMIT_FORM_CALLBACKS[i](listing, mode);
			}
			var text = listingToStr(listing);
			var summary = editSummarySection();
			if (mode == MODE_ADD) {
				summary = updateSectionTextWithAddedListing(summary, text, listing);
			} else {
				summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
			}
			summary += $("#input-name").val();
			if ($(ListingEditor.Config.EDITOR_SUMMARY_SELECTOR).val() !== '') {
				summary += ' - ' + $(ListingEditor.Config.EDITOR_SUMMARY_SELECTOR).val();
			}
			var minor = $(ListingEditor.Config.EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;
			saveForm(summary, minor, sectionNumber, '', '');
			return;
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
		var updateSectionTextWithAddedListing = function(originalEditSummary, listingWikiText, listing) {
			var summary = originalEditSummary;
			summary += ListingEditor.Config.TRANSLATIONS.added;
			// add the new listing to the end of the section.  if there are
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

		/**
		 * After the listing has been converted to a string, add additional
		 * processing required for edits (as opposed to adds), returning an
		 * appropriate edit summary string.
		 */
		var updateSectionTextWithEditedListing = function(originalEditSummary, listingWikiText, listingTemplateWikiSyntax) {
			var summary = originalEditSummary;
			if ($(ListingEditor.Config.EDITOR_CLOSED_SELECTOR).is(':checked')) {
				listingWikiText = '';
				summary += ListingEditor.Config.TRANSLATIONS.removed;
				var listRegex = new RegExp('(\\n+[\\:\\*\\#]*)?\\s*' + replaceSpecial(listingTemplateWikiSyntax));
				sectionText = sectionText.replace(listRegex, listingWikiText);
			} else {
				summary += ListingEditor.Config.TRANSLATIONS.updated;
				sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
			}
			sectionText = restoreComments(sectionText, true);
			return summary;
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
			var progress = $('<div id="progress-dialog">' + ListingEditor.Config.TRANSLATIONS.saving + '</div>');
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
		 * they are saved.  After saving the page is refreshed to show the updated
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
						var sectionName = encodeURIComponent(getSectionName()).replace(/%20/g,'_').replace(/%/g,'.');
						if (sectionName.length) {
							canonicalUrl += "#" + sectionName;
						}
						window.location.href = canonicalUrl;
					} else {
						window.location.reload();
					}
				} else if (data && data.error) {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitApiError + ' "' + data.error.code + '": ' + data.error.info );
				} else if (data && data.edit.spamblacklist) {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitBlacklistError + ': ' + data.edit.spamblacklist );
				} else if (data && data.edit.captcha) {
					$(SAVE_FORM_SELECTOR).dialog('destroy').remove();
					captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id);
				} else {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitUnknownError);
				}
			}).fail(function(code, result) {
				if (code === "http") {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitHttpError + ': ' + result.textStatus );
				} else if (code === "ok-but-empty") {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitEmptyError);
				} else {
					saveFailed(ListingEditor.Config.TRANSLATIONS.submitUnknownError + ': ' + code );
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
			$(ListingEditor.Config.EDITOR_FORM_SELECTOR).dialog('open');
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
			var captcha = $('<div id="captcha-dialog">').text(ListingEditor.Config.TRANSLATIONS.externalLinks);
			var image = $('<img class="fancycaptcha-image">')
					.attr('src', captchaImgSrc)
					.appendTo(captcha);
			var label = $('<label for="input-captcha">').text(ListingEditor.Config.TRANSLATIONS.enterCaptcha).appendTo(captcha);
			var input = $('<input id="input-captcha" type="text">').appendTo(captcha);
			captcha.dialog({
				modal: true,
				title: ListingEditor.Config.TRANSLATIONS.enterCaptcha,
				buttons: [
					{
						text: ListingEditor.Config.TRANSLATIONS.submit, click: function() {
							saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val());
							$(this).dialog('destroy').remove();
						}
					},
					{
						text: ListingEditor.Config.TRANSLATIONS.cancel, click: function() {
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
			var listingType = listing[ListingEditor.Config.LISTING_TYPE_PARAMETER];
			var listingParameters = getListingInfo(listingType);
			var saveStr = '{{';
			// if this is a custom type (example: "go") then the type parameter must be specified explicitly
			if (isCustomListingType(listingType)) {
				saveStr += ListingEditor.Config.DEFAULT_LISTING_TEMPLATE;
				saveStr += ' | ' + ListingEditor.Config.LISTING_TYPE_PARAMETER + '=' + listingType;
			} else {
				saveStr += listingType;
			}
			if (!inlineListing && listingParameters[ListingEditor.Config.LISTING_TYPE_PARAMETER].newline) {
				saveStr += '\n';
			}
			for (var parameter in listingParameters) {
				if (parameter === ListingEditor.Config.LISTING_TYPE_PARAMETER) {
					// "type" parameter was handled previously
					continue;
				}
				if (parameter === ListingEditor.Config.LISTING_CONTENT_PARAMETER) {
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
			if (ListingEditor.Config.ALLOW_UNRECOGNIZED_PARAMETERS) {
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
			saveStr += '| ' + ListingEditor.Config.LISTING_CONTENT_PARAMETER + '=' + listing[ListingEditor.Config.LISTING_CONTENT_PARAMETER];
			saveStr += (inlineListing || !listingParameters[ListingEditor.Config.LISTING_CONTENT_PARAMETER].newline) ? ' ' : '\n';
			saveStr += '}}';
			return saveStr;
		};

		/**
		 * Determine if the specified DOM element contains only whitespace or
		 * whitespace HTML characters (&nbsp;).
		 */
		var isElementEmpty = function(element) {
			var text = $(element).text();
			if (!text.trim()) {
				return true;
			}
			return (text.trim() == '&nbsp;');
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
		 * Called on DOM ready, this method initializes the listing editor and
		 * adds the "add/edit listing" links to sections and existing listings.
		 */
		var initListingEditor = function() {
			if (!listingEditorAllowedForCurrentPage()) {
				return;
			}
			wrapContent();
			mw.hook( 'wikipage.content' ).add( addListingButtons.bind( this ) );
			addEditButtons();
		};

		// expose public members
		return {
			MODE_ADD: MODE_ADD,
			MODE_EDIT: MODE_EDIT,
			trimDecimal: trimDecimal,
			init: initListingEditor
		};
	}();

	$(document).ready(function() {
		ListingEditor.Core.init();
	});

} ( mediaWiki, jQuery ) );

//</nowiki>
