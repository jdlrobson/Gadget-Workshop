const updateWikidataInputLabel = ( label ) => {
    if (label === null) {
        label = "";
    }
    $("#input-wikidata-label").val(label);
};

const wikidataRemove = function(form) {
    $("#input-wikidata-value", form).val("");
    $("#input-wikidata-label", form).val("");
    $("#wikidata-value-display-container", form).hide();
    $('#div_wikidata_update', form).hide();
};

const sisterSiteLinkDisplay = function(siteLinkData, form, translate) {
    const value = $(siteLinkData.inputSelector, form).val();
    const placeholderWD = $(siteLinkData.inputSelector, form).attr('placeholder');
    const placeholderDef = translate( `placeholder-${siteLinkData.inputSelector.substring(7)}` ); //skip #input-
    if ( !placeholderWD || !value && (placeholderDef == placeholderWD) ) {
        $(siteLinkData.containerSelector, form).hide();
    } else {
        const link = $("<a />", {
            target: "_new",
            href: siteLinkData.href,
            title: siteLinkData.linkTitle,
            text: siteLinkData.linkTitle
        });
        $(siteLinkData.linkContainerSelector, form).html(link);
        $(siteLinkData.containerSelector, form).show();
    }
};

const updateFieldIfNotNull = function(selector, value, placeholderBool) {
    if ( value !== null ) {
        if ( placeholderBool !== true ) {
            $(selector).val(value);
        } else {
            $(selector).val('').attr('placeholder', value).attr('disabled', true);
        }
    }
};

const setWikidataInputFields = ( wikidataID ) => {
    $("#input-wikidata-value").val(wikidataID);
    $("#input-wikidata-label").val(wikidataID);
};

const showWikidataFields = () => {
    $('#div_wikidata_update').show();
    $('#wikidata-remove').show();
    $('#input-wikidata-label').prop('disabled', false);
};

const hideWikidataFields = () => {
    $('#div_wikidata_update').hide();
    $('#wikidata-remove').hide();
    $('#input-wikidata-label').prop('disabled', true);
};

module.exports =  {
    setWikidataInputFields,
    showWikidataFields,
    hideWikidataFields,
    updateFieldIfNotNull,
    sisterSiteLinkDisplay,
    wikidataRemove,
    updateWikidataInputLabel
};
