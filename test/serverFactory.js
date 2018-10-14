const restify = require("restify");
const server = require("../src/server");

exports.createServer = function() {
    return server.initServer(restify, {});
};