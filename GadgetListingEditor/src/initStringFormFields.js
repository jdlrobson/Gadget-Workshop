/**
 * Add listeners to specific strings so that clicking on a string
 * will insert it into the associated input.
 */
var initStringFormFields = function(form) {
    var STRING_SELECTOR = '.listing-charinsert';
    $(STRING_SELECTOR, form).on( 'click', function() {
        var target = $(this).attr('data-for');
        var fieldInput = $(`#${target}`);
        var caretPos = fieldInput[0].selectionStart;
        var oldField = fieldInput.val();
        var string = $(this).find('a').text();
        var newField = oldField.substring(0, caretPos) + string + oldField.substring(caretPos);
        fieldInput.val(newField);
        fieldInput.select();
        // now setting the cursor behind the string inserted
        fieldInput[0].setSelectionRange(caretPos + string.length, caretPos + string.length);
    });
};

module.exports = initStringFormFields;
