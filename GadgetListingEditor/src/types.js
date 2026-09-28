
/**
 * @callback TranslationFunction
 * @param {string} name - The name of the user.
 * @param {string[]} params
 * @return {string}
 */
/**
 * @typedef {Object} ListingWikidataClaimValue
 * @property {string} p
 * @property {string} label
 * @property {string[]} fields
 * @property {boolean} [remotely_sync]
 * @property {boolean} [doNotUpload]
 */
/**
 * @typedef {Record<string, ListingWikidataClaimValue>} ListingWikidataClaims
*/
/**
 * @typedef {Object} ListingTemplateParameterConfig
 * @property {string} id
 * @property {string} label
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
 * @property {boolean} SHOW_LAST_EDITED_FIELD whether to show the last edited field
 *  on listings.
 * @property {boolean} WIKIDATA_SYNC_PLACEHOLDER When true, fields that
 *   Wikidata can supply dynamically at render time (wikipedia, commons image)
 *   are shown as a disabled placeholder after syncing and saved empty, so the
 *   local value cannot drift out of sync with Wikidata.
 * @property {string[]} SUPPORTED_SECTIONS array of lowercased strings that will be
 *  checked against the section heading string. For example if "do" is in array than listings
 *  can be added to any heading == Do ==
 * @property {Record<string, string>} sectionType maps heading titles to section types
 *   e.g. `{ "Eat_and_drink": "eat" }`
 * @property {string} iata template for rendering iata e.g. `"{{IATA|%s}}"`
 * @property {number} COORD_PRECISION How many decimal places to show. Defaults to 6.
 * @property {string} [EDITOR_TAG] if present all edits will be tagged with this
 *   string. It must be defined in Special:Tags.
 * @property {string} listingTypeRegExp regular expression for creating lists! Override at
 *   your own risk!
 * @property {Record<string,string>} SECTION_TO_TEMPLATE_TYPE private. Do not configure.
 *  See sectionType.
 * @property {boolean} APPEND_FULL_STOP_TO_DESCRIPTION adds a full stop at end of description.
 * @property {boolean} REPLACE_NEW_LINE_CHARS replace all new line characters inside form values
 *  before saving
 * @property {boolean} VALIDATE_CALLBACKS_EMAIL checks email fields are in expected format
 *   e.g. don't allow emails missing @ character
 * @property {boolean} ALLOW_UNRECOGNIZED_PARAMETERS private do not use
 * @property {boolean} ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP whether to allow unrecognized parameters
 *  to be saved.
 * @property {string} LISTING_TYPE_PARAMETER type field for your listing template defined in DEFAULT_LISTING_TEMPLATE
 * @property {string} LISTING_CONTENT_PARAMETER content field for your template in DEFAULT_LISTING_TEMPLATE
 * @property {string} DEFAULT_LISTING_TEMPLATE the wiki page where your listing template lives.
 * @property {ListingTemplateParametersConfig} SLEEP_TEMPLATE_PARAMETERS map fields specific to sleep section to
 * configuration options. Unstable and likely to change in future.
 *  e.g. `{ "hours": { "hideIfEmpty": "div_hours", "skipIfEmpty": true } }`
 * @property {ListingTemplateParametersConfig} LISTING_TEMPLATE_PARAMETERS map fields to configuration options.
 * Unstable and likely to change in future.
 *  e.g. `{ "hours": { "hideIfEmpty": "div_hours", "skipIfEmpty": true } }`
 * @property {string} WIKIDATAID the wikidata ID of your project
 * @property {string[]} SPECIAL_CHARS a list of characters that are commonly used in your
 * language/;locale and might be helpful e.g. é - these appear in listing editor for easy copy and pasting
 */
/**
 * @typedef {Object} ListingInfoParameter
 * @property {string} id
 * @property {string|null} [hideDivIfEmpty]
 * @property {boolean} [newline]
 * @property {boolean} [skipIfEmpty]
 *
 * @typedef {Object<string,ListingInfoParameter>} ListingInfo
 */
/**
 * @template T
 * @typedef {Object} AbortableJQueryDeferred
 * @property {Function} abort
 * @property {Function} then
 */

/**
 * @typedef {ReturnType<import('./SisterSite.js')>} SisterSiteApi
 */

/**
 * @typedef {Object} MwApiWikidataEntityClaim
 * @property {string} title
 * @property {string} type
 * @property {string} id
 * @property {string} rank
 * @property {MwApiWikidataClaimReference[]} references
 * @property {MwApiWikidataSnak} mainsnak
 */
/**
 * @typedef {Object} MwApiWikidataEntitySiteLink
 * @property {string} title
 */
/**
 * @typedef {Object} MwApiWikidataEntityLabel
 * @property {string} value
 */
/**
 * @typedef {Object} MwApiWikidataEntityJSON
 * @property {string} datatype
 * @property {Record<string,MwApiWikidataEntityLabel>} labels
 * @property {Record<string,MwApiWikidataEntityClaim[]>} claims
 * @property {Record<string,MwApiWikidataEntitySiteLink>} sitelinks
 */
/**
 * @typedef {Object} MwApiPageProps
 * @property {string} wikibase_item
 */
/**
 * @typedef {Object} MwApiPage
 * @property {MwApiPageProps} pageprops
 */
/**
 * @typedef {Object} MwApiQuery
 * @property {string[]} pageids
 * @property {Record<string,MwApiPage>} pages
 */
/**
 * @typedef {Object} MwApiQueryResponseJSON
 * @property {MwApiQuery} query
 */
/**
 * @typedef {Object} MwApiWikidataEntityResponseJSON
 * @property {Record<string,MwApiWikidataEntityJSON>} entities
 */
/**
 * @typedef {Object} SearchResult
 * @property {string} value
 * @property {string} label
 */
/**
 * @typedef {Object} MwApiWikidataSearchResultItem
 * @property {string} title
 * @property {string} label
 */
/**
 * @typedef {Object} MwApiWikidataSearchResponse
 * @property {MwApiWikidataSearchResultItem[]} [search]
 */
/**
 * @typedef {Object} MwApiWikidataDataValueObject
 * @property {string} id
 * @property {string} text
 * @property {string} language
 * @property {string} entity-type
 * @property {number} numeric-id"
 */
/**
 * @typedef {Object} MwApiWikidataDataValue
 * @property {MwApiWikidataDataValueObject} value
 * @property {string} type
 */
/**
 * @typedef {Object} MwApiWikidataSnak
 * @property {string} snaktype
 * @property {string} property
 * @property {string} hash
 * @property {MwApiWikidataDataValue} datavalue
 * @property {string} datatype
 */
/**
 * @typedef {Object} MwApiEditObjResponse
 * @property {string} result
 * @property {Object} [captcha]
 * @property {string} captcha.id
 * @property {string} captcha.url
 * @property {boolean} [nochange]
 * @property {string} [spamblacklist]
 */
/**
 * @typedef {Object} MwApiEditResponse
 * @property {MwApiEditObjResponse} edit
 * @property {Object} [error]
 * @property {string} error.info
 * @property {number} error.code
 */
/**
 * @typedef {Object} MwApiWikidataClaimReference
 * @property {string[]} snaks-order
 * @property {string} hash
 * @property {Record<string,MwApiWikidataSnak>} snaks
 */
/**
 * @typedef {Object} MwApiWikidataClaimResponse
 * @property {MwApiWikidataEntityClaim} claim
 */
/**
 * @typedef {Object} CoordValue
 * @property {string} latitude
 * @property {string} longitude
 */
/**
 * @typedef {Object} WikidataClaimRecord
 * @property {string|CoordValue|null} value
 * @property {string|null} guidObj
 */
/**
 * @typedef {Object} RadioDefinitionField
 * @property {string} label
 * @property {string} [p] the property
 * @property {string[]} fields
 * @property {boolean} [doNotUpload]
 * @property {boolean} [remotely_sync]
 */
/**
 * @typedef {Object} RadioDefinition
 * @property {boolean} skip
 * @property {boolean} remoteFlag
 * @property {string} wikidataText
 * @property {string} localText
 * @property {RadioDefinitionField} field
 * @property {string} [wikidataUrl]
 * @property {string} [localUrl]
 * @property {string[]} editorField
 * @property {(string|null)[]} claimValue
 * @property {string|null} guid
 */
/**
 * @typedef {Object} SisterSiteData
 * @property {string} wikipedia
 * @property {string} wikidata
 * @property {string} image
 * @property {string} [commons]
 */
/**
 * @typedef {Object} ListingEditorFieldDefinition
 * @property {string} name
 * @property {string} label
 * @property {string} value
 */
