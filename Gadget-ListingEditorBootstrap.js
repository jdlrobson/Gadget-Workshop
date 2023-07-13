$(function() {
	// (oldid=4687849)[[Wikivoyage:Travellers%27_pub#c-WhatamIdoing-20230630083400-FredTC-20230630053700]]
	if ( mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}

	// selector that identifies the HTML elements into which the 'edit' link
	// for each listing will be placed
	var EDIT_LINK_CONTAINER_SELECTOR = 'span.listing-metadata-items';
	var MODE_EDIT = 'edit';

	// List of namespaces where the editor is allowed
	var ALLOWED_NAMESPACE = [
		0, //Main
		2, //User
		4, //Wikivoyage
	];

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

	var TRANSLATIONS = {
		'addTitle' : 'Add New Listing',
		'editTitle' : 'Edit Existing Listing',
		'syncTitle' : 'Wikidata Sync',
		'add': 'add listing',
		'edit': 'edit',
		'saving': 'Saving...',
		'submit': 'Submit',
		'cancel': 'Cancel',
		'cancelAll': 'Clear all',
		'preview': 'Preview',
		'previewOff': 'Preview off',
		'refresh': '↺', // \ue031 not yet working
		'refreshTitle': 'Refresh preview',
		'selectAll': 'Select all',
		'selectAlternatives': 'Select all values where the alternative is empty.',
		'validationEmptyListing': 'Please enter either a name or an address',
		'validationEmail': 'Please ensure the email address is valid',
		'validationWikipedia': 'Please insert the Wikipedia page title only; not the full URL address',
		'validationImage': 'Please insert the Commons image title only without any prefix',
		'image': '', //Local prefix for Image (or File)
		'added': 'Added listing for ',
		'updated': 'Updated listing for ',
		'removed': 'Deleted listing for ',
		'helpPage': '//en.wikivoyage.org/wiki/Wikivoyage:Listing_editor',
		'enterCaptcha': 'Enter CAPTCHA',
		'externalLinks': 'Your edit includes new external links.',
		// license text should match MediaWiki:Wikimedia-copyrightwarning
		'licenseText': 'By clicking "Submit", you agree to the <a class="external" target="_blank" href="//wikimediafoundation.org/wiki/Terms_of_use">Terms of use</a>, and you irrevocably agree to release your contribution under the <a class="external" target="_blank" href="//en.wikivoyage.org/wiki/Wikivoyage:Full_text_of_the_Attribution-ShareAlike_3.0_license">CC-BY-SA 3.0 License</a>. You agree that a hyperlink or URL is sufficient attribution under the Creative Commons license.',
		'ajaxInitFailure': 'Error: Unable to initialize the listing editor',
		'sharedWikipedia': 'wikipedia',
		'synchronized': 'synchronized.',
		'submitApiError': 'Error: The server returned an error while attempting to save the listing, please try again',
		'submitBlacklistError': 'Error: A value in the data submitted has been blacklisted, please remove the blacklisted pattern and try again',
		'submitUnknownError': 'Error: An unknown error has been encountered while attempting to save the listing, please try again',
		'submitHttpError': 'Error: The server responded with an HTTP error while attempting to save the listing, please try again',
		'submitEmptyError': 'Error: The server returned an empty response while attempting to save the listing, please try again',
		'viewCommonsPage' : 'view Commons page',
		'viewWikidataPage' : 'view Wikidata record',
		'viewWikipediaPage' : 'view Wikipedia page',
		'wikidataSharedMatch': 'No differences found between local and Wikidata values',
		'wikidataShared': 'The following data was found in the shared Wikidata record. Update shared fields using these values?',
		'wikidataSharedNotFound': 'No shared data found in the Wikidata repository',
		'wikidataSyncBlurb': 'Selecting a value will change both websites to match (selecting an empty value will delete from both). Selecting neither will change nothing. Please err toward selecting one of the values rather than skipping - there are few cases when we should prefer to have a different value intentionally.<p>You are encouraged to go to the Wikidata item and add references for any data you change.',
	};

	/**
	 * Return false if the current page should not enable the listing editor.
	 * Examples where the listing editor should not be enabled include talk
	 * pages, edit pages, history pages, etc.
	 */
	var listingEditorAllowedForCurrentPage = function() {
		var namespace = mw.config.get( 'wgNamespaceNumber' );
		if (ALLOWED_NAMESPACE.indexOf(namespace)<0) {
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
	 * Place an "edit" link next to all existing listing tags.
	 */
	var addEditButtons = function( core ) {
		var editButton = $('<span class="vcard-edit-button noprint">')
			.html('<a href="javascript:" class="listingeditor-edit">'+TRANSLATIONS.edit+'</a>' )
			.click(function() {
				core.initListingEditorDialog(MODE_EDIT, $(this));
			});
		// if there is already metadata present add a separator
		$(EDIT_LINK_CONTAINER_SELECTOR).each(function() {
			if (!isElementEmpty(this)) {
				$(this).append('&nbsp;|&nbsp;');
			}
		});
		// append the edit link
		$(EDIT_LINK_CONTAINER_SELECTOR).append( editButton );
	};

	mw.loader.using( 'ext.gadget.ListingEditorMain' ).then( function ( req ) {
		var module = req( 'ext.gadget.ListingEditorMain' );
		/**
		 * Called on DOM ready, this method initializes the listing editor and
		 * adds the "add/edit listing" links to sections and existing listings.
		 */
		var initListingEditor = function() {
			var core = module( ALLOWED_NAMESPACE, TRANSLATIONS );
			if (!listingEditorAllowedForCurrentPage()) {
				return;
			}
			wrapContent();
			mw.hook( 'wikipage.content' ).add( core.addListingButtons.bind( this ) );
			addEditButtons( core );
		};
		initListingEditor();
	} );
});
