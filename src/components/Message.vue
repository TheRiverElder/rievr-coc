<template>
	<div v-if="isChat" :class="msgClass">
        <!-- 其他人头像 -->
        <v-avatar 
            size="36"
            color="indigo" 
            class="text-no-wrap ma-2"
        >
            <span class="white--text">{{ senderName }}</span>
        </v-avatar>

        <!-- 正文 -->
        <div class="middle px-2 flex-grow-0 flex-shrink-1 d-flex flex-column">
            <!-- 发送者名称 -->
            <p class="name mb-2">{{ senderName }}</p>
            
            <!-- 消息正文 -->
            <v-card class="text pa-2">
                <span>{{ text }}</span>

                <p 
                    v-if="err" 
                    class="font-size-small font-italic pa-0 ma-0"
                >{{ err }}</p>
            </v-card>
        </div>

        <div class="loading-icon flex-shrink-0 align-self-end ma-2">
            <!-- 载入图标 -->
            <v-progress-circular
                v-if="waiting"
                indeterminate
                size="20"
                color="grey"
            />
        </div>
	</div>

    <div v-else class="text-center">
        <v-chip>{{ text }}</v-chip>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'Message',

    props: {
        type: String,
        waiting: Boolean,
        text: String,
        sender: String,
        err: String,
    },

    data() {
        return {
            msgClass: [ "d-flex", (this.sender === this.$store.state.selfId) ? "from-self" : "from-other", this.type ],
        };
    },

    computed: {
        ...mapState(['invs', 'selfId']),

        // 获取发送者的昵称
        senderName() {
            const inv = this.invs[this.sender];
            return inv ? inv.name : '无名氏';
        },

        // 获取发送者的头像
        senderAvatar() {
            return this.invs[this.sender].avatar;
        },

        isChat() {
            return this.type === 'chat';
        }
    },
}
</script>

<style lang="scss" scoped>
.position-absolute {
    position: absolute;
    top: 0;
}

.from-other {
    flex-direction: row;

    .middle {
        align-items: flex-start;
    }
}

.from-self {
    flex-direction: row-reverse;
}

.text {
    width: fit-content;
    word-break: break-all;
    max-width: 100%;
}

.name {
    font-size: .8em;
    color: #aaaaaa;
}

.font-size-small {
    font-size: .8em;
}

.loading-icon {
    width: 2em;;
}
</style>
