/**
 * Return the current date in the format "2015-01-15".
 *
 * @return {string}
 */
const currentLastEditDate = function() {
    var d = new Date();
    var year = d.getFullYear();
    // Date.getMonth() returns 0-11
    var month = d.getMonth() + 1;
    const monthStr = month < 10 ?
        `0${month}` : `${month}`;
    var day = d.getDate();
    const dayStr = day < 10 ?
        `0${day}` : `${day}`;
    return `${year}-${monthStr}-${dayStr}`;
};
module.exports = currentLastEditDate;
