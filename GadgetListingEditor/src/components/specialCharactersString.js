module.exports = {
    name: 'SpecialCharactersString',
    props: {
        characters: {
            type: Array
        }
    },
    template: `<span v-if="characters.length">
    <br />(<span
    v-for="(char, i) in characters"
    class="listing-charinsert"
    data-for="input-content"><a>{{ char }}</a>&nbsp;</span>
&nbsp;)</span><span v-else></span>`
}