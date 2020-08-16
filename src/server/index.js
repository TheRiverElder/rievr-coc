const fs = require('fs');
const express = require('express');
const expressWs = require('express-ws');
const expressWs = require('express-ws');
const game = require('./data-manager.js');

// const STATE_WAITING_TOKEN = 1;
// const STATE_WAITING_PACK = 2;
// const STATE_WAITING_CLOSED = 3;

// 初始化服务器连接相关的数据

// const connnectionStates = new Map();
const connnectionAccouts = new Map();
const connnectionAccoutsReversed = new Map();


// 创建服务器
const ewss = expressWs(express());
const server = ewss.app; 

//#region 服务器初始化

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use((req, res, next) => {
    if (validateToken(req.cookies.token)) {
        next();
    } else if (req.method === 'get' && validateToken(req.body)) {
        res.cookie('token', req.body, {maxAge: 60 * 60 * 24 * 2});
        req.cookies.token = req.body;
        next();
    } else {
        res.end();
    }
});

// 聊天室连接
server.ws('/chat/', (socket, req) => {
    const token = req.cookies.token;
    console.log('WebSocket open', token);
    if (!token || !validateToken(token)) {
        console.warn('Invalid token', token);
        socket.send({type: 'error', err: 'Invalid token'});
        socket.close(-1, 'Invalid token: ' + token);
    } else {
        console.log('Valid token', token);
        initializeClientSocket(socket, token);
    }
});


// 获取人物卡
server.get('/inv/:uuid', (req, res) => {
    const uuid = req.params.uuid;
    console.log('Get', '/inv/' + uuid);
    const group = getCurrentGroup();
    const inv = group.invs[uuid];
    res.json(inv);
    res.end();
});

// 修改人物卡
server.put('/inv/:uuid', () => {
    const source = req.cookies.token;
    const uuid = req.params.uuid;
    console.log('Put', '/inv/' + uuid);
    const pack = req.body;
    if (!pack) {
        res.end();
        return;
    }
    game.update(source, uuid, pack);
    res.end();
});



server.addListener('close', () => console.log('Server close'));

//#endregion

//#region 注册游戏事件

game.addListener('update', (source, group, data) => broadcast(data));

game.addListener('message', (source, group, message) => broadcast(message));

//#endregion

// 启动服务器
server.listen(8001, () => console.log('Server start'));


//#region 一些工具方法

// 广播信息
function broadcast(data) {
    console.log('boradcast', data);
    if ('object' === typeof data) {
        data = JSON.stringify(data);
    }
    ewss.getWss().clients.forEach(client => client.send(data));
}

// 发送回执
function reply(socket, id, errorOrSuccess = true) {
    const pack = {
        type: 'reply',
        id,
    };
    if ('string' === typeof errorOrSuccess) {
        pack.success = false;
        pack.err = errorOrSuccess;
    } else {
        pack.success = !!errorOrSuccess;
    }
    socket.send(JSON.stringify(pack));
}

// 检查token合法性
function validateToken(token) {
    return token && ('string' === typeof token);
}

//#endregion

//#region WebSocket生命周期

// 初始化WS
function initializeClientSocket(socket, token) {
    socket.token = token;
    connnectionAccouts.set(socket, token);
    connnectionAccoutsReversed.set(token, socket);
    socket.addListener('message', msg => handleMessage(msg, token, socket, ewss));
    socket.addListener('close', () => cleanClientSocket(socket, token));
}


// 关闭连接时调用
function cleanClientSocket(socket, token) {
    console.log('Close', token);
    connnectionAccouts.delete(socket);
    connnectionAccoutsReversed.delete(token);
}

/**
 * 处理从客户端发来的信息
 * @param {Object} msg 信息
 * @param {WebSocket} socket 连接
 */
function handleMessage(msg, token, socket) {
    console.log('Receive', token + ': ' + msg);
    const message = JSON.parse(msg);
    if (pack.type === 'chat') {
        game.appendMessage(token, message);
        reply(socket, pack.id, true);
    } else {
        reply(socket, pack.id, 'Unknown action id: ' + pack.id);
    }
}

// 定时保存
setInterval(() => {
    fs.writeFile('./game.json', JSON.stringify(game.group), () => console.log(`${new Date()} 保存完毕`));
}, 60 * 1000);

//#endregion



// function handlePack(pack, socket) {
//     const msg = JSON.stringify(pack);
//     server.clients.forEach(client => client.send(msg));
// }