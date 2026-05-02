const fs = require( 'fs' );
/**
 * @param {string} lang
 * @returns {string}
 */
const script = ( lang ) => `<script>
const scrpt = document.createElement( 'script' );
scrpt.src = './Gadget-ListingEditor2023.js';
scrpt.type = 'module';
const originalAjax = $.ajax;
window.require = mw.loader.require;
setTimeout( () => {
	mw.loader.using(
		[
			'mediawiki.api',
			'mediawiki.ForeignApi',
			'mediawiki.util',
			'mediawiki.user',
			'vue',
			'@wikimedia/codex'
		]
	).then( () => {
		window.module = {};
		mw.loader.addScriptTag('./Gadget-ListingEditor2023Main.js', () => {
			window._listingEditorModule = module.exports;
			document.body.appendChild( scrpt);
		} );
	} );

	const optsWithOrigin = ( _opts ) => {
		let newUrl = _opts.url;
		if ( newUrl.indexOf( '//' ) === -1 ) {
			newUrl = 'https://${lang}.wikivoyage.org' + newUrl;
		}
		const opts = Object.assign( {}, _opts, {
			dataType: undefined,
			url: newUrl
		} );
		if ( typeof opts.data === 'string' ) {
			opts.data += '&origin=*'
		} else if ( opts.data ) {
			opts.data.origin = '*'
		} else if ( opts.url.indexOf('?') > -1) {
			opts.url += '&origin=*';
		}
		return opts;
	};

	$.ajax = ( opts ) => {
		console.log('index.html ajax', opts);
		return originalAjax( optsWithOrigin( opts ) );
		
	};
}, 1000 );
</script>
`;

const titles = {
	de: 'Brünn',
	vi: 'Sainshand',
	id: 'Danau_Toba/Utara',
	he: 'טוקיו',
	en: 'Nottingham',
	fr: 'La_Tremblade',
	it: 'Eminönü'
};

const langs = {
	de: 'German',
	vi: 'vietnamese',
	id: 'indonesian',
	he: 'hebrew',
	en: 'english',
	fr: 'french',
	it: 'italian'
}

/**
 * @param {string} templatePath
 * @param {string} outputPath
 * @param {Object} data
 */
function generatePage( templatePath, outputPath, data ) {
    let html = fs.readFileSync( templatePath, 'utf-8' );
    Object.keys( data ).forEach( key => {
        console.log( `Replacing <!-- data:${key} --> with ${data[key].substring( 0, 100 )}...` );
        html = html.replaceAll( `<!-- data:${key} -->`, data[key] );
    } );
    fs.writeFileSync( outputPath, html, 'utf-8' );
}

Object.keys(titles).forEach( async ( lang ) => {
    const title = titles[ lang ];
    const json = await fetch( `https://${lang}.wikivoyage.org/w/api.php?action=parse&format=json&page=${title}&parser=parsoid&formatversion=2` ).then( res => res.json() );
    const content = json.parse.text;
    const data = {
		previews: '<ul>' + Object.keys( titles ).map( ( key ) => `<li>
    <a href="index-${key}.html">${langs[key]}</a>
  </li>`).join('') + '</ul>',
        lang,
		languser: lang,
		version: require( './package.json' ).version,
        title,
        content,
        script: script( lang ),
        theme: 'day'
    };
	generatePage( `./template.html`, `./dist/index-${lang}.html`, data );
	generatePage( `./template-index.html`, `./dist/index.html`, data );
} );

