const mapSearchResult = ( results ) => {
    return ( results[1] || [] ).map( ( result ) => {
        return {
            value: result.indexOf( 'File:' ) !== -1 ? result.substring( 'File:'.length ) : result,
            label: result
        };
    } );
};

module.exports = mapSearchResult;
