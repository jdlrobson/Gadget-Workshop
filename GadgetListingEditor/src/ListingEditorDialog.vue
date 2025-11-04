<script>
const { CdxDialog } = require( '@wikimedia/codex' );
const { defineComponent, ref } = require( 'vue' );
module.exports = defineComponent( {
    name: 'ListingEditorDialog',
    components: {
        CdxDialog
    },
    setup( props ) {
        const isOpen = ref( true );
        return {
            isOpen
        }
    }
} );
</script>
<template>
    <cdx-dialog
        v-model:open="isOpen"
        class="example">

        <p>Do you want to save your changes?</p>
    </cdx-dialog>
</template>
