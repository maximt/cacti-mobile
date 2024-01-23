class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    clear() {
        this.store = {};
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = String(value);
    }

    removeItem(key) {
        delete this.store[key];
    }
}

class CactiMock {
    response = null

    constructor() {
    }

    setFakeResponse(resp) {
        this.response = resp
    }

    setUrl(url) {
        this.url = url
    }
    
    setToken(token) {
        this.token = token
    }

    async getHosts() {
        if (!this.url) {
            throw new Error('No url')
        }

        if (!this.token) {
            throw new Error('No token')
        }
        
        return this.response
    }
}

export { LocalStorageMock, CactiMock }

