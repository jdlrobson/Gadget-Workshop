const { prepareSyncUrl } = require( './makeSyncLinks.js' );
const parseDMS = require( './parseDMS.js' );
const trimDecimal = require( './trimDecimal.js' );
const { getWikidataClaims, getListingTemplateConfiguration } = require( './Config.js' );

/**
 * @param {RadioDefinitionField} field
 * @param {(string)[]} claimValue
 * @param {string|null} guid
 * @return {RadioDefinition}
 */
const prepareRadio = function(field, claimValue, guid) {
    const LISTING_TEMPLATES = getListingTemplateConfiguration();
    const WIKIDATA_CLAIMS = getWikidataClaims();

    var j = 0;
    for (j = 0; j < claimValue.length; j++) {
        if( claimValue[j] === null ) {
            claimValue[j] = '';
        }
    }
    field.label = field.label.split(/(\s+)/)[0]; // take first word
    var editorField = [];
    var remoteFlag = false;
    for ( var i = 0; i < field.fields.length; i++ ) {
        editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`;
    }
    // NOTE: this assumes a standard listing type. If ever a field in a nonstandard listing type is added to Wikidata sync, this must be changed

    for (j = 0; j < claimValue.length; j++) {
        // compare the present value to the Wikidata value
        if ( field.p === WIKIDATA_CLAIMS.coords.p) {
        //If coords, then compared the values after trimming the WD one into decimal and converting into decimal and trimming the present one
            // @ts-ignore jQuery.val can return non-string
            if((trimDecimal(Number(claimValue[j]), 6) != trimDecimal(parseDMS($(editorField[j]).val()), 6)) ) {
                break;
            }
        } else if ( field.p === WIKIDATA_CLAIMS.image.p) {
        //If image, then compared the values after converting underscores into spaces on the local value
            // @ts-ignore jQuery.val can return non-string
            if( claimValue[j] != $(editorField[j]).val().replace(/_/g, ' ') ) {
                break;
            }
        } else if( claimValue[j] != $(editorField[j]).val() ) {
            break;
        }
    }

    // if remotely synced, and there aren't any value(s) here or they are identical, skip with a message
    // also create an invisible radio button so that updateFieldIfNotNull is called
    if ( (field.remotely_sync === true) && ( j === claimValue.length || ( ( $(editorField[0]).val() === '' ) && ( ($(editorField[1]).val() === '' ) || ($(editorField[1]).val() === undefined) ) ) ) ) {
        remoteFlag = true;
    }

    const propertyCode = field.p;
    const hasSyncLink = propertyCode && [
        WIKIDATA_CLAIMS.coords.p,
        WIKIDATA_CLAIMS.url.p,
        WIKIDATA_CLAIMS.image.p
    ].indexOf(
        propertyCode
    ) >= 0;
    return {
        field,
        wikidataUrl: hasSyncLink ? prepareSyncUrl( claimValue, propertyCode, false) : undefined,
        localUrl: hasSyncLink ? prepareSyncUrl(editorField, propertyCode, true): undefined,
        editorField,
        skip: ( j === claimValue.length && field.remotely_sync !== true ) ||
            ( field.doNotUpload === true && claimValue[0] === '' ),
        claimValue,
        guid,
        remoteFlag,
        wikidataText: claimValue.map( a => a ).join( '\n' ),
        localText: editorField.map( ( selector ) => $(selector).val() ).join( '\n' )
    };
};

module.exports = prepareRadio;
