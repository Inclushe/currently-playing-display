const networkInterfaces = require('os').networkInterfaces()

function find (regex) {
  return Object.keys(networkInterfaces).find((value) => {
    return regex.test(value)
  })
}

let localNetworkObject = networkInterfaces[find(/^lo/)]
let remoteNetworkObject = networkInterfaces[find(/^eth/)] || networkInterfaces[find(/^wl/)] || [{ address: 'not-found' }]

exports.test = 'OK'
exports.local = localNetworkObject[0].address
exports.remote = remoteNetworkObject[0].address
