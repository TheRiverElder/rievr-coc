function deepCopy(ipt) {
    switch (typeof ipt) {
        case 'number': return ipt;
        case 'string': return ipt;
        case 'boolean': return ipt;
        case 'object': return Array.isArray(ipt) ? 
            Array.map(e => deepCopy(e)) : 
            Object.entries(ipt).reduce((p, [k, v]) => (p[k] = deepCopy(v), p), {});
        default: return ipt;
    }
}

export {
    deepCopy,
}