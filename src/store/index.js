import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { v4 as gen } from 'uuid'

import { isMobile } from '@/utils/device.js'


Vue.use(Vuex);



export default new Vuex.Store({
	state: {
		// 缓存的聊天消息
		messages: [],
		// 缓存的人物卡
		invs: {},

		valueInfos: {'111111': {name: '力量'}, '2222': {name: '幸运'}},

		selfId: gen(),

		groupInfo: {
			name: '米勒山庄之巨石阵'
		},

		socket: null,

		// connectionCyclePid: null,

		isMobile: isMobile(),

		onMessageHandlers: new Set(),

		hasLogin: false,

		bus: new Vue(),
	},

	getters: {
		self(state) {
			let invInfo = state.invs[state.selfId];
			if (!invInfo) {
				invInfo = {
					name: '张三',
					age: 20,
					avatar: null,
					nationality: '天朝',
					story: '',
					values: Object.entries(state.valueInfos).reduce((prev, [vid, {val, max}]) => {
						prev[vid] = {val: val|| 0, max: max || 100};
						return prev;
					}, {}),
					inventory: [],
				};
				state.invs[state.selfId] = invInfo;
			}
			return invInfo;
		},
	},
	
	mutations: {

		// 单纯的添加消息，若已存在则更新
		pushOrUpdateMessage(state, pack) {
			const message = state.messages.find(e => e.clientId === pack.clientId && e.sender === state.selfId);
			if (message) {
				Object.assign(message, pack);
			} else {
				state.messages.push(pack);
			}
		},
		

		// 更新人物卡
		update(state, pack) {
			if (!state.invs[pack.uuid]) {
				state.invs[pack.uuid] = pack;
			} else {
				Object.assign(state.invs[pack.uuid], pack);
			}
			state.bus.$emit('update', pack);
		},
		
	},
	
	actions: {

		// 初始化
		initialize({state, commit, dispatch}) {
			const token = new URLSearchParams(window.location.search).get('token');
			if (token) {
				state.selfId = token;
				axios.post(`http://${window.location.hostname}:8001/login`, {token})
				.then(() => dispatch('connectServer'))
				.catch(() => commit('appendMessage', {type: 'info', text: '身份验证失败'}));
			} else {
				dispatch('connectServer')
			}
		},

		// 连接至WebSocket服务器
		connectServer({state, dispatch}) {
			if (state.socket) {
				console.log('A WebSocket already exists');
				return;
			} 
			
			const socket = new WebSocket(`ws://${window.location.hostname}:8001/chat?token=${state.selfId}`);

			socket.addEventListener('open', event => {
					state.socket = socket;
					dispatch('appendMessage', {
						type: 'info',
						text: '服务器已连接',
					});
					console.debug('WebSocket open', event);
			});
			
			socket.addEventListener('message', event => {
				const pack = JSON.parse(event.data);
				console.debug('WebSocket message', pack);
				dispatch('handlePack', pack);
			});
			
			socket.addEventListener('close', event => {
				state.socket = null;
				dispatch('appendMessage', {
					type: 'info',
					text: '服务器已断开',
				});
				console.debug('WebSocket close', event);
			});
		},

		// 添加消息
		appendMessage({state, commit, dispatch}, pack) {
			commit('pushOrUpdateMessage', pack);
			if (!state.invs[pack.sender]) {
				dispatch('fetchInvInfo', pack.sender);
			}
		},

		fetchInvInfo({commit}, uuid) {
			axios.get(`http://${window.location.hostname}:8001/inv/${uuid}`)
			.then(res => commit('update', res.data))
			.catch(err => console.error(err));
		},

		commitInvInfo(store, invInfo) {
			axios.put(`http://${window.location.hostname}:8001/inv/${invInfo.uuid}`, invInfo)
			.then(() => console.debug('Inv updated', invInfo.uuid));
		},


		// 发送消息
		sendMessage({state, dispatch}, text) {
			const clientId = gen();
			const pack = {
				clientId,
				type: 'say',
				text,
			};
			const message = {
				id: null, // 由服务器分配
				clientId, // 由客户端分配
				type: 'chat',
				text,
				sender: state.selfId,
				time: Date.now(),
				err: null,
			};
			if (state.socket) {
				state.socket.send(JSON.stringify(pack));
			} else {
				message.err = 'Network fail';
			}
			dispatch('appendMessage', message);
		},

		// 处理服务器发来的消息
		handlePack({dispatch}, pack) {
			switch(pack.type) {
				case 'message': dispatch('appendMessage', pack.message); break;
				case 'update': dispatch('fetchInvInfo', pack.uuid); break;
			}
		},

		// 申请检定
		commitCheck({state}, valueId) {
			axios.post(`http://${window.location.hostname}:8001/check/${state.selfId}/${valueId}`);
		},
	},

});
