module.exports = class Inv {
    constructor({
        name = '',
        id = v4(),
		nationality = '',
		story = '',
		avatar = null,
		values = {},
		inventory = [],
    }) {
        this.name = name;
        this.id = id;
        this.nationality = nationality;
        this.story = story;
        this.avatar = avatar;
        this.values = values;
        this.inventory = inventory;
    }
}