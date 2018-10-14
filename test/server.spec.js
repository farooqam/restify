const chai = require("chai");
const expect = chai.expect;
const clientFactory = require("./clientFactory");
const serverFactory = require("./serverFactory");

var client;
var server;

describe("ping", () =>{
    before((done) => {
        client = clientFactory.createClient();
        server = serverFactory.createServer();
        done();
    });

    after((done) => {
        client.close();
        server.close(done);
    });

    it("should return expected response", (done) => {
        client.get("/api/ping", (err, _, res) => {
            expect(err).to.be.null;
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
}
);

describe("task API post", () =>{
    before((done) => {
        client = clientFactory.createClient();
        server = serverFactory.createServer();
        done();
    });

    after((done) => {
        client.close();
        server.close(done);
    });

    it("should return the new task", (done) => {
        const expectedTask = {"id": 1, "name": "foo", "dueDate": "1-1-2000"};

        client.post(
            "/api/tasks",
            expectedTask,
            (err, _, res, actualTask) => {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(201);
                expect(actualTask.id).to.not.equal(expectedTask.id);
                expect(actualTask.name).to.equal(expectedTask.name);
                expect(actualTask.dueDate).to.equal(expectedTask.dueDate);
                done();
            });
    });
}
);

describe("task API get", () =>{
    before((done) => {
        client = clientFactory.createClient();
        server = serverFactory.createServer();
        done();
    });

    after((done) => {
        client.close();
        server.close(done);
    });

    it("should return the expected task", (done) => {
        const expectedTask = {"id": 1, "name": "foo", "dueDate": "1-1-2000"};
        var expectedTaskId;

        client.post(
            "/api/tasks",
            expectedTask,
            (err, _, __, task) => {
                expect(err).to.be.null;
                expectedTaskId = task.id;
            });

        client.get(
            `/api/tasks/${expectedTaskId}`,
            (err, _, res, actualTask) => {
                expect(err).to.be.null;
                expect(res.statusCode).to.equal(200);
                expect(actualTask.id).to.equal(expectedTaskId);
                expect(actualTask.name).to.equal(expectedTask.name);
                expect(actualTask.dueDate).to.equal(expectedTask.dueDate);
            });

        done();
    });
}
);

