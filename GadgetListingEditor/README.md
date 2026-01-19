The GadgetListingEditor can be seen on the https://en.wikivoyage.org/wiki/Nottingham page:
It adds the "[ add listing ]" link to the "Get in" heading and "edit" link next to Nottingham Castle.

The code lives in two files:
* https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023Main.js (one canonical version is hosting on English Wikivoyage)
* https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023.js (must be copied to a project)

# Development

To build the latest code run the following:

```
npm start
```

# Verifying build before deployment.

Go to https://en.wikivoyage.org/wiki/Nottingham?safemode=1

In JavaScript console:
```
mw.loader.load('vue');
mw.loader.load('@wikimedia/codex');
module = {};
require = mw.loader.require
```
// Copy paste contnets of Gadget-ListingEditor2023Main.js
```
window._listingEditorModule = module.exports;
importScriptURI('https://en.wikivoyage.org/w/load.php?modules=ext.gadget.ListingEditorConfig');
importStylesheetURI('https://en.wikivoyage.org/w/load.php?modules=ext.gadget.ListingEditorMain&only=styles')
```
// Copy paste contents of Gadget-ListingEditor2023.js
// Click one of the buttons

# Installation

Projects that wish to use this gadget must create two modules in [[MediaWiki:Gadgets-definition]]

* ListingEditorConfig[ResourceLoader|package|hidden]|ListingEditorConfig.js|ListingEditor.json
* ListingEditor2023[ResourceLoader|default|skins=vector-2022,vector,timeless,modern,cologneblue,monobook|type=general|dependencies=mediawiki.util]|ListingEditor2023.js

and copy the following files:
* MediaWiki:Gadget-ListingEditorConfig: https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditorConfig.js
* MediaWiki:Gadget-ListingEditor.json https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor.json
* MediaWiki:ListingEditor2023.js  should contain the following code:
```
importScriptURI('https://en.wikivoyage.org/w/load.php?modules=ext.gadget.ListingEditor2023');
```


## Local development

* Update local mediawiki instance
```
wfLoadExtension('MobileFrontendContentProvider');
wfLoadExtension('Gadgets');
$wgExtraNamespaces[NS_WIKIVOYAGE] = "Wikivoyage";
$wgExtraNamespaces[NS_WIKIVOYAGE+1] = "Wikivoyage talk";
```
* Install gadgets per instructions above.
* Visit http://localhost:8888/wiki/Wikivoyage:Paris

