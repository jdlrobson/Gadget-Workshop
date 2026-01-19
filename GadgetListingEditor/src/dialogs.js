const createApp = require( './createApp' );

function close() {
    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
}

function render( Dialog, options ) {
    const vueAppContainer = document.createElement( 'div' );
    document.body.appendChild(vueAppContainer);
    const app = createApp(
        Dialog,
        Object.assign( {}, options || {}, {
            onClose: () => {
                close();
            }
        } )
    );
    app.mount( vueAppContainer );
    document.documentElement.classList.add( 'listing-editor-dialog-open' );
    vueAppContainer.focus();
    return {
        unmount: () => {
            app.unmount();
            close();
        }
    }
}

module.exports = {
    render
};
