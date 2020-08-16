const { v4 } = require('uuid');

exports = class Group {
    constructor({
        name = '',
        id = v4(),
        invs = {},
        items = {},
        valueInfos = {},
        accountRefferences = {},
        messages = [],
    }) {
        this.name = name;
        this.id = id;
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