const { EventEmitter } = require('events');
const Group = require('./river-coc-core/Group.js');
const Inv = require('./river-coc-core/Inv.js');


// 使用持久化的数据恢复跑团数据
function loadGroup() {
    return null;
}


// 新建一个新的跑团记录
function createNewGroup() {
    return new Group({
        name: '新团子' + Date.now(),
    });
}

/**
 * 跑团游戏
 * 事件列表：
 * 其中的type为事件类型，为字符串类型，source为事件来源，为一个用户的uuid或者'system'
 * 
 * type: 'update'
 * source: String
 * group: Group
 * data: {
 *     uuid: String,
 *     baseInfo?: {
 *         name: String,
 *         age: Number, 
 *         nationality: String,
 *         story: String, 
 *         avatar: String,
 *     },
 *     values?: {valueInfoUUID: {val: Number, max?: Number}},
 *     inventory?: [itemUUID],
 * }
 * 当人物卡更新时触发，参数为改变的部分，但数据并不是一定发生了变化，仅仅是有一次变化被提交了
 * 
 * type: 'message'
 * source: String
 * group: Group
 * data: {
 *     sender: String,
 *     type: 'chat' | 'result' | 'system',
 *     text: String,
 * }
 * 当有一个人或者系统发送信息，其中sender为发送者ID
 */
class Game extends EventEmitter {
    
    constructor() {
        super();
        this.group = loadGroup() || createNewGroup();
        this.group.bind(this);
    }

    /**
     * 更新角色卡，并触发'update'事件
     * @param {String} source 发起者
     * @param {String} uuid 要更新的角色UUID
     * @param {Object} pack 更新内容
     * @returns {Boolean} 若更新成功则返回true，否则返回false
     */
    update(source, uuid, pack) {
        let inv = this.group.invs[uuid];
        if (!inv) {
            inv = new Inv(pack);
            this.group.invs[uuid] = inv;
            this.emit('update', source, this.group, inv);
            return true;
        } else {
            Object.assign(inv, pack);
            this.emit('update', source, this.group, pack);
            return true;
        }
    }

    /**
     * 发送消息，并触发'message'事件
     * @param {String} source 消息来源
     * @param {Object} message 消息内容，其中的sender字段应该与source一致
     * @returns {Boolean} 发送成功则返回true，否则返回false
     */
    appendMessage(source, message) {
        this.group.messages.push(message);
        this.emit('message', source, this.group, message);
        return true;
    }

    handlePack(senderUuid, pack) {
        const sender = this.group.getInv(senderUuid, true);
        switch(pack.type) {
            case 'say': sender.say(pack.text, pack.clientId); break;
            case 'check': sender.check(pack.valueId, pack.hardness); break;
            case 'roll': sender.roll(pack.dice); break;
        }
    }

}

const game = new Game();

module.exports = game;