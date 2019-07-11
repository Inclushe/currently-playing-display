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

test('callback route returns json error', () => expectJSONErrorOnPath('/callback'))

test('callback route valid mock gives an access token', () => {
  return supertest(server)
    .get('/callback?code=mock_valid')
    .then((response) => {
      expect(JSON.parse(response.text).access_token).toBe('mock_success')
    })
})

test('callback route invalid mock gives an error', () => {
  return supertest(server)
    .get('/callback?code=mock_invalid')
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('mock_error')
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
      expect(response.text).toMatch(/Hello world!/)
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