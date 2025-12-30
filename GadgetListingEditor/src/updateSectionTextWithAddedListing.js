const { translate } = require( './translate.js' );
const restoreComments = require( './restoreComments.js' );
const DB_NAME = mw.config.get( 'wgDBname' );
const { getSectionText, setSectionText } = require( './currentEdit.js' );

/**
 * After the listing has been converted to a string, add additional
 * processing required for adds (as opposed to edits), returning an
 * appropriate edit summary string.
 */
const updateSectionTextWithAddedListingDefault = function(originalEditSummary, listingWikiText) {
    let sectionText = getSectionText();
    var summary = originalEditSummary;
    summary += translate( 'added' );
    // add the new listing to the end of the section. if there are
    // sub-sections, add it prior to the start of the sub-sections.
    var index = sectionText.indexOf('===');
    if (index === 0) {
        index = sectionText.indexOf('====');
    }
    if (index > 0) {
        sectionText = `${sectionText.substr(0, index)}* ${listingWikiText
                    }\n${sectionText.substr(index)}`;
    } else {
        sectionText += `\n* ${listingWikiText}`;
    }
    sectionText = restoreComments(sectionText, true);
    setSectionText( sectionText );
    return summary;
};

const updateSectionTextWithAddedListingIt = function (originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER) {
    let sectionText = getSectionText();
    var summary = originalEditSummary;
    sectionText = restoreComments(sectionText, true);
    setSectionText( sectionText );
    summary += translate( 'added' );
    //Creo un listing commentato dello stesso tipo di quello che aggiungerò.
    //Se nella sezione in cui andrò a scrivere troverò questo listing commentato, lo rimpiazzerò col nuovo.
    var commentedListing = `<!--* {{${listing[LISTING_TYPE_PARAMETER]}\n| nome= | alt= | sito= | email=\n| indirizzo= | lat= | long= | indicazioni=\n| tel= | numero verde= | fax=\n|`;
    if (listing[LISTING_TYPE_PARAMETER] !== 'sleep') {
        commentedListing += " orari= | prezzo=\n";
    } else {
        commentedListing += " checkin= | checkout= | prezzo=\n";
    }
    commentedListing += "| descrizione=\n}}-->\n";
    var index = 0;
    var index1 = sectionText.indexOf('===');
    var index2 = sectionText.indexOf('<!--===');
    var index3 = sectionText.indexOf('====');
    var index4 = sectionText.indexOf(`=== ${translate( 'budget' )} ===`);
    var index5 = sectionText.indexOf(`<!--=== ${translate( 'midrange' )} ===-->`);
    var index6 = sectionText.indexOf(`=== ${translate( 'splurge' )} ===`);
    var index7 = sectionText.indexOf(`<!--=== ${translate( 'splurge' )} ===`);
    var splurgeOffset = 0;
    if (index7 > 0) {
        splurgeOffset = 4;
    }
    if ( (index1 === 0) && (index2 === 0) ) {
        index = index3;
    } else if (index1 === 0) {
        index = index2;
    } else if (index2 === 0) {
        index = index1;
    } else if (index1 < index2) {
        index = index1;
    } else if (index6 > 0) {
        index = index6;
    } else {
        index = index2;
    }
    if (index > 0) {
        var strApp = sectionText.substr(0, index).replace(/(\r\n|\n|\r)/gm," ").trim();
        if (strApp.substring(strApp.length-5) == '{{-}}') {
            var indexApp = sectionText.lastIndexOf('{{-}}');
            sectionText = `${sectionText.substr(0, indexApp).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}${sectionText.substr(indexApp+5)}`;
        } else {
            if( (index4 > 0) && (index6 > 0) ) {
                //Mi assicuro di essere in Dove mangiare/dormire (le uniche divise per fascia di prezzo)
                if ( index5 > 0) {
                    //Il primo elemento viene aggiunto nella sottosezione "Prezzi medi" (rimuovendone il commento)
                    sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(`<!--=== ${translate( 'midrange' )} ===-->\n${commentedListing}`,`=== ${translate( 'midrange' )} ===\n`)}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
                } else {
                    //I successivi elementi vengono accodati nella sottosezione "Prezzi medi" (già priva di commento)
                    sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(/\n+$/,'\n')}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
                }
            } else {
                var addbr = '';
                if( sectionText.substr(index-2, 1).charCodeAt(0) != 10 )
                    addbr = '\n';
                sectionText = `${sectionText.substr(0, index-1).replace(commentedListing,'') + addbr}* ${listingWikiText}\n${sectionText.substr(index-1)}`;
            }
        }
    } else {
        var strApp2 = sectionText.replace(/(\r\n|\n|\r)/gm," ").trim();
        if (strApp2.substring(strApp2.length-5) == '{{-}}') {
            var indexApp2 = sectionText.lastIndexOf('{{-}}');
            sectionText = `${sectionText.substr(0, indexApp2).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}`;
        } else {
            sectionText = `${sectionText.replace(commentedListing,'')}\n* ${listingWikiText}`;
        }
    }
    setSectionText( sectionText );
    return summary;
};

const updateSectionTextWithAddedListing = function (originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER) {
    switch ( DB_NAME ) {
        case 'itwikivoyage':
            return updateSectionTextWithAddedListingIt(originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER);
        default:
            return updateSectionTextWithAddedListingDefault(originalEditSummary, listingWikiText, listing);
    }
};

updateSectionTextWithAddedListing.test = {
    updateSectionTextWithAddedListingIt
};


module.exports = updateSectionTextWithAddedListing;
