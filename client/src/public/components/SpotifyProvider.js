const mockedAPIRequest = require('../../../tests/mocks').exampleCurrentlyPlayingResponse

module.exports = class SpotifyProvider {
  constructor (data = {}) {
    this.message = data.message || 'Hello world!'
    this.accessToken = data.accessToken || ''
    this.refreshToken = data.refreshToken || ''
    this.mock = data.mock || false
    this.trackID = ''
  }

  getCurrentTrack () {
    return this._fetchCurrentlyPlayingTrackFromSpotifyAPI()
      .then(request => this._refreshAccessTokenIfNeeded(request))
      .then(request => this._handleRequestErrors(request))
      .then(data => data.json())
      .then(json => {
        // extract track info or return object with info
        return json
      })
  }

  refresh () {
    return new Promise((resolve, reject) => {
      window.fetch(`/spotify/refresh?refresh_token=${self.refreshToken}`)
        .then(data => data.json())
        .then(json => {
          this.accessToken = json.access_token
          resolve(this._fetchCurrentlyPlayingTrackFromSpotifyAPI())
        })
        .catch(error => reject(error))
    })
  }

  _fetchCurrentlyPlayingTrackFromSpotifyAPI (data) {
    if (this.mock) return mockFetchReturningJSON(mockedAPIRequest)
    return window.fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  _refreshAccessTokenIfNeeded (data) {
    console.log(this)
    console.log(data)
    const ACCESS_TOKEN_EXPIRED = 401
    if (data.status === ACCESS_TOKEN_EXPIRED) {
      this.refresh()
    } else {
      return data
    }
  }

  _handleRequestErrors (data) {
    const NOT_PLAYING = 204
    const ACCESS_TOKEN_EXPIRED = 401
    if (data.status === ACCESS_TOKEN_EXPIRED) {
      return data
    } else if (data.status === NOT_PLAYING) {
      return mockFetchReturningJSON({ now_playing: false })
    } else {
      return data
    }
  }
}

function mockFetchReturningJSON (object) {
  return new Promise((resolve, reject) => {
    resolve({
      status: 200,
      json () {
        return object
      }
    })
  })
}
