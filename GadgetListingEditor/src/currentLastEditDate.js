/**
 * Return the current date in the format "2015-01-15".
 */
const currentLastEditDate = function() {
    var d = new Date();
    var year = d.getFullYear();
    // Date.getMonth() returns 0-11
    var month = d.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    var day = d.getDate();
    if (day < 10) day = `0${day}`;
    return `${year}-${month}-${day}`;
};
module.exports = currentLastEditDate;
