const CocEvent = require('./CocEvent.js');

class UpdateEvent extends CocEvent {
    constructor(group, player, inv) {
        super(group, player, inv);
    }
}

module.exports = UpdateEvent;