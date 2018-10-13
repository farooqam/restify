//const restifyServer = require("restify");
const server = require("../src/server");
const restifyClient = require("restify-clients");
//const chai = require("chai");
//const expect = chai.expect;
const assert = require("assert");
//const should = require("should");

var client;

describe("ping", () =>{
    before(() => {
        client = restifyClient.createJsonClient({
            "url": "http://127.0.0.1:8080"
        });
        /*server = restifyServer.createServer();
        server.listen(7070, "127.0.0.1", function() {
            client = restifyClient.createJsonClient({
                "url": "http://127.0.0.1:7070",
                "requestTimeout": 1000
            });
        });*/
    });

    after(() => {
        server.close();
    });

    it("should return expected response", () => {
        client.get("/api/ping", (err, _, res) => {
            assert.ifError(err);
            assert.equal(res.statusCode, 333);
        });
    });
}
);

