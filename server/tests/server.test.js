/* eslint-disable no-undef */
const assert = require('assert')
const queryValues = require('../helpers/queryValues')
const server = require('../src/server')
const supertest = require('supertest')

describe('server', () => {
  it('server exists', () => {
    assert(server !== null)
  })

  it('status route works', async () => {
    const response = await get('/status')
    assert(response.text === 'OK')
  })

  it('start page route works', async () => {
    const response = await get('/')
    assert(/Currently Playing Display/.test(response.text))
  })

  it('authorize route works', async () => {
    const response = await get('/spotify/authorize')
    assert(response.status === 302)
  })

  it('app route works', async () => {
    const response = await get('/app/')
    assert(/Currently Playing Display/.test(response.text))
  })

  it('app listen works', () => {
    const listener = server.runOnPort(9999, { silent: true })
    supertest('http://localhost:9999')
      .get('/status')
      .then((response) => {
        assert(response.text === 'OK')
        listener.close()
      })
  })
})

describe('callback route', () => {
  it('callback route returns error', async () => {
    const response = await get('/spotify/callback')
    const query = queryValues(response.headers.location)
    assert(query.error === 'code_not_found')
  })

  it('callback route valid mock gives an access token', async () => {
    const response = await get('/spotify/callback?code=mock_valid')
    const query = queryValues(response.headers.location)
    assert(query.access_token === 'mock_success')
  })

  it('callback route valid mock gives a refresh token', async () => {
    const response = await get('/spotify/callback?code=mock_valid')
    const query = queryValues(response.headers.location)
    assert(query.refresh_token === 'mock_reset')
  })

  it('callback route invalid mock gives an error', async () => {
    const response = await get('/spotify/callback?code=mock_invalid')
    const query = queryValues(response.headers.location)
    assert(query.error === 'mock_error')
  })
})

describe('refresh route', () => {
  it('refresh token path returns json error', async () => {
    const response = await get('/spotify/refresh')
    assert(JSON.parse(response.text).error === 'refresh_token_not_found')
  })

  it('refresh route valid mock gives an access token', async () => {
    const response = await get('/spotify/refresh?refresh_token=mock_valid')
    assert(JSON.parse(response.text).access_token === 'mock_success')
  })

  it('refresh route invalid mock gives an error', async () => {
    const response = await get('/spotify/refresh?refresh_token=mock_invalid')
    assert(JSON.parse(response.text).error === 'mock_error')
  })
})

function get (path) {
  return supertest(server).get(path)
}
