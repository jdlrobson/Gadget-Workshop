const openListingEditorDialog = require('../../src/openListingEditorDialog');
const dialog = require( '../../src/dialogs.js' );
const { setSectionText } = require( '../../src/currentEdit' );
const addFormToPage = require('./helpers/addFormToPage.js');

describe('openListingEditorDialog', () => {
    beforeEach(() => {
        window.__save_debug_timeout = 0;
        window.__save_debug = 0;
        dialog.render = jest.fn(() => ({}));
        setSectionText( '' );
        addFormToPage();
    });
    test('it opens a dialog for creating new listings', () => {
        openListingEditorDialog('add', null, null, 'see', {
            telephoneCodes: [ '+1' ],
            NATL_CURRENCY: [ '$' ]
        });
        expect(dialog.render).toHaveBeenCalled();
    });
    test('can handle captchas', () => {
        const app = openListingEditorDialog('add', null, null, 'see', {
            telephoneCodes: [ '+1' ],
            NATL_CURRENCY: [ '$' ]
        });
        const reset = jest.fn();
        const setCaptcha = jest.fn();
        const captchaFn = app.test.handleCaptchaError( setCaptcha, reset );
        captchaFn({
            edit: {
                captcha: {
                    url: 'captchaurl://'
                }
            }
        });
        expect(setCaptcha).toHaveBeenCalledWith( 'captchaurl://' );
        captchaFn({});
        expect(reset).toHaveBeenCalled();
    });
    test('handles submit', () => {
        const app = openListingEditorDialog('add', null, null, 'see', {
            telephoneCodes: [ '+1' ],
            NATL_CURRENCY: [ '$' ]
        });
        const closeDialog = jest.fn();
        const reset = jest.fn();
        const setCaptcha = jest.fn();
        app.test.onSubmit( closeDialog, reset, setCaptcha ).then( () => {
            expect(closeDialog).toHaveBeenCalled();
        });
    } );
    test('it opens a dialog for editing existing listings', () => {
        setSectionText( '* {{listing|type=foo|name=Restaurant}}' );
        openListingEditorDialog('edit', 0, 0, 'listing', {
            telephoneCodes: [ '+1' ],
            NATL_CURRENCY: [ '$' ]
        });
        expect(dialog.render).toHaveBeenCalled();
     });
});
