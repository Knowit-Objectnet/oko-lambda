exports.handler = async data => new Promise((resolve, reject) => {
    // Validate request data
    if (typeof data === "undefined" || data == null) {
        reject("Invalid request data")
    }
    
    // Validate json structure
    if (!data.hasOwnProperty("number") || !data.hasOwnProperty("message")) {
        reject("Missing parameters")
    }
    
    // Validate parameter types
    if (!(typeof data.number === "string") || !(typeof data.message === "string")) {
        reject("Invalid parameters")
    }
    
    // Validate values
    const numberRegEx = "^\\+47(4|9)\\d{7}$"
    if (data.number.length <= 0 || data.message.length <= 0 || data.number.length > 0 && !data.number.match(numberRegEx)) {
        reject("Invalid values")
    }
    
    // Validate message length
    
    resolve(data)
})
