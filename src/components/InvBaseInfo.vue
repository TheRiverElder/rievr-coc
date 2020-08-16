<template>
    <div class="pa-5">
        <!-- 基本信息 -->
        <div class="d-flex">
            <div class="flex-grow-1 mr-5">
                <v-text-field
                    label="名字"
                    v-model="name"
                />

                <v-text-field
                    label="年龄"
                    type="number"
                    v-model.number="age"
                />

                <v-text-field
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

        <v-btn block>Commit</v-btn>
    </div>
</template>

<script>
export default {
    name: 'InvBaseInfo',

    data() {
        return {
            name: '',
            age: 20,
            avatar: null,
            nationality: '',
            story: '',
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
    width: 16em;
}

.avatar-preview {
    max-width: 8em;
    max-height: 8em;
}
</style>