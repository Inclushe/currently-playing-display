const mockedAPIRequest = require('../../../tests/mocks').exampleCurrentlyPlayingResponse
const Track = require('./Track')

module.exports = class SpotifyProvider {
  constructor (data = {}) {
    this.accessToken = data.accessToken
    this.refreshToken = data.refreshToken
    this.mock = data.mock
    this.track = new Track()
  }

  updateTrack () {
    return this._fetchCurrentlyPlayingTrackFromSpotifyAPI()
      .then(request => this._refreshAccessTokenIfNeeded(request))
      .then(request => this._handleRequestErrors(request))
      .then(data => data.json())
      .then(json => {
        if (json.error) throw new Error(json.error)
        this._setTrackUsingRequest(json)
      })
  }

  authenticate () {
    window.location = '/spotify/authorize'
  }

  refresh () {
    if (this.mock) {
      if (this.mock.refreshError === true) {
        throw new Error('mock_error')
      } else {
        return mockFetchReturningJSON(mockedAPIRequest, 200)
      }
    }
    return window.fetch(`/spotify/refresh?refresh_token=${this.refreshToken}`)
      .then(data => data.json())
      .then(json => {
        this.accessToken = json.access_token
        resolve(this._fetchCurrentlyPlayingTrackFromSpotifyAPI())
      })
      .catch(error => reject(error))
  }

  _fetchCurrentlyPlayingTrackFromSpotifyAPI (data) {
    if (this.mock) {
      return mockFetchReturningJSON(mockedAPIRequest, this.mock.status)
    }
    return window.fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`
      }
    })
  }

  _refreshAccessTokenIfNeeded (data) {
    const ACCESS_TOKEN_EXPIRED = 401
    if (data.status === ACCESS_TOKEN_EXPIRED) {
      return this.refresh()
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
      return mockFetchReturningJSON({ is_playing: false }, 200)
    } else {
      return data
    }
  }

  _setTrackUsingRequest (json) {
    this.track._json = json
    if (json.is_playing === false) return
    this.track.title = json.item.name
    this.track.album = json.item.album.name
    this.track.artists = getSpotifyArtistsString(json)
    const isLocalTrack = json.item.is_local
    if (isLocalTrack || this.mock.isLocalTrack) {
      this.track.id = generateLocalID()
    } else {
      this.track.id = json.item.id
    }
    if (isLocalTrack) {
      this.track.coverArtURI = null
    } else {
      this.coverArtImageURI = json.item.album.images[0].url
    }
  }
}

function mockFetchReturningJSON (object, status) {
  return new Promise((resolve, reject) => {
    resolve({
      status: status,
      json () {
        return object
      }
    })
  })
}

function getSpotifyArtistsString (json) {
  return json.item.artists.reduce((r, v) => {
    r.push(v.name)
    return r
  }, []).join(', ')
}

function generateLocalID () {
  const randomNumberString = Math.floor(Math.random() * 1000000000)
  return 'local-' + randomNumberString
}
