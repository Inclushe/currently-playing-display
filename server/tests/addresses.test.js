/* eslint-disable no-undef */
const assert = require('assert')
const addresses = require('../helpers/addresses')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

describe('addresses', () => {
  it('addresses work', () => {
    assert(true)
    assert.strictEqual(addresses.test, 'OK')
  })

  it('local address should be 127.0.0.1', () => {
    assert.strictEqual(addresses.local, '127.0.0.1')
  })

  it('remote address should be the one from ifconfig', () => {
    return exec('ifconfig')
      .then((std) => {
        assert(new RegExp(addresses.remote).test(std.stdout))
      })
  })
})
