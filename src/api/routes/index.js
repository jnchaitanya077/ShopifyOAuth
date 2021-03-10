require('dotenv').config({ path: "../../.env" });
const express = require('express');

const router = new express.Router();

// function imports
const repository = require('../../service/authentication');
const dataBaseClient = require('../../service/databaseClient');

router.get("/", (req, res) => {
    res.send("everything is cool");
})

router.get("/install", async (req, res) => {

    let shop = req.query.shop;
    let isTokenized = await dataBaseClient.isStoreTokenized(shop);
    console.log(isTokenized)
    if (!isTokenized) {
        const nonce = repository.generateNonce();
        const url = repository.generateURL({
            shop: shop,
            apiKey: process.env.API_KEY,
            sharedSecret: process.env.SECRET,
            scopes: "write_products,read_products,write_orders,read_customers",
            redirectUri: "http://localhost:8000/callback",
            nonce: nonce,
            accessMode: "pre-user"
        });
        res.redirect(url);
    } else {
        res.redirect(`/shopify/products?shop=${shop}`);
    }

})

router.get("/callback", async (req, res) => {
    console.log("Entered callback")
    const returnValues = {
        code: req.query.code,
        hmac: req.query.hmac,
        shop: req.query.shop,
        state: req.query.state,
        timestamp: req.query.timestamp,
        sharedSecret: process.env.API_SECRET,
        apiKey: process.env.API_KEY
    }
    let response;
    try {
        response = await repository.getToken(returnValues);
    } catch (error) {
        console.log(error);
    }


    if (response.status == 200) {
        // save token to db and redirect to shop page
        const newStore = {
            storeName: req.query.shop,
            accessToken: response.accessToken,
            products: []
        }
        let { status } = await dataBaseClient.addTokenToDB(newStore);
        (status == 200) ? res.send("success") : res.send(`failed`);
    } else {
        res.send(response);
    }

})


module.exports = router;

