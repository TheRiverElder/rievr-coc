<template>
    <div class="fill d-flex flex-column">
        <div class="d-flex pa-2">
            <v-text-field 
                class="mx-2"
                label="次数"
                type="number"
                v-model.number="times"
            />

            <v-text-field 
                class="mx-2"
                label="面数"
                type="number"
                v-model.number="faces"
            />

            <v-text-field 
                class="mx-2"
                label="修正"
                type="number"
                v-model.number="fix"
            />

            <v-btn @click="roll">
                Roll
            </v-btn>
        </div>

        <div class="pa-2 flex-grow-1 d-flex justify-center align-center">
            <span class="text-h3">{{ times }} D {{ faces }} {{ (fix >= 0) ? '+' + fix : fix }} = {{ result === null ? '?' : result }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RollPanel',

    data() {
        return {
            times: 1,
            faces: 100,
            fix: 0,
            result: null,
        };
    },

    methods: {
        roll() {
            let sum = 0;
            for (let i = 0; i < this.times; i++) {
                sum += Math.floor(Math.random() * this.faces);
            }
            this.result = sum + this.fix;
        },
    },

    created() {
        this.roll();
    }

}
</script>