var AWS = require("aws-sdk")
var SES = new AWS.SES()

function response(code, message, callback) {
    console.log(code, message)
    callback(null, {
        statusCode: code,
        body: JSON.stringify(message)
    })
}

exports.handler = async (event, context, callback) => {
    const success = messageId => {
        response(200, messageId, callback)
    }
    
    const failure = (error, code) => {
        response(code || 500, error, callback)
    }
    
    await validator(event)
    .then(data => {
        const parameters = formatter(data)
        return SES.sendEmail(parameters).promise()
    })
    .then(notification => success(notification.MessageId))
    .catch(failure)
}


const validator = data => new Promise((resolve, reject) => {
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
    if (!data.addresses.length || !data.message.length) {
        reject("Invalid values")
    }

    // Sanatize inputs
    
    resolve(data)
})

const formatter = data => ({
    Destination: {
        /*CcAddresses: [],*/
        ToAddresses: data.addresses
    },
    Message: {
        Body: {
            /*Html: {
                Charset: "UTF-8",
                Data: "HTML_FORMAT_BODY"
            },*/
            Text: {
                Charset: "UTF-8",
                Data: data.message
            }
        },
        Subject: {
            Charset: 'UTF-8',
            Data: 'Test Notification'
        }
    },
    Source: 'donotreply@knowit.no',
        ReplyToAddresses: [
            'donotreply@knowit.no'
        ]
})