exports.handler = async data => new Promise((resolve, reject) => {
    // Validate request data
    if (typeof data === "undefined" || data == null) {
        reject("Invalid request data")
    }
    
    // Validate json structure
    if (!data.hasOwnProperty("addresses") || !data.hasOwnProperty("message")) {
        reject("Missing parameters")
    }
    
    // Validate parameter types
    if (!(data.addresses instanceof Array) || !(typeof data.message === "string")) {
        reject("Invalid parameters")
    }
    
    // Validate values
    if (data.addresses.length <= 0 || data.message.length <= 0) {
        reject("Invalid values")
    }

    // Sanatize inputs
    
    resolve(data)
})
