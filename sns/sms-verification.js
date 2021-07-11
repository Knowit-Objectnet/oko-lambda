const AWS = require("aws-sdk")
AWS.config.update({ region: "eu-central-1" })
const Lambda = new AWS.Lambda()

exports.handler = async (event, context, callback) => {
    const success = data => response(200, data, callback)
    const failure = error => response(500, error, callback)
    
    await sms(event)
    .then(success)
    .catch(failure)
}

function response(code, message, callback) {
    callback(null, {
        statusCode: code,
        message
    })
}

const sms = data => new Promise((resolve, reject) => {
    const code = verificationCode()

    Lambda.invoke({
        FunctionName: "sms",
        LogType: "Tail",
        Payload: JSON.stringify({
          number: data.number,
          message: "Bekreftelseskoden din er: " + code
        })
    })
    .promise()
    .then(response => {
        const payload = JSON.parse(response.Payload)
        
        if (!payload) {
            reject("Invalid response from invoke")
        } else if (response.FunctionError) {
            reject(payload.errorMessage || "Invoke error")
        } else if (payload.statusCode != 200) {
            reject(payload.message || "Invalid response")
        }
        
        resolve(code)
    }).catch(reject)
})

function verificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}