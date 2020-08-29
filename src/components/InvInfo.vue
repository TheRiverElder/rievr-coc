<template>
    <div class="inv-info pa-5">

        <h1>调查员信息卡</h1>

        <v-subheader>调查员ID: {{ selfId }}</v-subheader>

        <h2>基本信息</h2>
        <!-- 基本信息 -->
        <div class="d-flex">
            <div class="flex-grow-1 mr-5">
                <v-text-field
                    class="short-input"
                    label="名字"
                    v-model="name"
                />

                <v-text-field
                    class="short-input"
                    label="年龄"
                    type="number"
                    v-model.number="age"
                />

                <v-text-field
                    class="short-input"
                    label="国籍"
                    v-model="nationality"
                />

                <v-textarea
                    label="背景故事"
                    v-model="story"
                />
            </div>

            <div class="avatar d-flex flex-column align-center">
                <v-avatar
                    size="160"
                >
                    <v-img :src="getFileUrl(avatar)"/>
                </v-avatar>

                <v-file-input 
                    class="avatar"
                    label="头像"
                    v-model="avatar"
                />
            </div>
        </div>

        <h2>数值</h2>
        <!-- 数值 -->
        <div class="values">
            <v-row class="table-title-border text-center">
                <v-col class="font-weight-bold" cols="2">数值名</v-col>
                <v-col class="font-weight-bold" cols="3">数值/最大值</v-col>
                <v-col class="font-weight-bold" cols="1">困难</v-col>
                <v-col class="font-weight-bold" cols="1">极难</v-col>
                <v-col class="font-weight-bold" cols="5">操作</v-col>
            </v-row>

            <v-row 
                v-for="valueID of Object.keys(valueInfos)"
                :key="valueID"
                class="table-row-border text-center"
            >
                <!-- 数值名 -->
                <v-col cols="2">{{ valueInfos[valueID].name }}</v-col>
                <!-- 数值 -->
                <v-col cols="3">
                    <input 
                        type="number" 
                        min="0"
                        class="text-right"
                        :max="values[valueID].max" 
                        v-model.number="values[valueID].val"
                    />
                    <span>/</span>
                    <!-- 最大值 -->
                    <input 
                        type="number" 
                        class="text-left"
                        min="0"
                        v-model.number="values[valueID].max"
                    />
                </v-col>
                <!-- 困难值 -->
                <v-col cols="1">{{ Math.floor(values[valueID].val / 2) }}</v-col>
                <!-- 极难值 -->
                <v-col cols="1">{{ Math.floor(values[valueID].val / 5) }}</v-col>

                <v-col cols="5">
                    <v-btn-toggle dense>
                        <v-btn small>投掷</v-btn>
                        <v-btn small>还原</v-btn>
                        <v-btn small>申请</v-btn>
                    </v-btn-toggle>
                </v-col>
            </v-row>
        </div>

        <!-- 物品 -->

        <!-- 确认按钮 -->
        <v-btn block @click="commitInvInfo">Commit</v-btn>
    </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
    name: 'InvInfo',

    data() {
        return {
            name: '张三',
            age: 20,
            avatar: null,
            nationality: '天朝',
            story: '',
            values: {},
            inventory: [],
        };
    },

    computed: {
        ...mapState(['valueInfos', 'selfId']),
    },

    methods: {

        commitInvInfo() {
            this.$store.dispatch('commitInvInfo', {
                uuid: this.$store.state.selfId, 
                name: this.name,
                age: this.age,
                avatar: this.avatar,
                nationality: this.nationality,
                story: this.story,
                values: this.values,
                inventory: this.inventory,
            });
        },

        getFileUrl(file) {
            return file ? URL.createObjectURL(file) : null;
        },

        fillWithInvInfo(id) {
            const invInfo = id ? this.$store.state.invs[id] : this.$store.getters.self;
            Object.assign(this, invInfo);
        },
    },

    created() {
        this.fillWithInvInfo();
    },

}
</script>

<style scoped>
.inv-info {
    max-width: 50em;
    margin: auto;
}

.avatar {
    width: 16em;
}

.avatar-preview {
    max-width: 8em;
    max-height: 8em;
}

input[type=number] {
    max-width: 3em;
    min-width: 2em;
}

.short-input {
    width: 10em;
}

.values {
    width: 90%;
    margin: auto;
}

.table-title-border {
    border-top: #aaa solid 1px;
    border-bottom: #aaa solid 1px;
}

.table-row-border {
    border-bottom: #eee solid 1px;
}
</style>