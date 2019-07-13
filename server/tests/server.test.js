/* eslint-disable no-undef */
const assert = require('assert')
const server = require('../src/server')
const supertest = require('supertest')

describe('server', () => {
  it('server exists', () => {
    assert.notStrictEqual(server, null)
  })

  it('status route works', () => {
    return supertest(server)
      .get('/status')
      .then((response) => {
        assert.strictEqual(response.text, 'OK')
      })
  })

  it('authorize route works', () => {
    return supertest(server)
      .get('/authorize')
      .then((response) => {
        assert.strictEqual(response.status, 302)
      })
  })

  it('callback route returns error', () => {
    return supertest(server)
      .get('/callback')
      .then((response) => {
        const query = queryValues(response.headers.location)
        assert.strictEqual(query.error, 'code_not_found')
      })
  })

  it('callback route valid mock gives an access token and refresh token', () => {
    return supertest(server)
      .get('/callback?code=mock_valid')
      .then((response) => {
        const query = queryValues(response.headers.location)
        assert.strictEqual(query.access_token, 'mock_success')
        assert.strictEqual(query.refresh_token, 'mock_reset')
      })
  })

  it('callback route invalid mock gives an error', () => {
    return supertest(server)
      .get('/callback?code=mock_invalid')
      .then((response) => {
        const query = queryValues(response.headers.location)
        assert.strictEqual(query.error, 'mock_error')
      })
  })

  it('refresh token path returns json error', () => {
    return supertest(server)
      .get('/refresh')
      .then((response) => {
        assert.strictEqual(JSON.parse(response.text).error, 'refresh_token_not_found')
      })
  })

  it('refresh route valid mock gives an access token', () => {
    return supertest(server)
      .get('/refresh?refresh_token=mock_valid')
      .then((response) => {
        assert.strictEqual(JSON.parse(response.text).access_token, 'mock_success')
      })
  })

  it('refresh route invalid mock gives an error', () => {
    return supertest(server)
      .get('/refresh?refresh_token=mock_invalid')
      .then((response) => {
        assert.strictEqual(JSON.parse(response.text).error, 'mock_error')
      })
  })

  it('static route works for now', () => {
    return supertest(server)
      .get('/')
      .then((response) => {
        assert(/Currently Playing Display/.test(response.text))
      })
  })

  it('app listen works', () => {
    const listener = server.runOnPort(9999, {
      silent: true
    })
    return supertest('http://localhost:9999')
      .get('/status')
      .then((response) => {
        assert.strictEqual(response.text, 'OK')
        listener.close()
      })
  })
})

function queryValues (url) {
  return Array.from(url.slice(url.indexOf('?') + 1).split('&')).reduce((object, pair, index) => {
    const key = pair.slice(0, pair.indexOf('='))
    const value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}
