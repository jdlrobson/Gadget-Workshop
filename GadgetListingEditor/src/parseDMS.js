/**
 * Convert splitted elements of coordinates in DMS notation into DD notation.
 * If the input is already in DD notation (i.e. only degrees is a number), input value is returned unchanged.
 * Notes:
 * 1) Each D, M & S is checked to be a valid number plus M & S are checked to be in a valid range. If one parameter is not valid, NaN (Not a Number) is returned
 * 2) Empty string (provided from initial parsing section in parseDMS) are considered valid by isNaN function (i.e. isNaN('') is false)
 */
var convertDMS2DD = function(degrees, minutes, seconds, direction) {
    var dd = NaN;
    if( isNaN(degrees) )
        return NaN;
    else {
        degrees = Number(degrees);
        if( degrees <= -180 || degrees > 180 )
            return NaN;
        else
            dd = degrees;
    }
    if( isNaN(minutes) )
        return NaN;
    else {
        degrees = Number(minutes);
        if( minutes < 0 || minutes >= 60 )
            return NaN;
        else
            dd = dd + minutes/60;
    }
    if( isNaN(seconds) )
        return NaN;
    else {
        degrees = Number(seconds);
        if( seconds < 0 || seconds >= 60 )
            return NaN;
        else
            dd = dd + seconds/(3600);
    }
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
};

/**
 * Parse coordinates in DMS notation, to convert it into DD notation in Wikidata format (i.e. without "°" symbol).
 * If the input is already in DD notation, input value is returned unchanged.
 * Notes:
 * 1) Common notation is use as a proforma for potential future use because the split currently works to be more flexible skipping any char that is not a number, a minus, a dot or a cardinal point
 * 2) Missing parts are forced to be empty to use a common approach, altough M & S could be also "0" in fact North America coords 48°N 100°W are equivalent to 48° 0' 0" N, 100° 0' 0" W,
 *    but for compatibility with the DD notation where there is no alternative way to write it (i.e. 48° -100°), so the following parts are just empty, not 0
 * 3) The parsed parts could have also erroneous data if the input is badly formatted (e.g. 48°EE'00"N 100°00'4000""W"), but these checks will be performed inside convertDMS2DD
 */
var parseDMS = function(input) {
    // Uniform alternative notation, into one common notation DD° MM' SS" [NSEW], then the DMS components are splitted into its 4 atomic component
    var parts = input.toString()
        .replace(/[‘’′]/g, "'")
        .replace(/[“”″]/g, '"')
        .replace(/''/g, '"')
        .replace(/−/g, '-')
        .replace(/[_/\t\n\r]/g, " ")
        .replace(/\s/g, '')
        .replace(/([°'"])/g,"$1 ")
        .replace(/([NSEW])/gi, function(v) { return ` ${v.toUpperCase()}`; })
        // eslint-disable-next-line no-useless-escape
        .replace(/(^ [NSEW])(.*)/g,"$2$1").split(/[^\d\w\.-]+/);
    for (var i=0; i<4; i++)
        if( !parts[i] )
            parts[i] = '';
    return convertDMS2DD( parts[0], parts[1], parts[2], parts[3] );
};

module.exports = parseDMS;
