export default {
    // 发送消息
	sendMessage(state, text) {
		const message = {
			id: null, // 由服务器分配
			clientId: gen(), // 由客户端分配
			type: 'chat',
			text: text,
			sender: state.selfId,
			time: Date.now(),
			err: null,
		};
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
}