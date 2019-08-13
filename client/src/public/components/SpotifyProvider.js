const mock = require('../../../tests/mocks')

module.exports = class SpotifyProvider {
  constructor (data = {}) {
    this.message = data.message || 'Hello world!'
    this.accessToken = data.accessToken || ''
    this.refreshToken = data.refreshToken || ''
    this.mock = data.mock || false
  }

  getCurrentTrack () {
    return new Promise((resolve, reject) => {
      if (this.mock) resolve(mock.exampleCurrentlyPlayingResponse)
    })
  }
}
