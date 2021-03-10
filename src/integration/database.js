const Store = require('../models/store');

async function addNewStore(store) {
    const newStore = new Store(store);
    try {
        await newStore.save();
        return { status: 200 };
    } catch (error) {
        return { status: 400 };
    }
}

async function isStoreTokenPresent(store) {
    try {
        const res = await Store.findOne({ storeName: store });
        return res;
    } catch (error) {
        console.log(err);
        return;
    }

}

async function getStoreTokenFromDb(store) {
    const res = await Store.findOne({ storeName: store });
    console.log(`form DB: ${res}`);
    return res;
}

module.exports = { addNewStore, isStoreTokenPresent, getStoreTokenFromDb };