module.exports = class Inv {
    constructor({
        name = '',
        uuid = v4(),
		nationality = '',
		story = '',
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
    }
}