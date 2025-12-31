module.exports = {
    name: 'ListingSyncRowLink',
    props: {
        href: {
            type: String
        }
    },
    template: `<a v-if="href"
    target="_blank" rel="noopener noreferrer" :href="href"><slot /></a><slot v-else />`
};
