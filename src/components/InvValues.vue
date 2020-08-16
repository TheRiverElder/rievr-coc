<template>
    <div class="pa-5">
        <!-- 数值 -->
        <div>
            <div
                v-for="valueId of Object.keys(values)"
                :key="valueId"
            >
                <span>{{ getValueInfo(valueId).name }}</span>

                <input
                    type="number"
                    min="0"
                    :max="values[valueId].max"
                    v-model.number="values[valueId].val"
                />

                <span class="mx-2">/</span>

                <input
                    type="number"
                    min="0"
                    v-model.number="values[valueId].max"
                />
            </div>
        </div>

        <v-btn block>Commit</v-btn>
    </div>
</template>

<script>
export default {
    name: 'InvValues',

    data() {
        return {
            values: {
                '123': {val: 60, max: 100},
                '233': {val: 60, max: 100},
                '344': {val: 60, max: 100},
                '455': {val: 60, max: 100},
                '566': {val: 60, max: 100},
                '677': {val: 60, max: 100},
                '788': {val: 60, max: 100},
                '899': {val: 60, max: 100},
                '900': {val: 60, max: 100},
            },
        };
    },

    methods: {
        getFileUrl(file) {
            return file ? URL.createObjectURL(file) : null;
        },

        getValueInfo(valueId) {
            return {name: '力量', default: 50, id: valueId};
        },
    },

}
</script>

<style scoped>
.avatar {
    width: 10em;
}

.avatar-preview {
    max-width: 8em;
    max-height: 8em;
}
</style>