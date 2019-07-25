const { URLSearchParams } = require('url')
const fetch = require('node-fetch')
const spotifyMock = require('../mock/spotify')

/**
 * Sends a post request using URL parameters
 *
 * @param {string} url
 * @param {object} parameters
 * @returns promise
 */
module.exports = function (url, parameters) {
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
