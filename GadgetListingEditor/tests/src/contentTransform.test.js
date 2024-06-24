const contentTransform = require( '../../src/contentTransform' );

describe( 'wrapContent', () => {
    beforeEach(() => {
        $( 'body' ).html();
    });
    it( 'it wraps old content', () => {
        $( 'body').html(
            `<div id="bodyContent">
<h2>hello</h2>
Text.
<h3>hello jago</h3>
text.
<h3>hello raffy</h3>
text.
<h4>goodbye raffy </h4>
goodbye.
</div>`
        );
        contentTransform.wrapContent();
        expect( document.body.innerHTML ).toMatchSnapshot();
    } );

    it( 'it wraps new content', () => {
        $( 'body').html(
            `<div id="bodyContent">
<div class="mw-heading mw-heading2">
    <h2>hello</h2>
</div>
Text.
<div class="mw-heading mw-heading3">
    <h3>hello jago</h3>
</div>
text.
<div class="mw-heading mw-heading3">
    <h3>hello raffy</h3>
</div>
text.
<div class="mw-heading mw-heading4">
    <h4>goodbye raffy </h4>
</div>
goodbye.
<div class="mw-heading mw-heading2">
    <h2>hi</h2>
</div>
hi again.
</div>`
        );
        contentTransform.wrapContent();
        expect( document.body.querySelectorAll( '.mw-h2section' ).length ).toBe( 2 );
        expect( document.body.querySelectorAll( '.mw-h3section' ).length ).toBe( 2 );
        expect( document.body.innerHTML ).toMatchSnapshot();
    } );
} );
