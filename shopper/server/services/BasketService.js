class BasketService {
    constructor(client, userID) {
        this.client = client;
        this.key = `basket:${userID}`;
    }

    async add(itemID) {
        return this.client.hincrby(this.key, itemID, 1);
    }

    async getAll() {
        return this.client.hgetall(this.key);
    }

    async remove(itemID) {
        return this.client.hdel(this.key, itemID);
    }
}

module.exports = BasketService;
