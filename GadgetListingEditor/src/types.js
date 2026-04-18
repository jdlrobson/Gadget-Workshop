/**
 * @typedef {Object} ListingTemplateParameterConfig
 * @property {string} id
 * @property {string|null} [hideDivIfEmpty]
 * @property {boolean} [skipIfEmpty]
 * @property {boolean} [newline]
 */
/**
 * @typedef {Record<string, ListingTemplateParameterConfig>} ListingTemplateParametersConfig
 */
/**
 * @typedef {Record<string, ListingTemplateParametersConfig>} ListingTemplateConfig
 */
/**
 * @typedef {Object} ListingConfig
 * @property {boolean} SHOW_LAST_EDITED_FIELD
 * @property {string[]} SUPPORTED_SECTIONS
 * @property {Record<string, string>} sectionType
 * @property {string} iata
 * @property {number} COORD_PRECISION
 * @property {string} listingTypeRegExp
 * @property {boolean} APPEND_FULL_STOP_TO_DESCRIPTION
 * @property {boolean} REPLACE_NEW_LINE_CHARS
 * @property {string[]} LISTING_TEMPLATES_OMIT
 * @property {boolean} VALIDATE_CALLBACKS_EMAIL
 * @property {boolean} SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT
 * @property {boolean} ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP
 * @property {string} LISTING_TYPE_PARAMETER
 * @property {string} LISTING_CONTENT_PARAMETER
 * @property {string} DEFAULT_LISTING_TEMPLATE
 * @property {ListingTemplateParametersConfig} SLEEP_TEMPLATE_PARAMETERS
 * @property {ListingTemplateParametersConfig} LISTING_TEMPLATE_PARAMETERS
 * @property {string} WIKIDATAID
 * @property {string[]} SPECIAL_CHARS
 * @property {ListingTemplateConfig} LISTING_TEMPLATES
 * @property {ListingWikidataClaims} WIKIDATA_CLAIMS
 */
/**
 * @typedef {Record<string, Object>} ListingWikidataClaims
*/
