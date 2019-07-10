const networkInterfaces = require('os').networkInterfaces()

// Object.keys(networkInterfaces)
function find (regex) {
  return Object.keys(networkInterfaces).find((value) => {
    return regex.test(value)
  })
}

exports.test = 'OK'
exports.local = networkInterfaces[find(/^lo/)][0].address
exports.remote = networkInterfaces[find(/^eth/)][0].address
