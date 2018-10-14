const restifyClient = require("restify-clients");

exports.createClient = function() {
    const requestTimeout = 100;
    const uri = "http://127.0.0.1:8080";

    return restifyClient.createJsonClient({
        "url": uri,
        "requestTimeout": requestTimeout
    });
};