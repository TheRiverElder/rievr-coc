const { v4 } = require('uuid');
const Inv = require('./Inv');

class Group {
    constructor({
        name = '',
        uuid = v4(),
        invs = {},
        items = {},
        valueInfos = {},
        accountRefferences = {},
        messages = [],
    }) {
        this.name = name;
        this.uuid = uuid;
        this.invs = Object.entries(invs).reduce((invs, [uuid, d]) => (invs[uuid] = (new Inv(d)).bind(this), invs), {});
        this.items = Object.entries(items).reduce((items, [uuid, d]) => (items[uuid] = new Item(d), items), {});
        this.valueInfos = valueInfos;
        this.accountRefferences = accountRefferences;
        this.messages = messages;

        this.game = null;
    }

    bind(game) {
        this.game = game;
        return this;
    }

    getInv(uuid, ensureExist = false) {
        return ensureExist ? this.ensureInvExist(uuid) : this.invs[uuid];
    }

    ensureInvExist(uuid) {
        let inv = this.invs[uuid];
        if (!inv) {
            inv = new Inv({uuid}).bind(this).resetValues();
            this.invs[uuid] = inv;
        }
        return inv;
    }

    appendMessage(message) {
        message.id = v4();
        message.time = Date.now();
        this.messages.push(message);
        if (this.game) {
            this.game.emit('message', this, message.sender, message);
        }
    }
}

module.exports = Group;