require('dotenv').config({ path: "../.env" });
const express = require('express');
const path = require('path');

// routes import
const index = require("./routes/index");
const shopify = require("./routes/shopify");


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", index);
app.use("/shopify", shopify);


module.exports = app;
