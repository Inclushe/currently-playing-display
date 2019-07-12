<template lang="pug">
  .vue-test
    h1 {{ message }}
    pre {{ JSON.stringify(spotify.current_track, null, 2) }}
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
      }
    }
  },
  mounted () {
    const query = getQuery()
    console.log(query)
    console.log('why')
    fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${query.access_token}`
      }
    })
      .then(data => data.json())
      .then(data => {
        this.spotify.current_track = data
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
