import '@wikimedia/types-wikimedia';

// mw.ForeignApi (from the mediawiki.ForeignApi module) is not covered by
// @wikimedia/types-wikimedia. It is a subclass of mw.Api that targets a
// foreign wiki, so type it as a constructor taking the foreign API URL and
// returning an mw.Api-compatible instance.
declare global {
  interface MediaWiki {
    ForeignApi: new ( url: string, options?: Object ) => MwApi;
  }

  // mw.Api#ajax (from the mediawiki.api module) issues a raw request to
  // api.php and isn't covered by @wikimedia/types-wikimedia's MwApi
  // interface, which only types the higher-level get/postWithToken/etc.
  // helpers.
  interface MwApi {
    ajax( parameters: Object, ajaxOptions?: Object ): JQuery.jqXHR<any>;
  }

  interface Window {
    // Debug hook read in src/savePayload.js: selects a simulated save
    // response via a numeric switch (e.g. -1 = error, 0 = no change,
    // 1 = success). Unset in normal operation.
    __save_debug?: number;
    __save_debug_timeout?: number;
    __USE_LISTING_EDITOR_BETA__?: boolean;
    __WIKIVOYAGE_LISTING_EDITOR_VERSION__?: string;
    _listingEditorModule?: string;
  }
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
import VueModule = require('vue');

export as namespace Vue;
export = VueModule;
