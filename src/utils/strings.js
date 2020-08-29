const CHINESE_NUMBERS = '〇幺贰叁肆伍陆柒捌玖';
const CHINESE_LETTERS = '阿波可德俄夫哥合伊基克勒莫恩欧派科日斯特吴福伍士易兹';
function genName(id = '000') {
	return id.slice(-3).split('').map(e => {
		let index = Number(e);
		if (!isNaN(index)) {
			return CHINESE_NUMBERS[index];
		} else {
			e = e.toUpperCase();
			index = e.codePointAt(0) - 'A'.codePointAt(0);
			return (index >= 0 && index < CHINESE_LETTERS.length) ? CHINESE_NUMBERS[index] : e;
		}
	}).join('');
}

export {
    genName,
}