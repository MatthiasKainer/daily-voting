function getHash() {
    let params = {};
    let { hash } = window.location;
    if (!hash || hash.length < 1) return params;
    return hash.substring(1).split('&').reduce((previous, keyValue) => {
        const parts = keyValue.split('=');
        if (parts.length === 1) {
            previous[parts[0]] = true;
        } else if (parts.length === 2) {
            previous[parts[0]] = parts[1];
        }
        return previous;
    }, params);
}

const hash = getHash();
export { hash };