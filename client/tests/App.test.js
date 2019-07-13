/* eslint-disable no-undef */
import Vue from 'vue'
import App from '../src/public/components/App.vue'
const assert = require('assert')

describe('App', function () {
  it('has message "Hello world from Vue!"', () => {
    assert.strictEqual(App.data().message, 'Hello world from Vue!')
  })

  it('has spotify object', () => {
    assert(typeof App.data().spotify === 'object')
  })
})