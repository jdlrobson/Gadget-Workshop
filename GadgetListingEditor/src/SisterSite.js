
const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL,
    LANG,
    WIKIDATA_SITELINK_WIKIPEDIA } = require( './globalConfig.js' );
module.exports = function( Config ) {
    const { WIKIDATAID } = Config;
    var API_WIKIDATA = `${WIKIDATA_URL}/w/api.php`;
    var API_WIKIPEDIA = `${WIKIPEDIA_URL}/w/api.php`;
    var API_COMMONS = `${COMMONS_URL}/w/api.php`;
    var WIKIDATA_PROP_WMURL = 'P143'; // Wikimedia import URL
    var WIKIDATA_PROP_WMPRJ = 'P4656'; // Wikimedia project source of import

    var initializeSisterSiteAutocomplete = function(siteData) {
        var currentValue = $(siteData.selector).val();
        if (currentValue) {
            siteData.updateLinkFunction(currentValue, siteData.form);
        }
        $(siteData.selector).change(function() {
            siteData.updateLinkFunction($(siteData.selector).val(), siteData.form);
        });
        siteData.selectFunction = function(event, ui) {
            siteData.updateLinkFunction(ui.item.value, siteData.form);
        };
        var ajaxData = siteData.ajaxData;
        ajaxData.action = 'opensearch';
        ajaxData.list = 'search';
        ajaxData.limit = 10;
        ajaxData.redirects = 'resolve';
        var parseAjaxResponse = function(jsonObj) {
            var results = [];
            var titleResults = $(jsonObj[1]);
            for (var i=0; i < titleResults.length; i++) {
                var result = titleResults[i];
                var valueWithoutFileNamespace = (result.indexOf("File:") != -1) ? result.substring("File:".length) : result;
                var titleResult = { value: valueWithoutFileNamespace, label: result, description: $(jsonObj[2])[i], link: $(jsonObj[3])[i] };
                results.push(titleResult);
            }
            return results;
        };
        _initializeAutocomplete(siteData, ajaxData, parseAjaxResponse);
    };
    var _initializeAutocomplete = function(siteData, ajaxData, parseAjaxResponse) {
        var autocompleteOptions = {
            // eslint-disable-next-line object-shorthand
            source: function(request, response) {
                ajaxData.search = request.term;
                var ajaxSuccess = function(jsonObj) {
                    console.log('gpot', jsonObj);
                    response(parseAjaxResponse(jsonObj));
                };
                console.log('do ajaxData', siteData.apiUrl, ajaxData, ajaxSuccess)
                ajaxSisterSiteSearch(siteData.apiUrl, ajaxData, ajaxSuccess);
            }
        };
        if (siteData.selectFunction) {
            autocompleteOptions.select = siteData.selectFunction;
        }
        siteData.selector.autocomplete(autocompleteOptions);
    };
    // perform an ajax query of a sister site
    const ajaxSisterSiteSearch = function(ajaxUrl, ajaxData, ajaxSuccess = ( json ) => json ) {
        return $.ajax({
            url: ajaxUrl,
            data: Object.assign( ajaxData, {
                format: 'json',
                origin: '*'
            } )
        }).then( ajaxSuccess );
    };
    // parse the wikidata "claim" object from the wikidata response
    var wikidataClaim = function(jsonObj, value, property, guidBool) {
        var entity = _wikidataEntity(jsonObj, value);
        if (!entity || !entity.claims || !entity.claims[property]) {
            return null;
        }
        var propertyObj = entity.claims[property];
        if (!propertyObj || propertyObj.length < 1 || !propertyObj[0].mainsnak || !propertyObj[0].mainsnak.datavalue) {
            return null;
        }
        var index = 0;
        if( propertyObj[index].mainsnak.datavalue.type === "monolingualtext" ) { // have to select correct language, Wikidata sends all despite specifying
            while( propertyObj[index].mainsnak.datavalue.value.language !== LANG ) {
                index = index + 1;
                if( !(propertyObj[index]) ) { return null; } // if we run out of langs and none of them matched
            }
            if (guidBool === true) { return propertyObj[index].id }
            return propertyObj[index].mainsnak.datavalue.value.text;
        }
        if (guidBool === true) { return propertyObj[index].id }
        return propertyObj[index].mainsnak.datavalue.value;
    };
    // parse the wikidata "entity" object from the wikidata response
    var _wikidataEntity = function(jsonObj, value) {
        if (!jsonObj || !jsonObj.entities || !jsonObj.entities[value]) {
            return null;
        }
        return jsonObj.entities[value];
    };
    // parse the wikidata display label from the wikidata response
    var wikidataLabel = function(jsonObj, value) {
        var entityObj = _wikidataEntity(jsonObj, value);
        if (!entityObj || !entityObj.labels || !entityObj.labels.en) {
            return null;
        }
        return entityObj.labels.en.value;
    };
    // parse the wikipedia link from the wikidata response
    var wikidataWikipedia = function(jsonObj, value) {
        var entityObj = _wikidataEntity(jsonObj, value);
        if (!entityObj || !entityObj.sitelinks || !entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA] || !entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA].title) {
            return null;
        }
        return entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA].title;
    };

    var wikipediaWikidata = function(jsonObj) {
        if (!jsonObj || !jsonObj.query || jsonObj.query.pageids[0] == "-1" ) { // wikipedia returns -1 pageid when page is not found
            return null;
        }
        var pageID = jsonObj.query.pageids[0];
        return jsonObj['query']['pages'][pageID]['pageprops']['wikibase_item'];
    };
    var sendToWikidata = function(prop, value, snaktype) {
        var ajaxData = {
            action: 'wbcreateclaim',
            entity: $('#input-wikidata-value').val(),
            property: prop,
            snaktype,
            value,
            format: 'json',
        };
        var ajaxSuccess = function(jsonObj) {
            referenceWikidata(jsonObj);
        };
        var api = new mw.ForeignApi( API_WIKIDATA );
        api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} ); // async disabled because otherwise get edit conflicts with multiple changes submitted at once
    };
    var removeFromWikidata = function(guidObj) {
        var ajaxData = {
            action: 'wbremoveclaims',
            claim: guidObj,
        };
        var api = new mw.ForeignApi( API_WIKIDATA );
        api.postWithToken( 'csrf', ajaxData, { async: false } );
    };
    var changeOnWikidata = function(guidObj, prop, value, snaktype) {
        var ajaxData = {
            action: 'wbsetclaimvalue',
            claim: guidObj,
            snaktype,
            value
        };
        var ajaxSuccess = function(jsonObj) {
            if( jsonObj.claim ) {
                if( !(jsonObj.claim.references) ) { // if no references, add imported from
                    referenceWikidata(jsonObj);
                }
                else if ( jsonObj.claim.references.length === 1 ) { // skip if >1 reference; too complex to automatically set
                    var acceptedProps = [WIKIDATA_PROP_WMURL, WIKIDATA_PROP_WMPRJ]; // properties relating to Wikimedia import only
                    var diff = $(jsonObj.claim.references[0]['snaks-order']).not(acceptedProps).get(); // x-compatible method for diff on arrays, from https://stackoverflow.com/q/1187518
                    if( diff.length === 0 ) { // if the set of present properties is a subset of the set of acceptable properties
                        unreferenceWikidata(jsonObj.claim.id, jsonObj.claim.references[0].hash); // then remove the current reference
                        referenceWikidata(jsonObj); // and add imported from
                    }
                }
            }
        };
        var api = new mw.ForeignApi( API_WIKIDATA );
        api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
    };
    var referenceWikidata = function(jsonObj) {
        var revUrl = `https:${mw.config.get('wgServer')}${mw.config.get('wgArticlePath').replace('$1', '')}${mw.config.get('wgPageName')}?oldid=${mw.config.get('wgCurRevisionId')}`; // surprising that there is no API call for this
        var ajaxData = {
            action: 'wbsetreference',
            statement: jsonObj.claim.id,
            snaks: `{"${WIKIDATA_PROP_WMURL}":[{"snaktype":"value","property":"${WIKIDATA_PROP_WMURL}","datavalue":{"type":"wikibase-entityid","value":{"entity-type":"item","numeric-id":"${WIKIDATAID}"}}}],` +
                `"${WIKIDATA_PROP_WMPRJ}": [{"snaktype":"value","property":"${WIKIDATA_PROP_WMPRJ}","datavalue":{"type":"string","value":"${revUrl}"}}]}`,
        };
        var api = new mw.ForeignApi( API_WIKIDATA );
        api.postWithToken( 'csrf', ajaxData, { async: false } );
    };
    var unreferenceWikidata = function(statement, references) {
        var ajaxData = {
            action: 'wbremovereferences',
            statement,
            references
        };
        var api = new mw.ForeignApi( API_WIKIDATA );
        api.postWithToken( 'csrf', ajaxData, { async: false } );
    };
    // expose public members
    return {
        API_WIKIDATA,
        API_WIKIPEDIA,
        API_COMMONS,
        initializeSisterSiteAutocomplete,
        ajaxSisterSiteSearch,
        wikidataClaim,
        wikidataWikipedia,
        wikidataLabel,
        wikipediaWikidata,
        sendToWikidata,
        removeFromWikidata,
        changeOnWikidata,
        referenceWikidata,
        unreferenceWikidata
    };
};
