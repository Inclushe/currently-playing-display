/* eslint-disable no-undef */
require('jsdom-global')(``, { url: 'http://localhost/' })
window.fetch = require('node-fetch')
const assert = require('assert')
const LastFMProvider = require('../src/public/components/LastFMProvider')
require('dotenv').config()

describe('LastFMProvider', () => {
  it('should work', () => {
    const provider = new LastFMProvider()
    assert(provider.APIKey === undefined)
  })

  it('should get track info when updated', () => {
    const provider = new LastFMProvider({
      mock: true
    })
    return provider
      .updateTrack()
      .then(() => {
        assert(provider.track._json !== undefined)
      })
      .catch(console.error)
  })

  it('should do nothing when refresh is called', () => {
    const provider = new LastFMProvider()
    provider.refresh()
  })

  it('should fill all entries in Track', () => {
    const provider = new LastFMProvider({
      mock: true
    })
    return provider.updateTrack()
      .then(() => {
        let thereIsNoNullEntry = true

        for (entry in provider.track) {
          if (provider.track[entry] === null) {
            thereIsNoNullEntry = false
          }
        }
        assert(thereIsNoNullEntry)
      })
  })
})
