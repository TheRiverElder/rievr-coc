function deepCopy(ipt) {
    if (ipt === null || ipt === undefined) {
        return ipt;
    }
    switch (typeof ipt) {
        case 'number': return ipt;
        case 'string': return ipt;
        case 'boolean': return ipt;
        case 'object': return Array.isArray(ipt) ? 
            ipt.map(e => deepCopy(e)) : 
            Object.entries(ipt).reduce((p, [k, v]) => (p[k] = deepCopy(v), p), {});
        default: return ipt;
    }
}

function purify(obj, ...exceptKeys) {
    const no = Object.assign({}, obj);
    exceptKeys.forEach(k => delete no[k]);
    return no;
}

module.exports = {
    deepCopy,
    purify,
}