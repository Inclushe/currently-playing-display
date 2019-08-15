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

  // it
})
