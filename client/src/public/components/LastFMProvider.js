const mockedLastFMAPIRequest = require('../../../tests/mocks').lastFmExampleCurrentlyPlayingResponse
const mockFetchReturningJSON = require('./mockFetchReturningJSON')
const Track = require('./Track')

module.exports = class LastFMProvider {
  constructor (data = {}) {
    this.type = 'lastfm'
    this.APIKey = data.APIKey
    this.user = data.user
    this.mock = data.mock
    this.track = new Track()
  }

  updateTrack () {
    return this._fetchCurrentlyPlayingSongFromLastFMAPI()
      .then(data => data.json())
      .then(json => {
        if (json.error) throw new Error(json.message)
        this._setTrackUsingRequest(json)
      })
  }

  authenticate () {
    window.location = '/?auth=lastfm'
  }

  refresh () {
    // API keys don't need to be refreshed
  }

  _fetchCurrentlyPlayingSongFromLastFMAPI () {
    if (this.mock) {
      return mockFetchReturningJSON(mockedLastFMAPIRequest)
    }
    return window.fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this.user}&api_key=${this.APIKey}&limit=1&format=json`)
  }

  _setTrackUsingRequest (json) {
    json = json.recenttracks.track[0]
    this.track._json = json
    if (json['@attr'] && json['@attr']['nowplaying'] === 'true') {
      this.track.title = json.name
      this.track.album = json.album['#text']
      this.track.artists = json.artist['#text'] // Only gets the first artist
      this.track.id = json.url // url is more reliable than mbid
      this.track.coverArtURL = json.image[json.image.length - 1]['#text']
      this.track.isLocal = false
      this.track.isCurrentlyPlaying = true
    } else {
      this.track.isCurrentlyPlaying = false
    }
  }
}
