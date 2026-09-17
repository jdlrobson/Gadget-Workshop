const { translate } = require( './translate.js' );

/**
 * @param {HTMLElement} el
 * @param {Object<any,any>} binding
 */
const renderI18nHtml = ( el, binding ) => {
    el.innerHTML = translate( binding.arg || binding.value );
};

module.exports = {
    mounted: renderI18nHtml
};
