$(function() {
	// (oldid=4687849)[[Wikivoyage:Travellers%27_pub#c-WhatamIdoing-20230630083400-FredTC-20230630053700]]
	if ( mw.config.get( 'skin' ) === 'minerva' ) {
		return;
	}
	mw.loader.using( 'ext.gadget.ListingEditorMain' ).then( function () {
		Core.init();
	} );
});
