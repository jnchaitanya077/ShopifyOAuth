const crypto = require('crypto');
const axios = require('axios');
const CryptoJS = require('crypto-js');

function verifyHmac(returnValues) {

    let rebuiltString = "";
    const secret = returnValues.sharedSecret;
    const val = Object.keys(returnValues).sort();
    val.map(function (key) {
        if (key !== 'hmac' && key !== 'sharedSecret' && key !== 'apiKey') {
            rebuiltString += `${key}=` + returnValues[key] + "&"
        }
    })

    const hashDigest = rebuiltString.slice(0, rebuiltString.length - 1);
    const hash = CryptoJS.HmacSHA256(hashDigest, secret);

    return hash == returnValues.hmac;
}

function generateURL(data) {
    const buildURL = `https://${data.shop}/admin/oauth/authorize?client_id=${data.apiKey}&scope=${data.scopes}&redirect_uri=${data.redirectUri}&state=${data.nonce}&grant_options[]=${data.accessMode}`;
    return buildURL;
}

function validateShop(shop) {
    const regex = /^[a-z\d_.-]+[.]myshopify[.]com$/;
    if (shop.match(regex)) {
        return true;
    }
    return false;
}

function generateNonce() {
    return crypto.randomBytes(16).toString('hex');
}

async function generateToken(data) {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    const body = {
        client_id: data.apiKey,
        client_secret: data.sharedSecret,
        code: data.code

    }
    try {
        const response = await axios({
            method: 'post',
            url: `https://${data.shop}/admin/oauth/access_token`,
            headers: headers,
            data: body
        });
        console.log(response.data);
        return response.data

    } catch (error) {
        return { message: "Requesting access token failed.", status: 400 }

    }
}

async function getToken(returnValues) {
    // Security check 1
    const shopTest = validateShop(returnValues.shop);
    console.log("testOne " + shopTest)

    // security check 2
    const ok = verifyHmac(returnValues);
    console.log("testTwo " + ok)

    if (ok) {
        const token = await generateToken(returnValues)
        return { status: 200, accessToken: token.access_token };

    } else {
        return ({ message: "URL verificaiton failed.", status: 400 })
    }
}


module.exports = { generateURL, generateNonce, getToken }