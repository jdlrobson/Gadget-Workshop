// these selectors should match a value defined in the EDITOR_FORM_HTML
// if the selector refers to a field that is not used by a Wikivoyage
// language version the variable should still be defined, but the
// corresponding element in EDITOR_FORM_HTML can be removed and thus
// the selector will not match anything and the functionality tied to
// the selector will never execute.
module.exports = {
    EDITOR_MINOR_EDIT_SELECTOR: '#input-minor',
    EDITOR_CLOSED_SELECTOR: '#input-closed',
    EDITOR_SUMMARY_SELECTOR: '#input-summary'
};
