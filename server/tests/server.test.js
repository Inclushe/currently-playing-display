/* eslint-disable no-undef */
const server = require('../src/server')
const supertest = require('supertest')
const puppeteer = require('puppeteer')

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

test('callback route returns json', () => {
  return supertest(server)
    .get('/callback')
    .then((response) => {
      expect(JSON.parse(response.text)).toStrictEqual({
        error: 'Code not found'
      })
    })
})

// Testing getting Spotify tokens requires an unautomated browser. This may need to be done manually.

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
