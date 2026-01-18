const { CdxDialog, CdxTextInput, CdxMessage, CdxButton, CdxProgressBar } = require( '@wikimedia/codex' );
const { defineComponent, ref, onMounted } = require( 'vue' );

module.exports = defineComponent( {
    name: 'ListingEditorDialog',
    components: {
        CdxProgressBar,
        CdxDialog,
        CdxMessage,
        CdxTextInput,
        CdxButton
    },
    template: `<cdx-dialog
v-model:open="isOpen"
:title="title"
:default-action="defaultAction"
:class="dialogClass"
:useCloseButton="!modal"
@update:open="closeAction"
>
<div v-if="saveInProgress" id="progress-dialog">
    <div v-if="captchaRequested">
        <div id="captcha-dialog">
            <strong>{{ $translate( 'enterCaptcha' ) }}</strong>
            <p>{{ $translate( 'externalLinks' ) }}</p>
            <img class="fancycaptcha-image" :src="captchaRequested">
            <cdx-text-input id="input-captcha"></cdx-text-input>
            <cdx-button @click="onCaptchaSubmit">{{ $translate( 'submit' ) }}</cdx-button>
        </div>
    </div>
    <div v-else>
        <cdx-progress-bar
            :aria-label="$translate( 'saving' )"></cdx-progress-bar>
        {{ $translate( 'saving' ) }}
    </div>
</div>
<div v-else class="ui-dialog-content" ref="targetElement">
    <slot />
</div>
<template #footer>
    <div class="ui-dialog-buttonpane" v-if="submitAction">
        <div v-if="!saveInProgress" class="ui-dialog-buttonset">
            <cdx-button v-if="helpClickAction" id="listing-help" @click="helpClickAction">?</cdx-button>
            <cdx-button class="submitButton"
                @click="submitAction" :disabled="disabledMessage"> {{ $translate( 'submit' ) }}</cdx-button>
            <cdx-button @click="closeAction">{{ $translate( 'cancel' ) }}</cdx-button>
        </div>
        <div if="!saveInProgress">
            <div v-if="disabledMessage">
                <cdx-message>{{ disabledMessage }}</cdx-message>
            </div>
            <div v-else-if="!modal" class="listing-license"
                v-translate-html:licenseText></div>
            <span class="listing-license">{{ $translate('listing-editor-version', [ version ]) }}</span>
            <span class="listing-license">&nbsp;<a href="https://github.com/jdlrobson/Gadget-Workshop/issues">
                {{ $translate( 'report-bug' ) }}</a></span>
        </div>
    </div>
</template>
</cdx-dialog>`,
    props: {
        disabledMessage: {
            type: String
        },
        version: {
            type: String,
            default: window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__
        },
        modal: {
            type: Boolean
        },
        title: {
            type: String
        },
        dialogClass: {
            type: String
        },
        dialogElement: {
            type: HTMLElement,
            required: false
        },
        onCaptchaSubmit: {
            type: Function
        },
        onSubmit: {
            type: Function
        },
        onMount: {
            type: Function,
            default: () => {}
        },
        onClose: {
            type: Function
        },
        onHelp: {
            type: Function,
            required: false
        }
    },
    setup( {
        title,
        disabledSubmitButton,
        onCaptchaSubmit,
        onSubmit, onClose, dialogElement, dialogClass, onHelp, onMount
    } ) {
        const activeXhr = ref( null );
        const captchaRequested = ref( '' );
        const saveInProgress = ref( false );
        const defaultAction = {
            label: 'Cancel'
        };
        const isOpen = ref( true );
        const closeDialog = () => {
            isOpen.value = false;
            saveInProgress.value = false;
        };
        const setCaptcha = ( url ) => {
            captchaRequested.value = url;
        };
        const submitAction = () => {
            saveInProgress.value = true;
            const xhr = onSubmit( closeDialog, () => {
                saveInProgress.value = false;
            }, setCaptcha );
            activeXhr.value = xhr;
        };
        const closeAction = () => {
            if ( saveInProgress.value && activeXhr.value ) {
                if ( activeXhr.value.abort ) {
                    activeXhr.value.abort();
                }
                saveInProgress.value = false;
                return;
            }
            onClose();
            closeDialog();
        };
        const targetElement = ref(null);
        onMounted(() => {
            if (targetElement.value && dialogElement ) {
                targetElement.value.appendChild( dialogElement );
            }
            onMount( targetElement.value );
        })
        return {
            onCaptchaSubmit: () => {
                onCaptchaSubmit( setCaptcha, closeAction );
            },
            disabledSubmitButton,
            captchaRequested,
            saveInProgress,
            title,
            dialogClass,
            targetElement,
            closeAction,
            defaultAction,
            isOpen,
            helpClickAction: onHelp,
            submitAction
        }
    }
} );
