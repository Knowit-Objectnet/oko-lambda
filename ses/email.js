const AWS = require("aws-sdk")
AWS.config.update({ region: "eu-central-1" })
const SES = new AWS.SES()
const Lambda = new AWS.Lambda()

exports.handler = async (event, context, callback) => {
    const success = data => response(200, data.MessageId, callback)
    const failure = error => response(500, error, callback)

    await validator(event)
    .then(data => {
        const parameters = formatter(data)
        return SES.sendEmail(parameters).promise()
    })
    .then(success)
    .catch(failure)
}

function response(code, message, callback) {
    callback(null, {
        statusCode: code,
        message
    })
}

const validator = data => new Promise((resolve, reject) => {
    Lambda.invoke({
        FunctionName: "email-validator",
        LogType: "Tail",
        Payload: JSON.stringify(data)
    })
    .promise()
    .then(response => {
        const payload = JSON.parse(response.Payload)

        if (!payload) {
            reject("Invalid response from invoke")
        } else if (response.FunctionError) {
            reject(payload.errorMessage || "Invoke error")
        }
        
        resolve(payload)
    }).catch(reject)
    
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
            Data: data?.subject
        }
    },
    Source: 'ikkesvar@knowit.no',
        ReplyToAddresses: [
            'ikkesvar@knowit.no'
        ]
})