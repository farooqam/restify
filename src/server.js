const restify = require("restify");
const restifyLogger = require("restify-logger");
const restifyErrors = require("restify-errors");
const winston = require("winston");
const uuid = require("uuid/v1");
const _ = require("lodash");
const httpStatus = require("http-status");

exports.initServer = function(restify, serverSettings) {
    if(!restify) {
        throw new Error("Pass in a Restify object");
    }

    if (!serverSettings) {
        throw new Error("Pass in a server settings object.");
    }

    const server = restify.createServer();

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

    server.get("/api/ping", (req, res, next) => {
        res.send(httpStatus.OK, {
            "version": "1.0.0",
            "status": "green"
        });

        return next();
    });

    const tasks = [];

    server.post("/api/tasks", (req, res, next) => {

        if(!req.body) {
            return next(new restifyErrors.InvalidArgumentError("Ivalid request body."));
        }

        if (!req.body.name) {
            return next(new restifyErrors.InvalidArgumentError("Task name not provided."));
        }

        if (!req.body.dueDate) {
            return next(new restifyErrors.InvalidArgumentError("Task due date not provided."));
        }

        const newTask = {
            "id": uuid(),
            "name": req.body.name,
            "dueDate": req.body.dueDate
        };

        tasks.push(newTask);

        res.send(httpStatus.CREATED, newTask);
        return next();
    });

    server.get("/api/tasks/:id", (req, res, next) => {

        const task = _.find(tasks, (t) => {
            return t.id == req.params.id;
        });

        if (!task) {
            return next(new restifyErrors.NotFoundError(`Task with id "${req.params.id}" not found.`));
        }

        res.send(httpStatus.OK, task);
        return next();
    });

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