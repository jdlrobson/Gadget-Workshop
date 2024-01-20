const resolve = require( '@rollup/plugin-node-resolve' );
const commonjs = require( '@rollup/plugin-commonjs' );

module.exports = [
	{
		input: 'GadgetListingEditor/src/index.js',
		output: [
			{
                file: 'GadgetListingEditor/dist/Gadget-ListingEditor.js',
                format: 'cjs'
            }
		],
        plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	}
];