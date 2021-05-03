
/**
* @author Fasil Shaikh
*/

module.exports = { 
    /**
    * @param {(object|string)} body
    * @description Central function that can generate the response for sending the response
    */
    createResponse : (body) => {
        return {
            "statusCode": 200,
            "isBase64Encoded": false,
            "body": JSON.stringify(body),
        };
    }
};