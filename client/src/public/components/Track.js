module.exports = class CurrentTrack {
  constructor (data = {}) {
    this.title = null
    this.album = null
    this.artists = null
    this.id = null
    this.coverArtURL = null
    this._json = null
  }
}
