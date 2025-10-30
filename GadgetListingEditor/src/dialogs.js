function load() {
    return mw.loader.using( 'jquery.ui' );
}

function destroy( selector ) {
    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
    load().then( () => $(selector).dialog( 'destroy' ).remove() );
}

function open( $element, options ) {
    load().then( () => $element.dialog(options));
    document.documentElement.classList.add( 'listing-editor-dialog-open' );
}

/**
 * Closes dialog, also triggers dialogclose event.
 * @param {string} selector
 */
function close( selector ) {
    load().then( () => $(selector).dialog('close') );
    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
}

module.exports = {
    destroy,
    open,
    close
};
