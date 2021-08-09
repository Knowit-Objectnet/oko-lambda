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
    if (Buffer.from(data.message).length > 140) {
        reject("Message length exceeded")
    }
    
    // Validate subject
    if (typeof data.subject === "string") {
        if (data.subject.length <= 0 || data.subject.length >= 999) {
            reject("Invalid values")
        }
    }
    
    // Sanatize output
    const output = {
        number: data.number,
        message: data.message,
        subject: data.subject
    }
    
    resolve(output)
})
