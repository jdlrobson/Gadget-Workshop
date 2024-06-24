const contentTransform = require( '../../src/contentTransform' );
const EDIT_SECTION_BRACKET = `<span class="mw-editsection"><span class="mw-editsection-bracket">[</span><a href="/w/index.php?title=Frankfurt&amp;veaction=edit&amp;section=1" title="Edit section: Understand" class="mw-editsection-visualeditor"><span>edit</span></a><span class="mw-editsection-divider"> | </span><a href="/w/index.php?title=Frankfurt&amp;action=edit&amp;section=1" title="Edit section's source code: Understand"><span>edit source</span></a><span class="mw-editsection-bracket">]</span></span>`;

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

    it( 'adds "insert listing" placeholder in old HTML', () => {
        $( 'body').html(
            `<div id="bodyContent">
<h2>
    <span class="mw-headline" id="See">See</span>
    ${EDIT_SECTION_BRACKET}
</h2>
Text.
</div>`
        );
        contentTransform.insertAddListingPlaceholder( '#See' );
        expect( document.body.querySelectorAll( '.listingeditor-add' ).length ).toBe( 1 );
    } );

    it( 'adds "insert listing" placeholder in new HTML', () => {
        $( 'body').html(
            `<div id="bodyContent">
<div class="mw-heading mw-heading2">
    <h2 class="mw-headline" id="See">See</h2>
    ${EDIT_SECTION_BRACKET}
</div>
Text.
</div>`
        );
        contentTransform.insertAddListingPlaceholder( '#See' );
        expect( document.body.querySelectorAll( '.listingeditor-add' ).length ).toBe( 1 );
    } );
} );
