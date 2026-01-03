module.exports = function(validationFailureMessages, validationRegex, fieldPattern, failureMsg) {
    var fieldValue = ( $(fieldPattern).val() || '' ).trim();
    if (fieldValue !== '' && !validationRegex.test(fieldValue)) {
        validationFailureMessages.push(failureMsg);
    }
};
