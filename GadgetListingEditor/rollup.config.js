const resolve = require( '@rollup/plugin-node-resolve' );
const commonjs = require( '@rollup/plugin-commonjs' );
const json = require( '@rollup/plugin-json' );

const fs = require( 'fs' );

const updateVersion = () => ({
	renderStart (outputOptions) {
		outputOptions.banner = () => {
			const version = JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
			return `/**
 * Listing Editor v${version}
 * @maintainer Jdlrobson
 * Please upstream any changes you make here to https://github.com/jdlrobson/Gadget-Workshop/tree/master/GadgetListingEditor
 * Raise issues at https://github.com/jdlrobson/Gadget-Workshop/issues
 * to avoid losing them in future updates.
 *	Source code: https://github.com/jdlrobson/Gadget-Workshop
 *	Wiki: https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023Main.js
 *	Original author:
 *	- torty3
 *	Additional contributors:
 *	- Andyrom75
 *	- ARR8
 *	- RolandUnger
 *	- Wrh2
 *	- Jdlrobson
 *	Changelog: https://en.wikivoyage.org/wiki/Wikivoyage:Listing_editor#Changelog

 *	TODO
 *	- Add support for mobile devices.
 *	- wrapContent is breaking the expand/collapse logic on the VFD page.
 *	- populate the input-type select list from LISTING_TEMPLATES
 *	- Allow syncing Wikipedia link back to Wikidata with wbsetsitelink
 *	- Allow hierarchy of preferred sources, rather than just one source, for Wikidata sync
 *		- E.g. get URL with language of work = english before any other language version if exists
 *		- E.g. get fall back to getting coordinate of headquarters if geographic coordinates unavailable. Prioritize getting coordinates of entrance before any other coordinates if all present
 *		- E.g. Can use multiple sources to fetch address
 *		- Figure out how to get this to upload properly
 */
 //<nowiki>
window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ = '${version}'
`;
		}
	}
  })

module.exports = [
	{
		input: 'src/index.js',
		output: [
			{
                file: 'dist/Gadget-ListingEditor2023Main.js',
                format: 'cjs'
            }
		],
        plugins: [
			json(),
			updateVersion(),
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	},
	{
		input: 'src/Gadget-ListingEditor2023.js',
		output: [
			{
                file: 'dist/Gadget-ListingEditor2023.js',
                format: 'cjs'
            }
		],
        plugins: [
			updateVersion(),
			resolve(),
			commonjs()
		]
	},
];
