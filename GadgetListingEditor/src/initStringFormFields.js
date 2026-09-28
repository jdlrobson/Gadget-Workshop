/**
 * Add listeners to specific strings so that clicking on a string
 * will insert it into the associated input.
 *
 * @param {HTMLFormElement} form
 */
var initStringFormFields = function(form) {
    var STRING_SELECTOR = '.listing-charinsert';
    $(STRING_SELECTOR, form).on( 'click', function() {
        var target = $(this).attr('data-for');
        var fieldInput = $(`#${target}`);
        const input = /** @type {HTMLInputElement} */(
            fieldInput[0]
        );
        var caretPos = input.selectionStart || 0;
        var oldField = fieldInput.val() || '';
        var string = $(this).find('a').text();
        // @ts-ignore jQuery.val can return non-string
        var newField = oldField.substring(0, caretPos) + string + oldField.substring(caretPos);
        fieldInput.val(newField);
        fieldInput.select();
        // now setting the cursor behind the string inserted
        input.setSelectionRange(caretPos + string.length, caretPos + string.length);
    });
};

module.exports = initStringFormFields;
