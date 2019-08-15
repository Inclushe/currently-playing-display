const mockedAPIRequest = require('../../../tests/mocks').exampleCurrentlyPlayingResponse
const Track = require('./Track')

module.exports = class LastFMProvider {
  constructor (data = {}) {
    this.APIKey = data.APIKey
    this.user = data.user
    this.mock = data.mock
    this.track = new Track()
  }

  // updateTrack ()
  // ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=rj&api_key=xxxx&limit=1&format=json
}