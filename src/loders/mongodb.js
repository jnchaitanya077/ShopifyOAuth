const mongoose = require('mongoose');
require('dotenv').config({ path: "./../../.env" })

module.exports = () => {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(console.log("Successfully Connected to DB"))
        .catch()
}

