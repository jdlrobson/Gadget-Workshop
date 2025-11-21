const mapSearchResult = ( results ) => {
    return ( results[1] || [] ).map( ( result ) => {
        const value = result.indexOf( ':' ) === -1 ? result : result.split( ':' )[ 1 ];
        return {
            value,
            label: value
        };
    } );
};

module.exports = mapSearchResult;
