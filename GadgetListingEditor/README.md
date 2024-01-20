The GadgetListingEditor can be seen on the https://en.wikivoyage.org/wiki/Nottingham page:
It adds the "[ add listing ]" link to the "Get in" heading and "edit" link next to Nottingham Castle.

The code lives in two files:
* https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023Main.js (one canonical version is hosting on English Wikivoyage)
* https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023.js (must be copied to a project)
# Installation

Projects that wish to use this gadget must create two modules in [[MediaWiki:Gadgets-definition]]

* ListingEditorConfig[ResourceLoader|package|hidden]|ListingEditorConfig.js|ListingEditor.json
* ListingEditor2023[ResourceLoader|default|skins=vector-2022,vector,timeless,modern,cologneblue,monobook|type=general]|ListingEditor2023.js

and copy the following files:
* MediaWiki:Gadget-ListingEditorConfig: https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditorConfig.js
* MediaWiki:Gadget-ListingEditor.json https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor.json
* MediaWiki:ListingEditor2023.js  https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023.js
