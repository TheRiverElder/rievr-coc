<template>
	<div class="chat fill-height d-flex flex-column grey lighten-4">
		<div class="msg-list flex-grow-1" ref="msgList">
			<Message
				class="my-2"
				v-for="(msg, index) of messages"
				:key="index"
				:type="msg.type"
				:waiting="!!msg.id"
				:text="msg.text"
				:sender="msg.sender"
				:err="msg.err"
			/>

			<div class="anchor" ref="anchor"></div>
		</div>

		<div class="text-input flex-shrink-0 d-flex ma-0 pa-2 white">
			<v-textarea
				dense
				hide-details
				rounded
				outlined
				no-resize
				auto-grow
				rows="1"
				v-model="inputText"
				append-icon="mdi-send"
				@click:append="send"
				@keypress="handleInputKey"
			/>
		</div>
	</div>
</template>

<script>
import Message from '@/components/Message.vue'

import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';

export default {
	name: 'Chat',

	data() {
		return {
			inputText: '',
			onMessageHandler: () => this.$nextTick(() => this.scrollToButtom()),
			onReplyHandler: (pack) => this.confirmMessage(pack),
		};
	},

	components: {
		Message
	},

	computed: {
		...mapState(['messages']),
		...mapGetters(['self']),
	},

	methods: {
		...mapMutations(['appendMessage', 'sendMessage', 'confirmMessage']),

		...mapActions(['connectServer']),

		handleInputKey(event) {
			if (event.key === 'Enter') {
				this.send();
				event.preventDefault();
			}
		},

		send() {
			if (!/^\s*$/g.test(this.inputText)) {
				this.sendMessage(this.inputText);
				this.inputText = '';
				this.$nextTick(() => this.scrollToButtom());
			}
		},

		scrollToButtom() {
			const el = this.$refs.msgList;
			el.scrollTop = el.scrollHeight;
		},
	},

	created() {
		//this.connectServer();
		this.$store.state.bus.$on('message', this.onMessageHandler);
		this.$store.state.bus.$on('reply', this.onReplyHandler);
	},

	beforeDestroy() {
		this.$store.state.bus.$off('message', this.onMessageHandler);
		this.$store.state.bus.$off('reply', this.onReplyHandler);
	},
}
</script>

<style scoped>
.chat {
	width: 100%;
	max-width: 24em;
}

.msg-list {
	overflow-x: hidden;
	overflow-y: auto;
}

.text-input {
	max-height: 5em;
}

.anchor {
	width: 100%;
	height: 1em;
}
</style>
