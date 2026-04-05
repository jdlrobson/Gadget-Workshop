const missingTranslations = require( './src/missingTranslations.js' );
const languages = ['it', 'fr', 'he', 'id', 'it', 'vi' ];
languages.forEach((lang) => {
    console.log( `Language: ${lang}` );
    console.log(missingTranslations( lang ));
});