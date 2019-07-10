const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const addresses = require('../helpers/addresses')
const { URLSearchParams, url } = require('url')
require('dotenv').config()
const server = express()

server.use('/', express.static('client'))
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())

server.get('/status', (request, response) => {
  response.send('OK')
})

server.get('/callback', (request, response) => {
  let code = request.query.code
  // request.send(request.query.code)
  // console.log(request.query.code === undefined)
  if (request.query.code === undefined) {
    response.json({
      error: 'Code not found'
    })
  } else {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('code', request.query.code)
    params.append('redirect_uri', 'http://127.0.0.1:9999/callback')
    params.append('client_id', process.env.client_id)
    params.append('client_secret', process.env.client_secret)
    console.log(params)
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      body: params,
      headers: {
        'Context-Type': 'application/x-www-form-urlencoded'
      }
    })
      .then(data => data.json())
      .then((data) => {
        console.log(data)
        response.json(response.query)
      })
      .catch((e) => {
        response.json(e)
      })

    // response.json({
    //   status: 'OK'
    // })
  }
})

server.runOnPort = (portNumber) => {
  return server.listen(portNumber, () => {
    console.log(`Running in ${process.env.NODE_ENV}`)
    console.log(`Local Address: http://${addresses.local}:${portNumber}`)
    console.log(`Remote Address: http://${addresses.remote}:${portNumber}`)
  })
}

module.exports = server
