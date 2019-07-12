/* eslint-disable no-undef */
const server = require('../src/server')
const supertest = require('supertest')

test('server exists', () => {
  expect(server).not.toBeNull()
})

test('status route works', () => {
  return supertest(server)
    .get('/status')
    .then((response) => {
      expect(response.text).toBe('OK')
    })
})

test('authorize route works', () => {
  return supertest(server)
    .get('/authorize')
    .then((response) => {
      expect(response.status).toBe(302)
    })
})

test('callback route returns error', () => {
  return supertest(server)
    .get('/callback')
    .then((response) => {
      let query = queryValues(response.headers.location)
      expect(query.error).toBe('code_not_found')
    })
})

test('callback route valid mock gives an access token and refresh token', () => {
  return supertest(server)
    .get('/callback?code=mock_valid')
    .then((response) => {
      let query = queryValues(response.headers.location)
      expect(query.access_token).toBe('mock_success')
      expect(query.refresh_token).toBe('mock_reset')
    })
})

test('callback route invalid mock gives an error', () => {
  return supertest(server)
    .get('/callback?code=mock_invalid')
    .then((response) => {
      let query = queryValues(response.headers.location)
      expect(query.error).toBe('mock_error')
    })
})

test('refresh token path returns json error', () => expectJSONErrorOnPath('/refresh'))

test('refresh route valid mock gives an access token', () => {
  return supertest(server)
    .get('/refresh?refresh_token=mock_valid')
    .then((response) => {
      expect(JSON.parse(response.text).access_token).toBe('mock_success')
    })
})

test('refresh route invalid mock gives an error', () => {
  return supertest(server)
    .get('/refresh?refresh_token=mock_invalid')
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('mock_error')
    })
})

test('static route works for now', () => {
  return supertest(server)
    .get('/')
    .then((response) => {
      expect(response.text).toMatch(/Currently Playing Display/)
    })
})

test('app listen works', () => {
  let listener = server.runOnPort(9999)
  console.log = jest.fn()
  return supertest('http://localhost:9999')
    .get('/status')
    .then((response) => {
      expect(response.text).toBe('OK')
      listener.close()
    })
})

function expectJSONErrorOnPath (path) {
  return supertest(server)
    .get(path)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBeDefined()
    })
}

function queryValues (url) {
  return Array.from(url.slice(url.indexOf('?') + 1).split('&')).reduce((object, pair, index) => {
    let key = pair.slice(0, pair.indexOf('='))
    let value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}
