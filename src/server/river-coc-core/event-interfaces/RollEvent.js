const CocEvent = require('./CocEvent.js');

class RollEvent extends CocEvent {
    constructor(group, player, inv, valueId, oldVal, oldMax) {
        super(group, player, inv);
        this.valueId = valueId;
        this.oldVal = oldVal;
        this.oldMax = oldMax;
    }
}

module.exports = RollEvent;