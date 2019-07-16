<template lang="pug">
  .app
    .background(v-if="spotify.current_track.item" :style="{'background-image': `url('${spotify.current_track.item.album.images[0].url}')`}")
    .display(v-if="spotify.current_track.item")
      .display__album-cover(:style="{'background-image': `url('${spotify.current_track.item.album.images[0].url}')`}")
      .display__info
        h1 {{ spotify.current_track.item.name }}
        h2 {{ spotify.current_track.item.album.name }}
        h3 {{ spotify.current_track.item.artists.reduce((r, v) => {r.push(v.name); return r}, []).join(', ') }}
    div(v-else)
      <a href="/authorize">Click here to authorize.</a>
</template>

<script>
export default {
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
      artists: 'Dog Blood, Skrillex, Boys Noize'
    }
  },
  mounted () {
    const query = getQuery()
    console.log(query)
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${query.access_token}`
      }
    })
      .then(data => {
        // errors to check for
        // invalid token
        // no response
        if (data.status === 204) {
          return {}
        } else {
          return data.json()
        }
      })
      .then(data => {
        this.spotify.current_track = data
        console.log(data)
      })
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
