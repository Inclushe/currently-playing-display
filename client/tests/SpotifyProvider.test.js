/* eslint-disable no-undef */
require('jsdom-global')(``, { url: 'http://localhost/' })
window.fetch = require('node-fetch')
const assert = require('assert')
const SpotifyProvider = require('../src/public/components/SpotifyProvider')
require('dotenv').config()

describe('SpotifyProvider', function () {
  it('works', () => {
    const provider = new SpotifyProvider()
    assert(provider.message === 'Hello world!')
  })

  it('takes message', () => {
    const provider = new SpotifyProvider({
      message: 'Yo world!'
    })
    assert(provider.message === 'Yo world!')
  })

  it('returns track json mock with getCurrentTrack', () => {
    const provider = new SpotifyProvider({
      mock: true
    })
    return provider.getCurrentTrack()
      .then((json) => {
        assert(json.item !== undefined)
      })
  })
  
  // it('returns track json mock with getCurrentTrack online', () => {
  //   const provider = new SpotifyProvider({
  //     accessToken: process.env.testing_spotify_access_token,
  //     refreshToken: process.env.testing_spotify_refresh_token
  //   })
  //   return provider.getCurrentTrack()
  //     .then((json) => {
  //       assert(json.item !== undefined)
  //     })
  // })
})
