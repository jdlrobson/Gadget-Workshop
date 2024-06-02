const resolve = require( '@rollup/plugin-node-resolve' );
const commonjs = require( '@rollup/plugin-commonjs' );

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
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	}
];
