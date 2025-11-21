const { translate } = require( './translate.js' );
const renderI18nHtml = ( el, binding ) => {
    el.innerHTML = translate( binding.arg || binding.value )
};

module.exports = {
    mounted: renderI18nHtml
};
