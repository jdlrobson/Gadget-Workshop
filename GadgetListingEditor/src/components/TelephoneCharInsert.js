module.exports = {
    name: 'TelephoneCharInsert',
    props: {
        updates: {
            type: String
        },
        codes: {
            type: Array
        }
    },
    template: `<div class="input-cc" :data-for="updates">
    <span v-for="(code, i) in codes"
        class="listing-charinsert" :data-for="updates"><a>{{ code }}</a>&nbsp;</span>
</div>`
};
