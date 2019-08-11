const postToSpotifyAPI = require('../helpers/postToSpotifyAPI')

require('dotenv').config()

// Redirect user to log in with Spotify
exports.authorize = (request, response) => {
  response.redirect(`https://accounts.spotify.com/authorize?client_id=${process.env.client_id}&response_type=code&redirect_uri=${process.env.redirect_uri}&scope=user-read-currently-playing`)
}

/*
  Gives access and refresh tokens to the client.

  This uses the Authorization Code flow described here:
  https://developer.spotify.com/documentation/general/guides/authorization-guide/#authorization-code-flow

  Access tokens expire one hour after requested.
  Refresh tokens do not expire.
*/
exports.callback = (request, response, next) => {
  postToSpotifyAPI('https://accounts.spotify.com/api/token', {
    grant_type: 'authorization_code',
    code: request.query.code
  })
    .then(data => data.json())
    .then(data => {
      if (data.error !== undefined) {
        response.redirect(`/app/?error=${data.error}`)
      } else {
        response.redirect(`/app/?access_token=${data.access_token}&refresh_token=${data.refresh_token}&auth_provider=spotify`)
      }
    })
    .catch(next)
}

// Refreshes the access token, given refresh_token as a query
exports.refresh = (request, response, next) => {
  postToSpotifyAPI('https://accounts.spotify.com/api/token', {
    grant_type: 'refresh_token',
    refresh_token: request.query.refresh_token
  })
    .then(data => data.json())
    .then(data => {
      response.json(data)
    })
    .catch(next)
}

exports.checkForCode = (request, response, next) => {
  if (request.query.code === undefined) {
    return response.redirect(`/?error=code_not_found`)
  } else {
    next()
  }
}

exports.checkForRefreshToken = (request, response, next) => {
  if (request.query.refresh_token === undefined) {
    return response.json({
      error: 'refresh_token_not_found'
    })
  } else {
    next()
  }
}
