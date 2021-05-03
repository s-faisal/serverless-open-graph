//Include the mocha plugin
const mochaPlugin = require('serverless-mocha-plugin')
//Extract expect module from the plugin for further check
const expect = mochaPlugin.chai.expect;
//Generates a wrapper for the processing of serverless API testing
const fetchMetadata = mochaPlugin.getWrapper('handler','/services/fetch_metadata.js', 'handler');


/**
* @author Fasil Shaikh
*/
describe("Get Open Graph Metadata", () => {

    it('Should_Pass_IfValidURLPassed', async () => {
        var req = {
            url: "https://npmjs.com/package/str2bin"
        }
        return fetchMetadata.run({body: JSON.stringify(req)}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.title).to.not.be.equal('');
            expect(body.description).to.not.be.equal('');
            expect(body.images.length).to.not.be.equal(0);
        });
    });

    it('Should_Fail_IfInvalidURLPassed', async () => {
        var req = {
            url: "not a valid URL"
        }
        return fetchMetadata.run({body: JSON.stringify(req)}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.error).to.not.be.equal('');
            expect(body.error).to.be.equal('Invalid URL');
        });
    });

    it('Should_Fail_IfEmptyURLPassed', async () => {
        var req = {
            url: ""
        }
        return fetchMetadata.run({body: JSON.stringify(req)}).then((response) => {
            let body = JSON.parse(response.body);
            expect(response.statusCode).to.be.equal(200);
            expect(body.error).to.not.be.equal('');
            expect(body.error).to.be.equal('Invalid URL');
        });
    });
});