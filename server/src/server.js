const express = require('express')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const addresses = require('../helpers/addresses')
const mainRoute = require('../routes/main')
const path = require('path')
const server = express()

require('dotenv').config()

server.use(favicon(path.join(__dirname, '../../client/src/public/images/favicon.ico')))

server.use('/', express.static('client/dist', {
  maxAge: 1
}))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.use('/', mainRoute)

server.runOnPort = (portNumber, options) => {
  return server.listen(portNumber, '0.0.0.0', () => {
    const notSilenced = (options === undefined || options.silent !== true)
    if (notSilenced) {
      console.log(`Running in ${process.env.NODE_ENV}`)
      console.log(`Local Address: http://${addresses.local}:${portNumber}`)
      console.log(`Remote Address: http://${addresses.remote}:${portNumber}`)
      console.log(`Also, make sure '${process.env.redirect_uri}' is whitelisted as a redirect URI here: https://developer.spotify.com/dashboard/`)
    }
  })
}

module.exports = server
