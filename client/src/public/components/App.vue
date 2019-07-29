<template lang="pug">
  .app
    .background(:style="{'background-image': `url('${coverArtImageURI}')`}")
    .background.background--gradient(:style="{'background-image': `url('${gradientImageURI}')`, 'opacity': gradientOpacity}")
    .display(v-if="currentlyPlaying")
      .display__album-cover(:style="{'background-image': `url('${coverArtImageURI}')`}" @click="toggleBackground")
      .display__info
        h1 {{ title }}
        h2 {{ album }}
        h3 {{ artists }}
    .status-view(v-else-if="notPlaying")
      h1 Nothing Playing
      p.
        Play a song on Spotify and it will show up here.
      p.
        Make sure your device is online with Private Listening turned off.
    .status-view(v-else-if="error")
      h1 Error
      p This can usually be resolved by re-authenticating.
      p <a href="/spotify/authorize">Click here to re-authenticate.</a>
      pre {{ JSON.stringify(errorMessage, null, 2) }}
    .status-view(v-else)
      h1 Loading
</template>

<script>
import renderGradient from 'give-me-a-gradient'

// @TODO: make state in data
export default {
  props: ['mock'],
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
      currentlyPlaying: false,
      notPlaying: false,
      error: false,
      errorMessage: null,
      settings: {
        backgroundTypeIndex: 0
      },
      getCurrentlyPlayingTrackInterval: null
    }
  },
  mounted () {
    const query = getQueriesFromURL()
    if (query.auth_provider === 'spotify') {
      this.spotify.access_token = query.access_token
      this.spotify.refresh_token = query.refresh_token
    }
    this.getCurrentlyPlayingTrackInterval = setInterval(this.getCurrentlyPlayingTrack, 1000)
    this.getCurrentlyPlayingTrack()
  },
  methods: {
    getCurrentlyPlayingTrack () {
      if (this.mock === true) return this.handleGetCurrentlyPlayingTrackMock()

      fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.spotify.access_token}`
        }
      })
        .then(this.handleRequestErrors)
        .then(data => data.json())
        .then(json => {
          if (this.thereWereNoErrorsAndTrackChanged(json)) {
            this.populateDataWithTrackInfo(json)
          } else if (json.error) {
            this.errorMessage = json
            this.currentlyPlaying = false
            this.notPlaying = false
            this.error = true
          } else if (json.now_playing === false) {
            this.currentlyPlaying = false
            this.notPlaying = true
          }
        })
        .catch(console.error)
    },

    handleGetCurrentlyPlayingTrackMock () {
      this.title = 'Mock Title'
      this.currentlyPlaying = true
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
      const trackChanged = ((data.now_playing === undefined) && (this.spotify.current_track.item === undefined || (data.item !== null && this.spotify.current_track.item.id !== data.item.id)))

      return (thereWereNoErrors && trackChanged)
    },

    populateDataWithTrackInfo (data) {
      const isLocal = data.item.is_local || false
      this.spotify.current_track = data
      this.currentlyPlaying = true
      this.notPlaying = false
      this.error = false
      this.title = data.item.name
      this.album = data.item.album.name
      this.artists = data.item.artists.reduce((r, v) => { r.push(v.name); return r }, []).join(', ')
      if (!isLocal) {
        this.coverArtImageURI = data.item.album.images[0].url
      }
      this.setGradient()
    },

    setGradient () {
      renderGradient({
        imagePath: this.coverArtImageURI,
        height: 100,
        width: 100
      }).then(imageURI => {
        this.gradientImageURI = imageURI
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

function mockFetchReturningJSON (object) {
  return new Promise((resolve, reject) => {
    resolve({
      json () {
        return object
      }
    })
  })
}
</script>
