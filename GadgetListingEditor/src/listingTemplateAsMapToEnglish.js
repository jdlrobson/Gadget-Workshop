const { getConfig } = require( './Config' );
/*
{
    "tipo": "see",
    "nome": "Duomo Normanno",
    "alt": "",
    "sito": "http://www.comune.naro.ag.it/libro3.htm",
    "email": "",
    "indirizzo": "",
    "lat": "37.29683",
    "long": "13.795193",
    "indicazioni": "",
    "tel": "",
    "numero verde": "",
    "fax": "",
    "orari": "",
    "prezzo": "",
    "wikidata": "Q3716372",
    "descrizione": "Esso venne edificato nel 1089 ad opera di Ruggero D'Altavilla al di sopra di una preesistente moschea araba poco dopo la conquista normanna di Naro avvenuta nel 1086 e venne dedicato a Maria Santissima Assunta dagli Angeli. Venne elevato a Chiesa Madre, ad opera di Gualtiero Offmill Arcivescovo di Palermo, nel 1174, anno in cui venne abbandonato il rito ortodosso nella Chiesa di San Nicolò di Bari. Il portale d'ingresso è di epoca chiaramontana e presenta un caratteristico arco a sesto acuto poggiato sopra un gruppo di quattordici colonnine, riccamente modulato ed ornato da zig-zag e palmette.\n:Nel 1889 venne destinato a cimitero dei morti di colera e le opere custodite al suo interno furono per la maggior parte portate in altre chiese. Il Duomo, restaurato nei primi anni del secolo XXI è stato fortemente destabilizzato dall'evento franoso che colpì il centro abitato il 4 febbraio 2005 ed è attualmente puntellato e non fruibile al pubblico."
}
    */

module.exports = ( map ) => {
    const { LISTING_TEMPLATE_PARAMETERS } = getConfig();
    const enMap = {};
    Object.keys( LISTING_TEMPLATE_PARAMETERS ).forEach( ( key ) => {
        const { id } = LISTING_TEMPLATE_PARAMETERS[ key ]
        // strip input to get associated parameter name.
        enMap[ id.replace( 'input-', '' ) ] = map[ key ];
    } );
    return enMap;
};
