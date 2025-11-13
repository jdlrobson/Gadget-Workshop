const { LANG } = require( './globalConfig.js' );

const parseWikiDataResult = function(jsonObj) {
    var results = [];
    for (var i=0; i < $(jsonObj.search).length; i++) {
        var result = $(jsonObj.search)[i];
        var label = result.label;
        if (result.match && result.match.text) {
            label = result.match.text;
        }
        var data = {
            value: label,
            label,
            description: result.description,
            id: result.id
        };
        results.push(data);
    }
    return results;
};

const setupWikidataAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
    $('#input-wikidata-label', form).autocomplete({
        // eslint-disable-next-line object-shorthand
        source: function( request, response ) {
            var ajaxUrl = SisterSite.API_WIKIDATA;
            var ajaxData = {
                action: 'wbsearchentities',
                search: request.term,
                language: LANG
            };
            var ajaxSuccess = function (jsonObj) {
                response(parseWikiDataResult(jsonObj));
            };
            SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
        },
        // eslint-disable-next-line object-shorthand
        select: function(event, ui) {
            $("#input-wikidata-value").val(ui.item.id);
            updateLinkFunction("", ui.item.id);
        }
    }).data("ui-autocomplete")._renderItem = function(ul, item) {
        var label = `${mw.html.escape(item.label)} <small>${mw.html.escape(item.id)}</small>`;
        if (item.description) {
            label += `<br /><small>${mw.html.escape(item.description)}</small>`;
        }
        return $("<li>").data('ui-autocomplete-item', item).append($("<a>").html(label)).appendTo(ul);
    };
};

const setupWikipediaAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
    var wikipediaSiteData = {
        apiUrl: SisterSite.API_WIKIPEDIA,
        selector: $('#input-wikipedia', form),
        form,
        ajaxData: {
            namespace: 0
        },
        updateLinkFunction
    };
    SisterSite.initializeSisterSiteAutocomplete(wikipediaSiteData);
};


const setupCommonsAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
    var commonsSiteData = {
        apiUrl: SisterSite.API_COMMONS,
        selector: $('#input-image', form),
        form,
        ajaxData: {
            namespace: 6
        },
        updateLinkFunction
    };
    SisterSite.initializeSisterSiteAutocomplete(commonsSiteData);
};

module.exports = ( SisterSite, form, wikidataLink, wikipediaLink, commonsLink ) => {
    setupWikidataAutocomplete( SisterSite, form, wikidataLink );
    setupWikipediaAutocomplete( SisterSite, form, wikipediaLink );
    setupCommonsAutocomplete( SisterSite, form, commonsLink );
};
