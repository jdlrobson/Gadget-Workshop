$(function() {
	// (oldid=4687849)[[Wikivoyage:Travellers%27_pub#c-WhatamIdoing-20230630083400-FredTC-20230630053700]]
	if ( mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}

	// List of namespaces where the editor is allowed
	var ALLOWED_NAMESPACE = [
		0, //Main
		2, //User
		4, //Wikivoyage
	];

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

	mw.loader.using( 'ext.gadget.ListingEditorMain' ).then( function ( req ) {
		var module = req( 'ext.gadget.ListingEditorMain' );
		/**
		 * Called on DOM ready, this method initializes the listing editor and
		 * adds the "add/edit listing" links to sections and existing listings.
		 */
		var initListingEditor = function() {
			var core = module( ALLOWED_NAMESPACE );
			if (!listingEditorAllowedForCurrentPage()) {
				return;
			}
			wrapContent();
			mw.hook( 'wikipage.content' ).add( core.addListingButtons.bind( this ) );
			core.addEditButtons();
		};
		initListingEditor();
	} );
});
