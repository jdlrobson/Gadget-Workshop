const findListingIndex = require( '../../src/findListingIndex' );

describe( 'findListingIndex', () => {
	it( 'counts headings', () => {
        $( `<section id="section"><ul>
    <li>
        <bdi><a>listing</a><span class="note">note</span><span class="listing-metadata">
        <span class="listing-metadata-items">
            <span class="vcard-edit-button noprint" id="listing-edit-1"></span>
        </span>
    </li>
    <li>
        <bdi><a>listing 2</a><span class="note">note</span><span class="listing-metadata">
        <span class="listing-metadata-items">
            <span class="vcard-edit-button noprint" id="listing-edit-2"></span>
        </span>
    </li>
    <li>
        <bdi><a>listing 3</a><span class="note">note</span><span class="listing-metadata">
        <span class="listing-metadata-items">
            <span class="vcard-edit-button noprint" id="listing-edit-3"></span>
        </span>
    </li>
</span>
</section>
` ).appendTo( document.body );
        expect(
            findListingIndex(
                $( '#section' ),
                $( '#listing-edit-2' )
            )
        ).toBe( 1 );
	} );
} );
