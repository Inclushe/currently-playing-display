/* eslint-disable no-undef */
require('jsdom-global')(``, { url: 'http://localhost/' })
window.fetch = require('node-fetch')
const assert = require('assert')
const SpotifyProvider = require('../src/public/components/SpotifyProvider')

describe('SpotifyProvider', function () {
  it('should return track json mock with updateTrack', () => {
    const provider = new SpotifyProvider({
      mock: {
        use: true
      }
    })
    return provider.updateTrack()
      .then(() => {
        assert(provider.track._json.item !== undefined)
      })
  })

  it('should return {is_playing: false} on 204 ', () => {
    const provider = new SpotifyProvider({
      mock: {
        status: 204
      }
    })
    return provider.updateTrack()
      .then(() => {
        assert(provider.track._json.is_playing === false)
      })
  })
  
  it('should generate new token when expired (401)', () => {
    const provider = new SpotifyProvider({
      mock: {
        status: 401
      }
    })
    return provider.updateTrack()
      .then(() => {
        assert(provider.track._json.item !== undefined)
      })
  })

  it('should throw an error if refreshing failed', () => {
    const provider = new SpotifyProvider({
      mock: {
        status: 401,
        refreshError: true
      }
    })
    return provider.updateTrack()
      .then(() => {
        // The test still passes if no assert is sent.
        // If it gets here, fail the test.
        assert(false)
      })
      .catch((error) => {
        assert(error.message === 'mock_error')
      })
  })

  it('should get the current track ID', () => {
    const mockTrackID = '2eQog4rHlk8OVhJj2uiEHx'
    const provider = new SpotifyProvider({
      mock: true
    })
    return provider.updateTrack()
      .then(() => {
        assert(provider.track.id === mockTrackID)
      })
  })

  it('should return ID of null after initialized', () => {
    const provider = new SpotifyProvider({
      mock: true
    })
    assert(provider.track.id === null)
  })

  it('should return ID that starts with "local" after getting local track', () => {
    const provider = new SpotifyProvider({
      mock: {
        isLocalTrack: true
      }
    })
    return provider.updateTrack()
      .then(() => {
        assert(/^local/.test(provider.track.id))
      })
  })

  it('should fill all entries in Track', () => {
    const provider = new SpotifyProvider({
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
