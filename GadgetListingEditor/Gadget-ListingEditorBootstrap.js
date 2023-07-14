$(function() {
	// (oldid=4687849)[[Wikivoyage:Travellers%27_pub#c-WhatamIdoing-20230630083400-FredTC-20230630053700]]
	if ( mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}

	// --------------------------------------------------------------------
	// UPDATE THE FOLLOWING TO MATCH WIKIVOYAGE ARTICLE SECTION NAMES
	// --------------------------------------------------------------------

	// map section heading ID to the listing template to use for that section
	var SECTION_TO_TEMPLATE_TYPE = {
		'See': 'see',
		'Do': 'do',
		'Buy': 'buy',
		'Eat': 'eat',
		'Drink': 'drink',
		'Sleep': 'sleep',
		'Connect': 'listing',
		'Wait': 'see',
		'See_and_do': 'see',
		'Eat_and_drink': 'eat',
		'Get_in': 'go',
		'Get_around': 'go',
	};
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

	// If any of these patterns are present on a page then no 'add listing'
	// buttons will be added to the page
	var DISALLOW_ADD_LISTING_IF_PRESENT = ['#Cities', '#Other_destinations', '#Islands', '#print-districts' ];

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

	var TRANSLATIONS_ALL = {
		en: {
			add: 'add listing',
			edit: 'edit'
		}
	};
	var TRANSLATIONS = Object.assign(
		{},
		TRANSLATIONS_ALL.en,
		TRANSLATIONS_ALL[ mw.config.get( 'wgUserLanguage' ) ]
	);

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

	function loadMain() {
		return mw.loader.using( 'ext.gadget.ListingEditorMain' ).then( function ( req ) {
			var module = req( 'ext.gadget.ListingEditorMain' );
			return module( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE );
		} );
	}

	/**
	 * Place an "edit" link next to all existing listing tags.
	 */
	var addEditButtons = function() {
		var editButton = $('<span class="vcard-edit-button noprint">')
			.html('<a href="javascript:" class="listingeditor-edit">'+TRANSLATIONS.edit+'</a>' )
			.on('click', function() {
				loadMain().then( function ( core ) {
					core.initListingEditorDialog(MODE_EDIT, $(this));
				} );
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

	/**
	 * Utility function for appending the "add listing" link text to a heading.
	 */
	var insertAddListingPlaceholder = function(parentHeading) {
		var editSection = $(parentHeading).next('.mw-editsection');
		editSection.append('<span class="mw-editsection-bracket">[</span><a href="javascript:" class="listingeditor-add">'+TRANSLATIONS.add+'</a><span class="mw-editsection-bracket">]</span>');
	};

	/**
	 * Place an "add listing" link at the top of each section heading next to
	 * the "edit" link in the section heading.
	 */
	var addListingButtons = function() {
		if ($(DISALLOW_ADD_LISTING_IF_PRESENT.join(',')).length > 0) {
			return false;
		}
		for (var sectionId in SECTION_TO_TEMPLATE_TYPE) {
			// do not search using "#id" for two reasons. one, the article might
			// re-use the same heading elsewhere and thus have two of the same ID.
			// two, unicode headings are escaped ("è" becomes ".C3.A8") and the dot
			// is interpreted by JQuery to indicate a child pattern unless it is
			// escaped
			var topHeading = $('h2 [id="' + sectionId + '"]');
			if (topHeading.length) {
				insertAddListingPlaceholder(topHeading);
				var parentHeading = topHeading.closest('div.mw-h2section');
				$('h3 .mw-headline', parentHeading).each(function() {
					insertAddListingPlaceholder(this);
				});
			}
		}
		$('.listingeditor-add').on('click', function() {
			loadMain().then( function ( core ) {
				core.initListingEditorDialog(core.MODE_ADD, $(this));
			} );
		});
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
		mw.hook( 'wikipage.content' ).add( addListingButtons );
		addEditButtons();
	};
	initListingEditor();
});
