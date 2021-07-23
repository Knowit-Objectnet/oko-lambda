const AWS = require("aws-sdk")
AWS.config.update({ region: "eu-central-1" })
const SNS = new AWS.SNS()
const Lambda = new AWS.Lambda()

exports.handler = async (event, context, callback) => {
    const success = data => response(200, data.MessageId, callback)
    const failure = error => response(500, error, callback)
    
    await validator(event)
    .then(data => {
        const parameters = formatter(data)
        return SNS.publish(parameters).promise()
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
        FunctionName: "sms-validator",
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
    Subject: data?.subject || "Verifiseringskode Ombruk",
    Message: data.message,
    PhoneNumber: data.number,
    MessageAttributes: {
        "AWS.SNS.SMS.SMSType" : {
            DataType : "String",
            StringValue: "Transactional"
        }
    }
})
