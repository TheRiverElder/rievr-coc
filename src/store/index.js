import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { v4 as gen } from 'uuid'

Vue.use(Vuex);

const SELF_ID = gen();

function isMobile() {
	const MOBILES = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
	const ua = navigator.userAgent;
	return MOBILES.some(m => ua.indexOf(m) >= 0);
}


const CHINESE_NUMBERS = '〇幺贰叁肆伍陆柒捌玖';
const CHINESE_LETTERS = '阿波可德俄夫哥合伊基克勒莫恩欧派科日斯特吴福伍士易兹';
function genName(id = '000') {
	return id.slice(-3).split('').map(e => {
		let index = Number(e);
		if (!isNaN(index)) {
			return CHINESE_NUMBERS[index];
		} else {
			e = e.toUpperCase();
			index = e.codePointAt(0) - 'A'.codePointAt(0);
			return (index >= 0 && index < CHINESE_LETTERS.length) ? CHINESE_NUMBERS[index] : e;
		}
	}).join('');
}

export default new Vuex.Store({
	state: {
		// 缓存的聊天消息
		messages: [],
		// 缓存的人物卡
		invs: {},

		selfId: SELF_ID,

		groupInfo: {
			name: '米勒山庄之巨石阵'
		},

		socket: null,

		// connectionCyclePid: null,

		isMobile: isMobile(),

		onMessageHandlers: new Set(),

		hasLogin: false,
	},

	getters: {
		self(state) {
			return state.invs[state.selfId];
		},
	},
	
	mutations: {

		// 发送消息
		sendMessage(state, text) {
			const message = {
				id: gen(),
				type: 'chat',
				text: text,
				sender: state.selfId,
				err: null,
			};
			if (!state.invs[state.selfId]) {
				state.invs[state.selfId] = {name: genName(state.selfId), avatar: ''};
			}
			if (state.socket) {
				state.socket.send(JSON.stringify({
					type: 'chat',
					id: message.id,
					text,
				}));
			} else {
				message.err = 'Network fail';
			}
			state.messages.push(message);
		},

		// 添加消息监听器
		addMessageHandler(state, handler) {
			state.onMessageHandlers.add(handler);
		},

		// 移除消息监听器
		removeMessageHandler(state, handler) {
			state.onMessageHandlers.delete(handler);
		},

		// 添加新的聊天消息
		appendMessage(state, message) {
			if (!state.invs[message.sender]) {
				state.invs[message.sender] = {name: genName(message.sender), avatar: ''};
			}
			if (message.sender !== state.selfId) {
				state.messages.push(message);
			}
			[...state.onMessageHandlers].forEach(handler => handler(message));
		},

		// 添加自己发送但是还未到达服务器的聊天消息
		appendUncheckedMessage(state, message) {
			if (!state.invs[message.sender]) {
				state.invs[message.sender] = {name: genName(message.sender), avatar: ''};
			}
			[...state.onMessageHandlers].forEach(handler => handler(message));
		},

		// 处理回执
		handleReply(state, pack) {
			const id = pack.id;
			const index = state.messages.findIndex(msg => msg.id === id);
			if (index >= 0) {
				const message = state.messages[index];
				if (pack.success) {
					message.id = undefined;
				} else {
					message.err = pack.err;
				}
			}
		},
	},
	
	actions: {

		// 连接至WebSocket服务器
		connectServer({state, commit/*, dispatch*/}) {
			if (!state.socket) {
				const token = new URLSearchParams(window.location.search).get('token');
				axios.get(window.location.hostname + ':8001', token);
				
				const socket = new WebSocket('ws://' + window.location.hostname + ':8001/chat/' + state.selfId);

				socket.addEventListener('open', event => {
					state.socket = socket;
					commit('appendMessage', {
						type: 'info',
						text: 'Connection opened',
					});
					// if (state.connectionCyclePid !== null) {
					// 	clearInterval(state.connectionCyclePid);
					// 	state.connectionCyclePid = null;
					// }
					console.debug('WebSocket open', event);
				});
				
				socket.addEventListener('message', event => {
					console.debug('WebSocket message', event);
					const pack = JSON.parse(event.data);
					switch (pack.type) {
						case 'chat': commit('appendMessage', {
							type: 'chat',
							text: pack.text,
							sender: pack.sender,
						}); break
						case 'reply': commit('handleReply', pack); break;
					}
				});
				
				socket.addEventListener('close', event => {
					state.socket = null;
					commit('appendMessage', {
						type: 'info',
						text: 'Connection closed',
					});
					console.debug('WebSocket close', event)
					// if (state.connectionCyclePid === null) {
					// 	state.connectionCyclePid = setTimeout(() => {
					// 		console.log('try connect');
					// 		dispatch('connectServer');
					// 	}, 1000);
					// }
				});
			} else {
				console.log('A WebSocket already exists');
			}
		},
	},

});
