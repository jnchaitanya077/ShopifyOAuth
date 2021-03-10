const mongoose = require('mongoose');
const { Schema } = mongoose;

const store = new Schema(
    {
        storeName: String,
        accessToken: String,
        products: []
    }
)

module.exports = mongoose.model('store', store);
