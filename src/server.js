const restify = require("restify");
const restifyLogger = require("restify-logger");
const winston = require("winston");
const pingController = require("./controllers/pingController");
const taskController = require("./controllers/taskController");


exports.initServer = function(restify, serverSettings) {
    if(!restify) {
        throw new Error("Pass in a Restify object");
    }

    if (!serverSettings) {
        throw new Error("Pass in a server settings object.");
    }

    const server = restify.createServer();

    pingController.applyRoutes(server);
    taskController.applyRoutes(server);

    const logger = winston.createLogger({
        "level": "info",
        "format": winston.format.json(),
        "transports": [
            new winston.transports.Console(),
        ]
    });

    restifyLogger.format("log-request-format", ":method :url :status");

    server.pre(restify.plugins.pre.dedupeSlashes());
    server.use(restifyLogger("log-request-format"));
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.bodyParser());

    var port = 8080;

    if(serverSettings.port) {
        port = serverSettings.port;
    }

    var uri = "127.0.0.1";

    if(serverSettings.uri) {
        uri = serverSettings.uri;
    }

    server.listen(port, uri, () => {
        logger.log("info", `${server.name} listening at ${server.url}`);
    });

    return server;
};

if(!module.parent) {
    exports.initServer(restify, {});
}