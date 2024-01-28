function load() {
    return mw.loader.using( 'jquery.ui' );
}

function destroy( selector ) {
    load().then( () => $(selector).dialog( 'destroy' ).remove() );
}

function open( $element, options ) {
    load().then( () => $element.dialog(options));
}

/**
 * Closes dialog, also triggers dialogclose event.
 * @param {string} selector
 */
function close( selector ) {
    load().then( () => $(selector).dialog('close') );
}

module.exports = {
    destroy,
    open,
    close
};
