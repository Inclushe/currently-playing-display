/* eslint-disable no-undef */
import Vue from 'vue'
import App from '../src/public/components/App.vue'
const assert = require('assert')
// const postToSpotifyAPI = require('../../server/helpers/postToSpotifyAPI')
let accessToken
const refreshToken = process.env.refresh_token

before(() => {
  // @TODO: Generate access token from refresh token
  // console.log('good here')
  // return postToSpotifyAPI('https://accounts.spotify.com/api/token', {
  //   grant_type: 'refresh_token',
  //   refresh_token: refreshToken
  // })
  //   .then(data => data.json())
  //   .then((data) => {
  //     accessToken = data.access_token
  //   })
  //   .catch((e) => {
  //     console.error(e)
  //   })
})

describe('tokens', function () {
  // it('has access token', () => {
  //   assert(typeof access_token === 'string')
  // })
  // it('has refresh token', () => {
  //   assert(typeof refresh_token === 'string')
  // })
})

describe('App', function () {
  it('has message "Hello world from Vue!"', () => {
    assert.strictEqual(App.data().message, 'Hello world from Vue!')
  })

  it('has spotify object', () => {
    assert(typeof App.data().spotify === 'object')
  })

  it('has getCurrentlyPlayingTrack', () => {
    assert(typeof App.methods.getCurrentlyPlayingTrack === 'function')
  })
})
