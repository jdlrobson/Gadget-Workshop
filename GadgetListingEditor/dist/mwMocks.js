class Api {
	ajax() {
        return fetch( 'https://en.wikivoyage.org/w/api.php?prop=revisions&format=json&formatversion=2&titles=Nottingham&action=query&rvprop=content&origin=*&rvsection=13&_=1761973213801')
            .then((r) => r.json());
    }
    postWithToken() {
        return Promise.resolve( {
            edit: {
                result: 'Success'
            }
        });
    }
}
mw.Api = Api;

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
