const mockedLastFMAPIRequest = require('../../../tests/mocks').lastFmExampleCurrentlyPlayingResponse
const mockedMusicbrainzAPIRequest = require('../../../tests/mocks').musicbrainzExampleAPIRequest
const mockFetchReturningJSON = require('./mockFetchReturningJSON')
const Track = require('./Track')

module.exports = class LastFMProvider {
  constructor (data = {}) {
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
      .then(_ => this._setTrackAlbumArtUsingMusicbrainzID())
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
      this.track.id = json.mbid // may return an empty string
    }
  }

  _setTrackAlbumArtUsingMusicbrainzID () {
    // The last.fm API gives two mbids, one for the track and one for the album.
    // The album is more likely to have album art
    return this._fetchAlbumArtFromMusicbrainzAPI()
      .then(data => data.json())
      .then(json => {
        this.track.coverArtURL = json.images[0].thumbnails.large
      })
  }

  _fetchAlbumArtFromMusicbrainzAPI () {
    if (this.mock) {
      return mockFetchReturningJSON(mockedMusicbrainzAPIRequest)
    }
    const mbid = this.track._json.album.mbid
    const mbidAlbumArtAPI = `https://coverartarchive.org/release/${mbid}`
    return window.fetch(mbidAlbumArtAPI)
  }
}
