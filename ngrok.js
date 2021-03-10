require('dotenv').config();
const ngrok = require('ngrok');
(async function () {
    const url = await ngrok.connect(process.env.PORT);
    console.log(`localhost redirects to => ${url}`)
})();
