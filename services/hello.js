const {createResponse} = require("../lib/create_response")

/**
* @author Fasil Shaikh
*/
module.exports = {
    /**
    * @param {object} event
    * @param {object} context
    * @param {callback} callback
    * @description A sample hello world function (Following the protocol)
    */
    handler : async (event, context, callback) => {
        try {
            //Calls the generate response function for sending the message to the user
            let res  = createResponse("Hello World!!");
            callback(null, res)
        } catch (e) {
            //Validates the error message
            let res = {error: (e.message) ? e.message : "Something went wrong"};

            //Calls the generate response function for sending the error message to the user
            res = createResponse(res);
            callback(null, res)
        }
    }
}