/**
 * Listing Editor v3.7.4
 * @maintainer Jdlrobson
 * Please upstream any changes you make here to https://github.com/jdlrobson/Gadget-Workshop/tree/master/GadgetListingEditor
 * Raise issues at https://github.com/jdlrobson/Gadget-Workshop/issues
 * to avoid losing them in future updates.
 *	Source code: https://github.com/jdlrobson/Gadget-Workshop
 *	Wiki: https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023Main.js
 *	Original author:
 *	- torty3
 *	Additional contributors:
 *	- Andyrom75
 *	- ARR8
 *	- RolandUnger
 *	- Wrh2
 *	- Jdlrobson
 *	Changelog: https://en.wikivoyage.org/wiki/Wikivoyage:Listing_editor#Changelog

 *	TODO
 *	- Add support for mobile devices.
 *	- wrapContent is breaking the expand/collapse logic on the VFD page.
 *	- populate the input-type select list from LISTING_TEMPLATES
 *	- Allow syncing Wikipedia link back to Wikidata with wbsetsitelink
 *	- Allow hierarchy of preferred sources, rather than just one source, for Wikidata sync
 *		- E.g. get URL with language of work = english before any other language version if exists
 *		- E.g. get fall back to getting coordinate of headquarters if geographic coordinates unavailable. Prioritize getting coordinates of entrance before any other coordinates if all present
 *		- E.g. Can use multiple sources to fetch address
 *		- Figure out how to get this to upload properly
 */
 //<nowiki>
window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ = '3.7.4'

'use strict';

var GadgetListingEditor2023 = {};

/**
 * Wrap the h2/h3 heading tag and everything up to the next section
 * (including sub-sections) in a div to make it easier to traverse the DOM.
 * This change introduces the potential for code incompatibility should the
 * div cause any CSS or UI conflicts.
 */

const wrapContent = function() {
    var isNewMarkup = $( '.mw-heading').length > 0;
    // No need to wrap with ?useparsoid=1&safemode=1
    if ( $( 'section .mw-heading3, section .mw-heading2' ).length ) {
        return;
    }
    // MobileFrontend use-case
    if ( $( '.mw-parser-output > h2.section-heading' ).length ) {
        $( '.mw-parser-output > section' ).addClass( 'mw-h2section' );
    } else {
        if ( isNewMarkup ) {
            $('#bodyContent').find('.mw-heading2').each(function(){
                $(this).nextUntil(".mw-heading1, .mw-heading2").addBack().wrapAll('<div class="mw-h2section" />');
            });
        } else {
            $('#bodyContent').find('h2').each(function(){
                $(this).nextUntil("h1, h2").addBack().wrapAll('<div class="mw-h2section" />');
            });
        }
    }
    if ( isNewMarkup ) {
        $('#bodyContent').find('.mw-heading3').each(function(){
            $(this).nextUntil(".mw-heading1,.mw-heading2,.mw-heading3").addBack().wrapAll('<div class="mw-h3section" />');
        });
    } else {
        $('#bodyContent').find('h3').each(function(){
            $(this).nextUntil("h1, h2, h3").addBack().wrapAll('<div class="mw-h3section" />');
        });
    }
};

const insertAddListingBracketedLink = ( addMsg ) => {
    return $( `<a role="button" href="javascript:" class="listingeditor-add listingeditor-add-brackets">${addMsg}</a>` );
};

const insertAddListingIconButton = ( addMsg ) => {
return $( `<button class="listingeditor-add cdx-button cdx-button--size-large cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet">
    <span class="minerva-icon minerva-icon--addListing"></span>
    <span>${addMsg}</span>
</button>` );
};

/**
 * Utility function for appending the "add listing" link text to a heading.
 */
const insertAddListingPlaceholder = function(parentHeading, addMsg = '', useButton = false ) {
    const $pheading =  $(parentHeading);
    const $headline = $(parentHeading).find( '.mw-headline' );
    const editSection = $headline.length ? $headline.next('.mw-editsection') : $pheading.next( '.mw-editsection');
    const btn = useButton ?
        insertAddListingIconButton( addMsg ) :
        insertAddListingBracketedLink( addMsg );
    editSection.append( btn );
};

const getHeading = ( sectionId ) => {
    // do not search using "#id" for two reasons. one, the article might
    // re-use the same heading elsewhere and thus have two of the same ID.
    // two, unicode headings are escaped ("è" becomes ".C3.A8") and the dot
    // is interpreted by JQuery to indicate a child pattern unless it is
    // escaped
    const $nodeWithId = $(`[id="${sectionId}"]`);
    if ( $nodeWithId.is( 'h2' )  ) {
        return $nodeWithId;
    } else {
        return $nodeWithId.closest( 'h2' );
    }
};

const getSectionElement = ( $headingElement ) => {
    if ( $headingElement.is( '.section-heading' ) ) {
        return $headingElement.next( 'section.mw-h2section' );
    } else {
        return $headingElement.closest( 'div.mw-h2section, section' );
    }
};

/**
 * Place an "add listing" link at the top of each section heading next to
 * the "edit" link in the section heading.
 */
const addListingButtons = function( SECTION_TO_TEMPLATE_TYPE, addMsg = '' ) {
    const useButton = mw.config.get( 'skin' ) === 'minerva';
    for (let sectionId in SECTION_TO_TEMPLATE_TYPE) {
        const topHeading = getHeading( sectionId );
        if (topHeading.length) {
            insertAddListingPlaceholder(topHeading, addMsg, useButton );
            const parentHeading = getSectionElement( topHeading );
            $('h3', parentHeading).each(function() {
                insertAddListingPlaceholder(this, addMsg, useButton );
            });
        }
    }
};

var contentTransform$1 = {
    addListingButtons,
    wrapContent,
    insertAddListingPlaceholder
};

// map section heading ID to the listing template to use for that section
var sectionToTemplateType$1 = function ( DB_NAME = 'enwikivoyage' ) {
    switch ( DB_NAME ) {
        case 'frwikivoyage':
            return {
                Aller: 'Aller',
                Circuler: 'Circuler',
                Voir: 'Voir',
                Faire: 'Faire',
                Acheter: 'Acheter',
                Manger: 'Manger',
                Communiquer: 'Listing',
                'Boire_un_verre_.2F_Sortir': 'Sortir',
                Sortir: 'Sortir',
                Se_loger: 'Se loger',
                'S.C3.A9curit.C3.A9': 'Listing',
                'G.C3.A9rer_le_quotidien': 'Représentation diplomatique',
                Villes: 'Ville',
                Autres_destinations: 'Destination',
                Aux_environs: 'Destination'
            };
        case 'itwikivoyage':
            return {
                'Cosa_vedere': 'see',
                'Cosa_fare': 'do',
                'Acquisti': 'buy',
                'Dove_mangiare': 'eat',
                'Come_divertirsi': 'drink',
                'Dove_alloggiare': 'sleep',
                'Eventi_e_feste': 'listing',
                'Come arrivare': 'listing',
                'Come spostarsi': 'listing'
            };
        default:
            return {
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
                'Anreise': 'station', // go
                'Mobilität': 'public transport', // go
                'Sehenswürdigkeiten': 'monument', // see
                'Aktivitäten': 'sports', // do
                'Einkaufen': 'shop', // buy
                'Küche': 'restaurant', // eat
                'Nachtleben': 'bar', // drink
                // dummy line (es) // drink and night life
                'Unterkunft': 'hotel', // sleep
                'Lernen': 'education', // education
                'Arbeiten': 'administration', // work
                'Sicherheit': 'administration', // security
                'Gesundheit': 'health', // health
                'Praktische_Hinweise': 'office' // practicalities
            };
    }
};

const contentTransform = contentTransform$1;
const sectionToTemplateType = sectionToTemplateType$1;

$(function() {
	const USE_LISTING_BETA = window.__USE_LISTING_EDITOR_BETA__;
	const GADGET_NAME = USE_LISTING_BETA ? 'ext.gadget.ListingEditorMainBeta' :
		'ext.gadget.ListingEditorMain';
	const GADGET_CONFIG_NAME = 'ext.gadget.ListingEditorConfig';
	var DEV_NAMESPACE = 9000;

	// (oldid=4687849)[[Wikivoyage:Travellers%27_pub#c-WhatamIdoing-20230630083400-FredTC-20230630053700]]
	if ( !USE_LISTING_BETA && mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}

	// --------------------------------------------------------------------
	// UPDATE THE FOLLOWING TO MATCH WIKIVOYAGE ARTICLE SECTION NAMES
	// --------------------------------------------------------------------

	var DB_NAME = mw.config.get( 'wgDBname' );
	const SECTION_TO_TEMPLATE_TYPE = sectionToTemplateType( DB_NAME );
	// selector that identifies the HTML elements into which the 'edit' link
	// for each listing will be placed
	var EDIT_LINK_CONTAINER_SELECTOR = 'span.listing-metadata-items';
	var MODE_EDIT = 'edit';

	// List of namespaces where the editor is allowed
	var ALLOWED_NAMESPACE = [
		0, //Main
		2, //User
		4 //Wikivoyage
	];

	// For development purposes, if localhost is detected, support namespace 9000.
	if ( window.location.host.indexOf( 'localhost' ) > -1 ) {
		ALLOWED_NAMESPACE.push( DEV_NAMESPACE );
	}

	// If any of these patterns are present on a page then no 'add listing'
	// buttons will be added to the page
	const DISALLOW_ADD_LISTING_IF_PRESENT = ( function () {
		switch ( DB_NAME ) {
			case 'frwikivoyage':
				return [ '#R\u00E9gions', '#\u00EEles' ];
			case 'itwikivoyage':
				return  ['#Centri_urbani', '#Altre_destinazioni'];
			default:
				return ['#Cities', '#Other_destinations', '#Islands', '#print-districts' ];
		}
	} () );

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
			addBeta: 'add listing (beta)',
			edit: 'edit',
			editBeta: 'edit (beta)'
		},
		de: {
			add: 'Eintrag hinzufügen',
			edit: 'bearbeiten',
			addBeta: 'Eintrag hinzufügen (beta)',
			editBeta: 'bearbeiten  (beta)'
		},
		it: {
			add: 'aggiungi elemento',
			edit: 'modifica',
			addBeta: 'aggiungi elemento (beta)',
			editBeta: 'modifica (beta)'
		}
	};
	var TRANSLATIONS = $.extend( true,
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
		// allow development
		if ( location.host.includes( 'localhost' ) ) {
			return true;
		}
		if ( namespace === DEV_NAMESPACE ) {
			return true;
		}
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

	const wrapContent = contentTransform.wrapContent;

	var isLoaded = false;
	function importForeignModule() {
		if ( isLoaded ) {
			return Promise.resolve( mw.loader.require );
		} else if (  mw.loader.getState( GADGET_NAME ) !== 'ready' ) {
			isLoaded = true;
			if ( mw.loader.getState( GADGET_NAME ) === null ) {
				return new Promise( function ( resolve ) {
					mw.loader.addScriptTag( `https://en.wikivoyage.org/w/load.php?modules=${GADGET_NAME}`, function () {
						setTimeout( function () {
							resolve( mw.loader.require );
						}, 300 );
					} );
				} );
			} else {
				// use the local gadget
				return mw.loader.using( `${GADGET_NAME}` ).then( () => mw.loader.require );
			}
		}
	}

	function loadMain() {
		const localModuleForDebugging = window._listingEditorModule;
		return Promise.all( [
			localModuleForDebugging ? Promise.resolve() : importForeignModule(),
			mw.loader.using( GADGET_CONFIG_NAME )
		] ).then( function ( args ) {
			var req = args[ 1 ];
			var config = req( GADGET_CONFIG_NAME );
			var module = localModuleForDebugging || req( GADGET_NAME );
			return module( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, config );
		} );
	}

	/**
	 * Place an "edit" link next to all existing listing tags.
	 */
	var addEditButtons = function() {
		const editMsg = USE_LISTING_BETA ? TRANSLATIONS.editBeta : TRANSLATIONS.edit;
		var editButton = $('<span class="vcard-edit-button noprint">')
			.html(`<a href="javascript:" class="listingeditor-edit">${editMsg}</a>` )
			.on('click', function() {
				var $this = $(this);
				loadMain().then( function ( core ) {
					core.initListingEditorDialog(MODE_EDIT, $this);
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

	let setup = false;
	/**
	 * Called on DOM ready, this method initializes the listing editor and
	 * adds the "add/edit listing" links to sections and existing listings.
	 */
	var initListingEditor = function() {
		if (!listingEditorAllowedForCurrentPage()) {
			return;
		}
		wrapContent();
		const init = () => {
			setup = true;
			if ($(DISALLOW_ADD_LISTING_IF_PRESENT.join(',')).length > 0) {
				return false;
			}
			contentTransform.addListingButtons(
				SECTION_TO_TEMPLATE_TYPE,
				USE_LISTING_BETA ? TRANSLATIONS.addBeta : TRANSLATIONS.add
			);
			$('.listingeditor-add').on('click', function() {
				const $this = $(this);
				loadMain().then( function ( core ) {
					core.initListingEditorDialog(core.MODE_ADD, $this);
				} );
			});
		};
		mw.hook( 'wikipage.content' ).add(
			init
		);
		setTimeout(() => {
			if ( !setup ) {
				init();
			}
		}, 1000);
		addEditButtons();
	};
	initListingEditor();
});

module.exports = GadgetListingEditor2023;
