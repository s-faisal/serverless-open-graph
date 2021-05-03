const {createResponse} = require("../lib/create_response")
const openGraph = require("open-graph-scraper")
const cheerio = require('cheerio');
const path = require('path')

/**
* @author Fasil Shaikh
*/
module.exports = {
    /**
    * @param {object} event
    * @param {object} context
    * @param {callback} callback
    * @description Below function parse the URL to get the Open graph metadata if present, and if not it scrapes the page to find the same.
    */
    handler : async (event, context, callback) => {
        try {
            event.body = JSON.parse(event.body)
            const options = { url: event.body.url}                

            //Set the url passed by the user in option and pass to the module for parsing
            await openGraph(options)
            .then(async (data)=>{

                //Destruct the data received in the respective variables
                const { error, result, response } = data
                let res;
                if(error){

                    //Send the given of custom error to the user
                    res = {error: (error.result && error.result.error) ? error.result.error : "Something went wrong!"};
                    res = createResponse(res);
                    callback(null, res)
                }else{
                    if(result){

                        //Pass the webpage body and result to the formatter to fill the blanks spaces(if any) of metadata
                        await formatMetadata(response.body, result)

                        //Set the parameters on their respective places
                        res = {
                            title : (result.ogTitle) ? result.ogTitle : "",
                            description : (result.ogDescription) ? result.ogDescription : "",
                            images: []
                        }

                        //If there is single images, we receive it as object. Convets the object to array of object for generic parsing
                        var ogurls = (Array.isArray(result.ogImage)) ? result.ogImage : [result.ogImage];
                        
                        //Loop through each images and generates the array of the images
                        ogurls.forEach(element => {
                            if(element && element.url){
                                res.images.push(element.url)
                            }
                        });

                        //Sends the final response to the user
                        res = createResponse(res);
                        callback(null, res)
                    }else{
                        //Send the custom error to the user
                        res = {error: "Something went wrong!"};
                        res = createResponse(res);
                        callback(null, res)
                    }
                }
            })
        } catch (e) {
            //Send the given of custom error to the user
            let res = {error: (e.result && e.result.error) ? e.result.error : "Something went wrong"};
            res = createResponse(res);
            callback(null, res)
        }
    }
}

/**
* @param {string} HTML
* @param {object} ogTags
* @description Fills the empty blocks of the Open graph metadata
*/
const formatMetadata = async (HTML, ogTags) => {
    //Check the title
    if(!ogTags.ogTitle){
        //If not available parse the HTML of webpage to Cheerio and fetches the title
        var $ = cheerio.load(HTML.toString())
        ogTags.ogTitle = $("title").text()
    }

    //Check the description
    if(!ogTags.ogDescription){
        //If not available parse the HTML of webpage to Cheerio and fetches the description on the basis of heading tag
        var $ = cheerio.load(HTML.toString())

        /*
        - Gets the titles
        - Remove unwanted spaces
        - Remove line brakes
        - Safely inputs a space between 2 joint words
        */
        var titleDesc = $("h1, h2, h3, h4, h5, h6")
        .text()
        .trim()
        .replace(/\n/g, '')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        ogTags.ogDescription = titleDesc
    }

    //Check the image
    if(!ogTags.ogImage){
        var imgsTemp = []
        //If not available parse the HTML of webpage to Cheerio and fetches the images on the basis of img tag
        var $ = cheerio.load(HTML.toString())
        
        //loop through all img tags
        Object.keys($('img')).forEach( elem =>{

            //Check whether src attribute is present or not
            if($('img')[elem] && $('img')[elem].attribs && $('img')[elem].attribs.src){

                //Validates the src attribute has an valid url
                if(path.extname($('img')[elem].attribs.src)){
                    imgsTemp.push({url: $('img')[elem].attribs.src})
                }
            }
        })
        ogTags.ogImage = imgsTemp
    }
    return ogTags
}