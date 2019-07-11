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

// Redirect user to log in with Spotify
server.get('/authorize', (request, response) => {
  response.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.client_id}&response_type=code&redirect_uri=${process.env.redirect_uri}&scope=user-read-currently-playing`)
})

/*
  Gives access and refresh tokens to the client.
  Access tokens expire one hour after requested.
  Refresh tokens do not expire.
*/
server.get('/callback', (request, response) => {
  if (request.query.code === undefined) {
    response.json({
      error: 'code_not_found'
    })
  } else if (isMocked(request)) {
    if (request.query.code === 'mock_valid') {
      response.json({
        'access_token': 'mock_success',
        'token_type': 'Bearer',
        'expires_in': 3600,
        'refresh_token': 'mock_reset',
        'scope': 'user-read-currently-playing'
      })
    } else if (request.query.code === 'mock_invalid') {
      response.json({
        'error': 'mock_error',
        'error_description': 'Mocking error'
      })
    }
  } else {
    postQuery('https://accounts.spotify.com/api/token', {
      'grant_type': 'authorization_code',
      'code': request.query.code,
      'redirect_uri': process.env.redirect_uri,
      'client_id': process.env.client_id,
      'client_secret': process.env.client_secret
    })
      .then(data => data.json())
      .then((data) => {
        // Error or not, we log it
        console.log(data)
        response.json(data)
      })
      .catch((e) => {
        console.error(e)
        response.json(e)
      })
  }
})

// Refreshes the access token, given refresh_token as a query
server.get('/refresh', (request, response) => {
  if (request.query.refresh_token === undefined) {
    response.json({
      error: 'token_not_found'
    })
  } else if (isMocked(request)) {
    if (request.query.refresh_token === 'mock_valid') {
      response.json({
        'access_token': 'mock_success',
        'token_type': 'Bearer',
        'expires_in': 3600,
        'scope': 'user-read-currently-playing'
      })
    } else if (request.query.refresh_token === 'mock_invalid') {
      response.json({
        'error': 'mock_error',
        'error_description': 'Mocking error'
      })
    }
  } else {
    postQuery('https://accounts.spotify.com/api/token', {
      'grant_type': 'refresh_token',
      'refresh_token': request.query.refresh_token,
      'client_id': process.env.client_id,
      'client_secret': process.env.client_secret
    })
      .then(data => data.json())
      .then((data) => {
        console.log(data)
        response.json(data)
      })
      .catch((e) => {
        console.error(e)
      })
  }
})

function isMocked (request) {
  return ((request.query.code === 'mock_valid' || request.query.code === 'mock_invalid' || request.query.refresh_token === 'mock_valid' || request.query.refresh_token === 'mock_invalid') && process.env.NODE_ENV !== 'production')
}

/**
 * Sends a post request using URL parameters
 *
 * @param {string} url
 * @param {object} parameters
 * @returns promise
 */
function postQuery (url, parameters) {
  const params = new URLSearchParams()
  Object.keys(parameters).forEach((key) => {
    let value = parameters[key]
    params.append(key, value)
  })
  console.log(postQuery)
  return fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Context-Type': 'application/x-www-form-urlencoded'
    }
  })
}

server.runOnPort = (portNumber) => {
  return server.listen(portNumber, () => {
    console.log(`Running in ${process.env.NODE_ENV}`)
    console.log(`Local Address: http://${addresses.local}:${portNumber}`)
    console.log(`Remote Address: http://${addresses.remote}:${portNumber}`)
    console.log(`Also, make sure '${process.env.redirect_uri}' is whitelisted as a redirect URI here: https://developer.spotify.com/dashboard/`)
  })
}

module.exports = server
