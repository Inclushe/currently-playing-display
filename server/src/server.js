const express = require('express')
const fetch = require('node-fetch')
const bodyParser = require('body-parser')
const addresses = require('../helpers/addresses')
const spotifyMock = require('./mock/spotify')
const { URLSearchParams } = require('url')
require('dotenv').config()
const server = express()

server.use('/', express.static('client/dist', {
  maxAge: 1
}))

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

  This uses the Authorization Code flow described here:
  https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow

  Access tokens expire one hour after requested.
  Refresh tokens do not expire.
*/
server.get('/callback', (request, response, next) => {
  if (request.query.code === undefined) {
    return response.redirect(`/?error=code_not_found`)
  }
  postToSpotifyAPI('https://accounts.spotify.com/api/token', {
    grant_type: 'authorization_code',
    code: request.query.code
  })
    .then(data => data.json())
    .then((data) => {
      if (data.error !== undefined) {
        response.redirect(`/?error=${data.error}`)
      } else {
        response.redirect(`/?access_token=${data.access_token}&refresh_token=${data.refresh_token}`)
      }
    })
    .catch((e) => {
      console.error(e)
      next(e)
    })
})

// Refreshes the access token, given refresh_token as a query
server.get('/refresh', (request, response, next) => {
  if (request.query.refresh_token === undefined) {
    return response.json({
      error: 'refresh_token_not_found'
    })
  }
  postToSpotifyAPI('https://accounts.spotify.com/api/token', {
    grant_type: 'refresh_token',
    refresh_token: request.query.refresh_token
  })
    .then(data => data.json())
    .then((data) => {
      response.json(data)
    })
    .catch((e) => {
      console.error(e)
      next(e)
    })
})

/**
 * Sends a post request using URL parameters
 *
 * @param {string} url
 * @param {object} parameters
 * @returns promise
 */
function postToSpotifyAPI (url, parameters) {
  if (isMocked(parameters)) return handleMockedRequest(parameters)
  const params = new URLSearchParams()
  params.append('redirect_uri', process.env.redirect_uri)
  params.append('client_id', process.env.client_id)
  params.append('client_secret', process.env.client_secret)
  Object.keys(parameters).forEach((key) => {
    const value = parameters[key]
    params.append(key, value)
  })
  return fetch(url, {
    method: 'POST',
    body: params,
    headers: {
      'Context-Type': 'application/x-www-form-urlencoded'
    }
  })
}

function handleMockedRequest (parameters) {
  if (parameters.code === 'mock_valid') {
    return mockFetchReturningJSON(spotifyMock.callbackSuccess)
  } else if (parameters.code === 'mock_invalid') {
    return mockFetchReturningJSON(spotifyMock.callbackFailure)
  } else if (parameters.refresh_token === 'mock_valid') {
    return mockFetchReturningJSON(spotifyMock.refreshSuccess)
  } else if (parameters.refresh_token === 'mock_invalid') {
    return mockFetchReturningJSON(spotifyMock.refreshFailure)
  }
}

function isMocked (parameters) {
  return ((parameters.code === 'mock_valid' || parameters.code === 'mock_invalid' || parameters.refresh_token === 'mock_valid' || parameters.refresh_token === 'mock_invalid') && process.env.NODE_ENV !== 'production')
}

function mockFetchReturningJSON (object) {
  return new Promise((resolve, reject) => {
    resolve({
      json () {
        return object
      }
    })
  })
}

server.runOnPort = (portNumber, options) => {
  return server.listen(portNumber, () => {
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
