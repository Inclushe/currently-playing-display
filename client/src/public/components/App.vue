<template lang="pug">
  .app
    .background(v-if="currentlyPlaying && backgroundType === 'cover-art'" :style="{'background-image': `url('${coverArtImage}')`}")
    .background.background--gradient(v-if="currentlyPlaying && backgroundType === 'gradient'" :style="{'background-image': `url('${gradientImage}')`}")
    .background(v-if="currentlyPlaying && backgroundType === 'both'" :style="{'background-image': `url('${coverArtImage}')`}")
    .background.background--gradient.background--opaque(v-if="currentlyPlaying && backgroundType === 'both'" :style="{'background-image': `url('${gradientImage}')`}")
    .display(v-if="currentlyPlaying")
      .display__album-cover(:style="{'background-image': `url('${coverArtImage}')`}" @click="toggleBackground")
      .display__info
        h1 {{ title }}
        h2 {{ album }}
        h3 {{ artists }}
    div(v-else)
      <a href="/authorize">Click here to authorize.</a>
</template>

<script>
import renderGradient from 'give-me-a-gradient'

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
      title: 'BREAK LAW',
      album: 'Turn Off The Lights',
      artists: 'Dog Blood, Skrillex, Boys Noize',
      coverArtImage: '',
      gradientImage: '',
      currentlyPlaying: false,
      settings: {
        backgroundTypeIndex: 0
      }
    }
  },
  methods: {
    /**
     * @param {object} tokens
     * @param {string} tokens.access_token
     * @param {string} tokens.refresh_token
     */
    getCurrentlyPlayingTrack (tokens) {
      if (this.mock === true) {
        this.title = 'Mock Title'
        this.spotify.current_track = {
          item: true
        }
        this.currentlyPlaying = true
      } else {
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.spotify.access_token}`
          }
        })
          .then(data => {
            // errors to check for
            // invalid token
            // no response
            const NOT_PLAYING = 204
            const ACCESS_TOKEN_EXPIRED = 401
            if (data.status === NOT_PLAYING || data.status === ACCESS_TOKEN_EXPIRED) {
              return { error: 'error' }
            } else {
              return data.json()
            }
          })
          .then(data => {
            if (!data.error && data.item !== null) {
              const trackChanged = (this.spotify.current_track.item === undefined || this.spotify.current_track.item.id !== data.item.id)
              // console.log(trackChanged)
              if (trackChanged) {
                this.spotify.current_track = data
                this.currentlyPlaying = true
                this.title = data.item.name
                this.album = data.item.album.name
                this.artists = data.item.artists.reduce((r, v) => { r.push(v.name); return r }, []).join(', ')
                this.coverArtImage = data.item.album.images[0].url
                this.setGradient()
              }
            }
            setTimeout(this.getCurrentlyPlayingTrack, 500)
          })
      }
    },
    setGradient () {
      renderGradient({
        imagePath: this.coverArtImage,
        height: 100,
        width: 100
      }).then(imageURI => {
        this.gradientImage = imageURI
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
    }
  },
  mounted () {
    const query = getQuery()
    this.spotify.access_token = query.access_token
    this.spotify.refresh_token = query.refresh_token
    this.getCurrentlyPlayingTrack()
  }
}

function getQuery () {
  return Array.from(window.location.search.split('&')).reduce((object, pair, index) => {
    if (index === 0) {
      pair = pair.slice(1, pair.length)
    }
    let key = pair.slice(0, pair.indexOf('='))
    let value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}
</script>

<style lang="stylus">
  .vue-test
    padding: 0
</style>
