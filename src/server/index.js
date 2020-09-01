const fs = require('fs');
const express = require('express');
const expressWs = require('express-ws');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const game = require('./game.js');
const { v4 } = require('uuid');
const { purify } = require('../utils/objects.js');

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
server.use(cookieParser());

server.all('*', cors());

// 连接合法性验证
server.use((req, res, next) => {
    if (
        // req.cookies && validateToken(req.cookies.token) 
        getToken(req)
        || req.path === '/login') {
        next();
    } else {
        res.status(403).end();
    }
});

// 聊天室连接
server.ws('/chat', (socket, req) => {
    const token = getToken(req);
    console.log('WebSocket open', token);
    if (!validateToken(token)) {
        console.warn('Invalid token', token);
        socket.send({type: 'error', err: 'Invalid token'});
        socket.close(-1, 'Invalid token: ' + token);
    } else {
        console.log('Valid token', token);
        initializeClientSocket(socket, token);
    }
});


// 获取验证
const ipTokenMap = {};
server.get('/login', (req, res) => {
    const token = req.query.token;
    console.log('Get', '/login', token);
    login(req, res, token);
});
server.post('/login', (req, res) => {
    const token = req.body ? req.body.token : null;
    console.log('Post', '/login', token);
    login(req, res, token);
});


// 获取人物卡
server.get('/inv/:uuid', (req, res) => {
    const uuid = getToken(req);
    console.log('Get', '/inv/', uuid);
    const inv = game.group.invs[uuid];
    if (inv) {
        res.json(purify(inv, 'group')).end();
    } else {
        res.json(DEFAULT_INV).end();
    }
});

const DEFAULT_INV = {
    name: '张三',
    age: 20,
    avatar: null,
    nationality: '天朝',
    story: '',
    values: {},
    inventory: [],
};

// 修改人物卡
server.put('/inv/:uuid', (req, res) => {
    const source = getToken(req);
    const uuid = req.params.uuid;
    console.log('Put', '/inv/', uuid);
    const pack = req.body;
    if (!pack) {
        res.status(403).end();
        return;
    }
    game.group.getInv(uuid, true).update(pack);
    res.end();
});



server.addListener('close', () => console.log('Server close'));

//#endregion

//#region 注册游戏事件

game.addListener('message', (group, source, message) => broadcast({type: 'message', message}));
game.addListener('update', (group, source) => broadcast({type: 'update', uuid: source}));

//#endregion

// 启动服务器
server.listen(8001, () => console.log('Server start'));


//#region 一些工具方法

function login(req, res, token) {
    if (validateToken(token)) {
        console.log('Login succeeded', token);
        ipTokenMap[req.ip] = token;
        game.group.ensureInvExist(token);
        res.cookie('token', token, {maxAge: 60 * 60 * 24 * 2});
        res.send('Login succeeded: ' + token);
    } else {
        console.log('Login failed', token);
    }
}

// 获取Token
function getToken(req) {
    return ipTokenMap[req.ip];
}

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
    const pack = JSON.parse(msg);
    game.handlePack(token, pack);
}

// 定时保存
// setInterval(() => {
//     fs.writeFile('./game.json', JSON.stringify(game.group), () => console.log(`${new Date()} 保存完毕`));
// }, 60 * 1000);

//#endregion



// function handlePack(pack, socket) {
//     const msg = JSON.stringify(pack);
//     server.clients.forEach(client => client.send(msg));
// }