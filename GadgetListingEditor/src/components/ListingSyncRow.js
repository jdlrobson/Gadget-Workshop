const ListingSyncRowLink = require( './ListingSyncRowLink' );

module.exports = {
    name: 'ListingSyncRow',
    components: {
        ListingSyncRowLink
    },
    props: {
        field: {
            type: Object,
            required: true
        },
        guid: {
            type: String
        },
        wikidataUrl: {
            type: String
        },
        localUrl: {
            type: String
        },
        localText: {
            type: String
        },
        wikidataText: {
            type: String
        },
        skip: {
            type: Boolean
        },
        remoteFlag: {
            type: Boolean
        }
    },
    computed: {
        divStyle() {
            return this.remoteFlag ? 'display: none' : undefined;
        }
    },
    template: `<div>
<div v-if="!remoteFlag" class="sync_label">{{ field.label }}</div>
<div class="choose-row" :style="divStyle">
    <div>&nbsp;<label :for="field.label + '-wd'"><listing-sync-row-link
        :href="wikidataUrl">{{ wikidataText }}</listing-sync-row-link></label>
    </div>
    <div id="has-guid">
        <input type="radio" :id="field.label+'-wd'" :name="field.label"
            :checked="remoteFlag">
        <input type="hidden" :value="guid">
    </div>
    <div v-if="!remoteFlag">
        <input type="radio" :name="field.label" checked>
    </div>
    <div id="has-json">
        <input v-if="remoteFlag !== true && field.doNotUpload !== true"
            type="radio" :id="field.label+'-wv'" :name="field.label">
        <input v-else type="radio" disabled>
        <input type="hidden" :value='JSON.stringify(field)'>
    </div>
    <div>&nbsp;<label :for="field.label+'-wv'"><listing-sync-row-link
:href="localUrl">{{ localText }}</listing-sync-row-link></label></div>
</div>
</div>`
};