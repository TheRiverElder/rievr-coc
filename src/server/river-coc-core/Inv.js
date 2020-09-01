const { check, Hardness, genUuid, roll } = require('./utils/random.js');
const { toJson } = require('../../utils/objects.js');

class Inv {
    constructor({
        name = '无名氏',
        uuid = v4(),
		nationality = '天朝',
		story = '庸庸碌碌',
		avatar = null,
		values = {},
		inventory = [],
    }) {
        this.name = name;
        this.uuid = uuid;
        this.nationality = nationality;
        this.story = story;
        this.avatar = avatar;
        this.values = values;
        this.inventory = inventory;

        this.group = null;
    }

    bind(group) {
        this.group = group;
        return this;
    }

    emit(key, event) {
        if (this.group && this.group.game) {
            this.group.game.emit(key, this.uuid, event);
        }
    }

    /**
     * 调查员说话，即先该组的聊天界面推送新的消息
     * @param {String} text 要讲出的话
     * @param {String} clientId 客户端ID，可为空
     */
    say(text, clientId = null) {
        this.group.appendMessage({
            clientId,
            type: 'chat',
            text,
            sender: this.uuid,
        });
    }

    /**
     * 对调查员的某个数值进行检定
     * @param {String} valueId 要检定的数值的ID
     * @param {Number} hardness 难度，1大失败，2普通失败，3普通成功，4困难成功，5极难成功，6大成功
     * @param {Number} fix 修正值，在计算时该数值会加上fix再与投掷结果比较
     */
    check(valueId, hardness = Hardness.NORMAL_SUCCESS, fix = 0) {
        const value = this.values[valueId];
        const result = check(value.val, value.max, hardness, fix);
        this.group.appendMessage({
            // type: 'dice',
            type: 'info',
            text: `${this.name}检定${this.group.valueInfos[valueId].name}(${value.val}/${value.max})，结果为：${result.success ? '成功' : '失败'}(${result.points})`,
            sender: this.uuid,
        });
    }

    /**
     * 进行一次简单的投掷
     * @param {String} dice 骰子表达式
     */
    roll(dice) {
        const result = roll(dice);
        this.group.appendMessage({
            // type: 'dice',
            type: 'info',
            text: `${this.name}投掷${dice}，结果为：${result}`,
            sender: this.uuid,
        });
    }

    /**
     * 用新的数据覆盖原有的数据
     * @param {Object} info 新的数据
     */
    update(info) {
        this.name = info.name;
        this.nationality = info.nationality;
        this.story = info.story;
        this.avatar = info.avatar;
        this.values = info.values;
        this.inventory = info.inventory;
        this.emit('update', this.uuid);
    }

    toJson() {
        return toJson(this, 'group');
    }
}

module.exports = Inv;