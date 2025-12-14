const contentTransform = require( './contentTransform' );
const sectionToTemplateType = require( './sectionToTemplateType' );
const { MODE_ADD, MODE_EDIT } = require( './mode.js' );

$(function() {
	const USE_LISTING_BETA = mw.storage.get( 'gadget-listing-beta' );
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

	let config;
	function loadConfig() {
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
			return loadConfig().then( ( _config ) => {
				sectionToTemplateTypeFn = sectionToTemplateType( _config, DB_NAME );
				return sectionToTemplateTypeFn;
			} );
		}
	}

	function loadMain() {
		const localModuleForDebugging = window._listingEditorModule;
		return Promise.all( [
			localModuleForDebugging ? Promise.resolve( mw.loader.require ) : importForeignModule(),
			loadConfig(),
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
			if ( setup ) {
				return;
			}
			setup = true;
			if ($(DISALLOW_ADD_LISTING_IF_PRESENT.join(',')).length > 0) {
				return false;
			}
			loadSectionToTemplateType().then( ( _sectionToTemplateType ) => {
				contentTransform.addListingButtons(
					_sectionToTemplateType,
					TRANSLATIONS.add
				);
			} );
			document.addEventListener( 'click', ( ev ) => {
				if ( !ev.target.matches( '.listingeditor-add' ) ) {
					return;
				}
				// dont collapse section on mobile.
				ev.stopPropagation();
				const $this = $(this);
				loadMain().then( function ( core ) {
					core.initListingEditorDialog(MODE_ADD, $this);
				} );
			}, true );
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
