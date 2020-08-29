const { v4 } = require('uuid');

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
        this.invs = {};
        Object.entries(invs).forEach(([uuid, d]) => invs[uuid] = new Inv(d));
        this.items = {};
        Object.entries(items).forEach(([uuid, d]) => items[uuid] = new Item(d));
        this.valueInfos = {};
        Object.entries(valueInfos).forEach(([uuid, d]) => valueInfos[uuid] = new ValueInfo(d));
        this.accountRefferences = accountRefferences,
        this.messages = messages;
    }
}

module.exports = Group;