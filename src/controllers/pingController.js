const restifyRouter = require("restify-router").Router;
const httpStatus = require("http-status");

const router = new restifyRouter();

router.get("/api/ping", (req, res, next) => {
    res.send(httpStatus.OK, {
        "version": "1.0.0",
        "status": "green"
    });

    next();
});

module.exports = router;