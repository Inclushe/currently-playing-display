/* eslint-disable no-undef */
const assert = require('assert')
const SpotifyProvider = require('../src/public/components/SpotifyProvider')

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

  it('returns track json with getCurrentTrack', () => {
    const provider = new SpotifyProvider({
      mock: true
    })
    return provider.getCurrentTrack()
      .then((json) => {
        assert(json.item !== undefined)
      })
  })
})
