/**
 * Listing Editor v4.5.1
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
window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ = '4.5.1'

'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var GadgetListingEditor2023$1 = {exports: {}};

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
var sectionToTemplateType$1 = function ( config ) {
    if ( config.sectionType ) {
        return config.sectionType;
    }
    throw new Error( `Please define config.sectionType in [[MediaWikiGadget-ListingEditor.json]].
Failure to do this will break future versions of the listing editor.
See https://en.wikivoyage.org/w/index.php?title=MediaWiki%3AGadget-ListingEditor.json for reference.` );
};

var mode = {
    MODE_ADD: 'add',
    MODE_EDIT: 'edit'
};

const contentTransform = contentTransform$1;
const sectionToTemplateType = sectionToTemplateType$1;
const { MODE_ADD, MODE_EDIT } = mode;

const fn = function() {
	const wgUserGroups = mw.config.get('wgUserGroups', [] ).concat(
		mw.config.get( 'wgGlobalGroups', [] )
	);
	const forceBeta = mw.user.isNamed() && wgUserGroups.includes('interface-admin') ||
		wgUserGroups.includes('autopatrolled') ||
		wgUserGroups.includes('patroller') ||
		wgUserGroups.includes('checkuser') || wgUserGroups.includes( 'global-interface-editor' ) ||
		wgUserGroups.includes( 'sysadmin' );
	const USE_LISTING_BETA = mw.storage.get( 'gadget-listing-beta' ) || forceBeta;
	const GADGET_DEPENDENCIES = [ 'vue', '@wikimedia/codex' ];
	const GADGET_NAME = USE_LISTING_BETA ? 'ext.gadget.ListingEditorMainBeta' :
		'ext.gadget.ListingEditorMain';
	const GADGET_CONFIG_NAME = 'ext.gadget.ListingEditorConfig';
	var DEV_NAMESPACE = 9000;

	// --------------------------------------------------------------------
	// UPDATE THE FOLLOWING TO MATCH WIKIVOYAGE ARTICLE SECTION NAMES
	// --------------------------------------------------------------------

	var DB_NAME = mw.config.get( 'wgDBname' );
	// selector that identifies the HTML elements into which the 'edit' link
	// for each listing will be placed
	var EDIT_LINK_CONTAINER_SELECTOR = 'span.listing-metadata-items';

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
			edit: 'edit'
		},
		id: {
			add: 'Tambah butir',
			edit: 'sunting'
		},
		de: {
			add: 'Eintrag hinzufügen',
			edit: 'bearbeiten'
		},
		it: {
			add: 'aggiungi elemento',
			edit: 'modifica'
		},
		he: {
			edit: ' עריכה '
		},
		fr: {
			edit: 'éditer'
		},
		vi: {
			add: 'thêm địa điểm',
			edit: 'sửa',
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
				return mw.loader.using( GADGET_DEPENDENCIES ).then( () => new Promise(
					( resolve ) => {
						mw.loader.addScriptTag( `https://en.wikivoyage.org/w/load.php?modules=${GADGET_NAME}`, function () {
							setTimeout( function () {
								resolve( mw.loader.require );
							}, 300 );
						} );
					}
				) );
			} else {
				// use the local gadget
				return mw.loader.using( `${GADGET_NAME}` ).then( () => mw.loader.require );
			}
		}
	}

	let config;
	function loadConfigFromSite() {
		if ( config ) {
			return Promise.resolve( config );
		} else {
			return mw.loader.using( GADGET_CONFIG_NAME ).then( ( req ) => {
				config = req( GADGET_CONFIG_NAME );
				return config;
			} );
		}
	}

	let sectionToTemplateTypeFn;
	function loadSectionToTemplateType() {
		if ( sectionToTemplateTypeFn ) {
			return Promise.resolve( sectionToTemplateTypeFn );
		} else {
			return loadConfigFromSite().then( ( _config ) => {
				sectionToTemplateTypeFn = sectionToTemplateType( _config );
				return sectionToTemplateTypeFn;
			} );
		}
	}

	function loadMain() {
		const localModuleForDebugging = window._listingEditorModule;
		return Promise.all( [
			localModuleForDebugging ? Promise.resolve( mw.loader.require ) : importForeignModule(),
			loadConfigFromSite(),
			loadSectionToTemplateType()
		] ).then( function ( [ req, _config, _sectionToTemplateType ] ) {
			const module = localModuleForDebugging || req( GADGET_NAME );
			return module( ALLOWED_NAMESPACE, _sectionToTemplateType, _config );
		} );
	}

	/**
	 * Place an "edit" link next to all existing listing tags.
	 */
	var addEditButtons = function() {
		const editMsg = TRANSLATIONS.edit;
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

	/**
	 * Called on DOM ready, this method initializes the listing editor and
	 * adds the "add/edit listing" links to sections and existing listings.
	 */
	var initListingEditor = function() {
		const $bodyContent = $('#bodyContent');
		const isAlreadyEnabled = () => $bodyContent.attr( 'data-listing-editor-enabled' );
		if (!listingEditorAllowedForCurrentPage() || isAlreadyEnabled()) {
			return;
		}
		wrapContent();
		$bodyContent.attr( 'data-listing-editor-enabled', '1' );
		loadSectionToTemplateType().then( ( _sectionToTemplateType ) => {
			contentTransform.addListingButtons(
				_sectionToTemplateType,
				TRANSLATIONS.add
			);
		} );

		if ($(DISALLOW_ADD_LISTING_IF_PRESENT.join(',')).length === 0) {
			document.addEventListener( 'click', ( ev ) => {
				if ( !ev.target.closest( '.listingeditor-add' ) ) {
					return;
				}
				// dont collapse section on mobile.
				ev.stopPropagation();
				const $this = $(ev.target);
				loadMain().then( function ( core ) {
					core.initListingEditorDialog(MODE_ADD, $this);
				} );
			}, true );
		}
		addEditButtons();
		mw.hook( 'wikipage.content' ).add(
			initListingEditor
		);
	};
	initListingEditor();
};

if ( typeof process === 'undefined' ) {
	$(fn);
} else {
	GadgetListingEditor2023$1.exports = fn;
}

var GadgetListingEditor2023Exports = GadgetListingEditor2023$1.exports;
var GadgetListingEditor2023 = /*@__PURE__*/getDefaultExportFromCjs(GadgetListingEditor2023Exports);

module.exports = GadgetListingEditor2023;
