require('dotenv').config({ path: "../../.env" });
const express = require('express');
const repository = require('../../service/shopifyCrud');

const router = new express.Router();

router.get("/products", async (req, res) => {
    let shop = req.query.shop;
    let requiredFields = req.body.fields;
    let requiredIds = req.body.id;
    console.log(requiredFields, requiredIds)

    if (shop) {
        try {
            const products = await repository.getProductsFromStore(shop, requiredFields, requiredIds);
            console.log(products);
            res.send(products);

        } catch (error) {
            res.send(error);
        }

    } else {
        res.send("Enter your store");
    }
});

router.post("/createProducts", async (req, res) => {
    let shop = req.query.shop;
    let productsData = req.body;
    console.log(productsData);

    if (productsData) {
        try {
            const products = await repository.createProduct(productsData, shop);
            // console.log(`recived from shopify crud: ${products}`)
            res.send({ status: products });

        } catch (error) {
            res.send({ status: error });
        }

    } else {
        res.send("Enter product details");
    }
});

router.put("/updateProduct", async (req, res) => {
    let shop = req.query.shop;
    let newUpdatedProductDetails = req.body;

    if (newUpdatedProductDetails) {
        try {
            const products = await repository.updateProductOnStore(newUpdatedProductDetails, shop);
            // console.log(`recived from shopify crud: ${products}`)
            res.send({ status: products });

        } catch (error) {
            res.send({ status: error });
        }

    } else {
        res.send("Enter product details");
    }
});

router.delete("/deleteProduct", async (req, res) => {
    let shop = req.query.shop;
    let productToBeDeleted = req.body.id;
    console.log(productToBeDeleted)

    if (productToBeDeleted) {
        try {
            const products = await repository.deleteProductFromStore(productToBeDeleted, shop);
            // console.log(`recived from shopify crud: ${products}`)
            res.send({ status: products });

        } catch (error) {
            res.send({ status: error });
        }

    } else {
        res.send("Enter product ID");
    }

})


module.exports = router;


