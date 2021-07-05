var AWS = require("aws-sdk")
var SNS = new AWS.SNS()

function response(code, message, callback) {
    callback(null, {
        statusCode: code,
        message
    })
}

exports.handler = async (event, context, callback) => {
    const success = data => {
        console.log(data)
        response(200, data.MessageId, callback)
    }
    
    const failure = error => {
        console.error(error)
        response(500, error, callback)
    }
    
    await validator(event)
    .then(data => {
        const parameters = formatter(data)
        return SNS.publish(parameters).promise()
    })
    .then(success)
    .catch(failure)
}


const validator = data => new Promise((resolve, reject) => {
    // Validate request data
    if (typeof data === "undefined" || data == null) {
        reject("Invalid request data")
    }
    
    // Validate json structure
    if (!data.hasOwnProperty("number") || !data.hasOwnProperty("message")) {
        var code = 200
        reject({message: "Missing parameters", code})
    }
    
    // Validate parameter types
    if (!(typeof data.number === "string") || !(typeof data.message === "string")) {
        reject("Invalid parameters")
    }
    
    // Validate values
    const numberRegEx = "^\\+47(4|9)\\d{7}$"
    if (!data.number.length || !data.message.length && !data.message.match(numberRegEx)) {
        reject("Invalid values")
    }

    // Sanatize inputs
    
    resolve(data)
})

const formatter = data => ({
    Subject: "Test Notification",
    Message: data.message,
    PhoneNumber: data.number,
    MessageAttributes: {
        "AWS.SNS.SMS.SMSType" : {
            DataType : "String",
            StringValue: "Transactional"
        }
    }
})