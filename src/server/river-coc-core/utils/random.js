const { v4 } = require('uuid');

function randInt(var1, var2) {
    let min, max;
    if ('number' === typeof var1) {
        if ('number' === typeof var2) {
            min = var1;
            max = var2;
        } else {
            min = 0;
            max = var1;
        }
    } else {
        min = 0;
        max = 100;
    }
    return Math.floor(Math.random() * (max - min) + min);
}


function check(val, max, hardness = 3, fix = 0) {
    const finalVal = val + fix;
    const hardVal = Math.floor(finalVal / 2);
    const extrameVal = Math.floor(finalVal / 5);
    const points = randInt(max) + 1;
    let level = 0;
    if (points <= 5) {
        level = 6;
    } else if (points <= extrameVal) {
        level = 5;
    } else if (points <= hardVal) {
        level = 4;
    } else if (points <= finalVal) {
        level = 3;
    } else if (points <= 95) {
        level = 2;
    } else {
        level = 1;
    }
    const success = level >= hardness;
    return {
        val, // 要检定的数值
        max, // 检定数值最大值，即随机数的上限
        fix, // 修正值
        hardness, // 难度，为3,4,5
        success, // 是否检定成功
        points, // 检定结果点数
        level, // 检定结果的等级 1大失败，2普通失败，3普通成功，4困难成功，5极难成功，6大成功
    };
}

const Hardness = Object.freeze({
    GREAT_FAILURE: 1,
    FAILURE: 2,
    NORMAL_SUCCESS: 3,
    HARD_SUCCESS: 4,
    EXTRAME_SUCCESS: 5,
    GREAT_SUCCESS: 6,
});

function roll(dice) {
    console.log(dice);
    return randInt(100) + 1;
}

module.exports = {
    randInt,
    check,
    Hardness,
    genUuid: v4,
    roll,
};