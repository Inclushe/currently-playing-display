/* eslint-disable no-undef */

const addresses = require('../helpers/addresses')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

test('addresses work', () => {
  expect(addresses.test).toBe('OK')
})

test('local address should be 127.0.0.1', () => {
  expect(addresses.local).toBe('127.0.0.1')
})

test('remote address should be the one from ifconfig', () => {
  return exec('ifconfig')
    .then((std) => {
      expect(std.stdout).toMatch(new RegExp(addresses.remote))
    })
})
