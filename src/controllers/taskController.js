const restifyRouter = require("restify-router").Router;
const restifyErrors = require("restify-errors");
const httpStatus = require("http-status");
const uuid = require("uuid/v1");
const _ = require("lodash");

const router = new restifyRouter();

router.get("/api/tasks/:id", (req, res, next) => {

    const task = _.find(tasks, (t) => {
        return t.id == req.params.id;
    });

    if (!task) {
        return next(new restifyErrors.NotFoundError(`Task with id "${req.params.id}" not found.`));
    }

    res.send(httpStatus.OK, task);
    return next();
});


const tasks = [];

router.post("/api/tasks", (req, res, next) => {

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

module.exports = router;