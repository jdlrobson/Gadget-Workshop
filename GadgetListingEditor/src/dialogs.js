const createApp = require( './createApp' );
const { nextTick } = require( 'vue' );

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
    nextTick(() => {
        vueAppContainer.focus();
            const input_name = document.getElementById('input-name');
            if (input_name && typeof input_name.focus === 'function') {
                input_name.focus();
            } else {
                vueAppContainer.setAttribute('tabindex', '-1');
                    vueAppContainer.focus();
            }
    } );
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
