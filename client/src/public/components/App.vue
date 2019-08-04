<script>
import appPug from './App.vue.pug'
import renderGradient from 'give-me-a-gradient'

export default {
  props: ['mock'],
  template: appPug,
  data () {
    return {
      message: 'Hello world from Vue!',
      spotify: {
        access_token: '',
        refresh_token: '',
        current_track: {}
      },
      title: 'Sample Song Title',
      album: 'Sample Album Title',
      artists: 'Sample Artist 1, Sample Artist 2',
      coverArtImageURI: '',
      gradientImageURI: '',
      state: 'loading',
      error: false,
      errorMessage: null,
      settings: {
        backgroundTypeIndex: 0
      },
      getCurrentlyPlayingTrackInterval: null
    }
  },
  mounted () {
    const queries = getQueriesFromURL()
    saveCredentialsToLocalStorage(queries)
    const credentials = getCredentialsFromLocalStorage([
      'access_token',
      'refresh_token',
      'auth_provider'
    ])
    removeQueriesFromURL()
    if (credentials.auth_provider === 'spotify') {
      this.spotify.access_token = credentials.access_token
      this.spotify.refresh_token = credentials.refresh_token
    }
    this.getCurrentlyPlayingTrackInterval = setInterval(this.getCurrentlyPlayingTrack, 1000)
    this.getCurrentlyPlayingTrack()
  },
  methods: {
    getCurrentlyPlayingTrack () {
      const app = this
      if (app.mock === true) return this.handleGetCurrentlyPlayingTrackMock()

      app.fetchCurrentlyPlayingTrack()
        .then(app.refreshAccessTokenIfNeeded)
        .then(app.handleRequestErrors)
        .then(data => data.json())
        .then(json => {
          if (app.thereWereNoErrorsAndTrackChanged(json)) {
            preloadAlbumArt(json)
              .then(app.populateDataWithTrackInfo(json))
          } else if (json.error) {
            app.errorMessage = json
            app.state = 'error'
          } else if (json.now_playing === false) {
            app.state = 'waiting'
          }
        })
        .catch(console.error)
    },

    handleGetCurrentlyPlayingTrackMock () {
      this.title = 'Mock Title'
      this.state = 'playing'
    },

    fetchCurrentlyPlayingTrack (data) {
      return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.spotify.access_token}`
        }
      })
    },

    refreshAccessTokenIfNeeded (data) {
      const app = this
      const ACCESS_TOKEN_EXPIRED = 401
      if (data.status === ACCESS_TOKEN_EXPIRED) {
        return new Promise((resolve, reject) => {
          fetch(`/spotify/refresh?refresh_token=${this.spotify.refresh_token}`)
            .then(data => data.json())
            .then(json => {
              app.spotify.access_token = json.access_token
              resolve(app.fetchCurrentlyPlayingTrack())
            })
            .catch(reject)
        })
      } else {
        return data
      }
    },

    handleRequestErrors (data) {
      // errors to check for
      // invalid token
      // no response
      const NOT_PLAYING = 204
      const ACCESS_TOKEN_EXPIRED = 401
      if (data.status === ACCESS_TOKEN_EXPIRED) {
        return data
      } else if (data.status === NOT_PLAYING) {
        return mockFetchReturningJSON({ now_playing: false })
      } else {
        return data
      }
    },

    thereWereNoErrorsAndTrackChanged (data) {
      const thereWereNoErrors = (!data.error && data.now_playing === undefined && data.item !== null)
      const trackChanged = data.item !== null && data.item !== undefined && ((data.now_playing === undefined) && (this.spotify.current_track.item === undefined || (data.item !== null && this.spotify.current_track.item.id !== data.item.id)))
      const stateIsNotPlaying = this.state !== 'playing'

      return (thereWereNoErrors && (trackChanged || stateIsNotPlaying))
    },

    populateDataWithTrackInfo (data) {
      const isLocal = data.item.is_local || false
      if (!isLocal) {
        this.coverArtImageURI = data.item.album.images[0].url
      }
      this.spotify.current_track = data
      this.state = 'playing'
      this.title = data.item.name
      this.album = data.item.album.name
      this.artists = data.item.artists.reduce((r, v) => { r.push(v.name); return r }, []).join(', ')
      if (!isLocal) {
        this.coverArtImageURI = data.item.album.images[0].url
      }
      // this.setGradient()
    },

    setGradient (url) {
      return renderGradient({
        imagePath: url,
        height: 100,
        width: 100
      }).then(imageURI => {
        this.gradientImageURI = imageURI
        return true
      })
    },

    toggleBackground () {
      this.settings.backgroundTypeIndex = (this.settings.backgroundTypeIndex + 1) % 3
    }
  },
  computed: {
    backgroundType () {
      let type
      switch (this.settings.backgroundTypeIndex) {
        case 0:
          type = 'cover-art'
          break
        case 1:
          type = 'gradient'
          break
        case 2:
          type = 'both'
          break
      }
      return type
    },
    gradientOpacity () {
      let value
      switch (this.settings.backgroundTypeIndex) {
        case 0:
          value = 0
          break
        case 1:
          value = 1
          break
        case 2:
          value = 0.5
          break
      }
      return value
    }
  }
}

function getQueriesFromURL () {
  return Array.from(window.location.search.split('&')).reduce((object, pair, index) => {
    if (index === 0) {
      pair = pair.slice(1, pair.length)
    }
    const key = pair.slice(0, pair.indexOf('='))
    const value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}

function saveCredentialsToLocalStorage (queries) {
  const keys = Object.keys(queries)
  keys.forEach(key => localStorage.setItem(key, queries[key]))
}

function getCredentialsFromLocalStorage (array) {
  const credentials = {}
  array.forEach(credential => {
    credentials[credential] = localStorage.getItem(credential)
  })
  return credentials
}

function removeQueriesFromURL () {
  window.history.replaceState({}, '', '/app/')
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

function preloadAlbumArt (json) {
  return new Promise((resolve, reject) => {
    if (isLocalTrack(json)) { resolve() }
    const image = new Image()
    image.src = json.item.album.images[0].url
    image.onload = resolve
    image.onerror = reject
  })
}

function isLocalTrack (json) {
  return json.item.is_local || false
}
</script>
