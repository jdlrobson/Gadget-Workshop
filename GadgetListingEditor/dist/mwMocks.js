
mw.storage = {
    set: () => {},
    get: () => null
};

function escapeIdInternal( str, mode ) {
        str = String( str );

        switch ( mode ) {
                case 'html5':
                        return str.replace( / /g, '_' );
                case 'legacy':
                        return rawurlencode( str.replace( / /g, '_' ) )
                                .replace( /%3A/g, ':' )
                                .replace( /%/g, '.' );
                default:
                        throw new Error( 'Unrecognized ID escaping mode ' + mode );
        }
}

mw.util = {
    escapeIdForLink(str){
        return escapeIdInternal(str,'html5');
    }
}
