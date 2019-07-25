const server = require('./src/server')
server.runOnPort(process.env.PORT || 8080)
