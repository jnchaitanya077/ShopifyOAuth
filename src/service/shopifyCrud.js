const repository = require("./databaseClient")
const axios = require('axios');
const { head } = require("../api/app");

async function getProductsFromStore(store) {
    let { accessToken } = await repository.getStoreAccessToken(store);
    console.log(`crud repo: ${accessToken}`);
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
    };
    try {
        const products = await axios({
            method: 'get',
            url: `https://${store}/admin/api/2021-01/products.json`,
            headers: headers,
        });
        console.log(products.data);
        return products.data;

    } catch (error) {
        console.log(error);
        return { message: "Something went wrong." };
    }


}

async function createProduct(productDetails, store) {
    let { accessToken } = await repository.getStoreAccessToken(store);
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
    }
    try {
        const response = await axios({
            method: 'post',
            url: `https://${store}/admin/api/2021-01/products.json`,
            headers: headers,
            data: productDetails,
        });
        console.log(`creation status : ${response.statusText}`);
        return response.statusText;
    } catch (error) {
        console.log(error);
        return { message: "something went wrong" };
    }

}

async function updateProductOnStore(updatedDetails, store) {
    let { accessToken } = await repository.getStoreAccessToken(store);
    let productId = updatedDetails.product.id;
    console.log(productId);
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
    }
    try {
        const response = await axios({
            method: "put",
            url: `https://${store}/admin/api/2021-01/products/${productId}.json`,
            headers: headers,
            data: updatedDetails,
        });
        return response;

    } catch (error) {
        console.log(error);
        return { message: "Something went wrong" }

    }

}

async function deleteProductFromStore(productId, store) {
    let { accessToken } = await repository.getStoreAccessToken(store);
    console.log(productId);

    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
    }
    try {
        const response = await axios({
            method: "delete",
            url: `https://${store}/admin/api/2021-01/products/${productId}.json`,
            headers: headers,
        });
        return response;

    } catch (error) {
        console.log(error);
        return { message: "Something went wrong" }

    }

}

module.exports = { getProductsFromStore, createProduct, updateProductOnStore, deleteProductFromStore }