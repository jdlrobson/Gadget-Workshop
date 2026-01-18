module.exports = () => {
    $('<input id="input-image">').val('Foo.jpg').appendTo(document.body);
    $('<input id="input-lat">').val('1').appendTo(document.body);
    $('<input id="input-long">').val('2').appendTo(document.body);
    $('<input id="input-wikidata-value">').val('Q42').appendTo(document.body);
};
