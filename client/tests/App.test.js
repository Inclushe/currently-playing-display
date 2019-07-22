/* eslint-disable no-undef */
import Vue from 'vue'
import App from '../src/public/components/App'
const assert = require('assert')

const refreshToken = process.env.refresh_token
let vm, Constructor

before(() => {
  Constructor = Vue.extend(App)
  vm = new Constructor({
    propsData: {
      mock: true
    }
  }).$mount()
})

describe('tokens', function () {
  // it('has access token', () => {
  //   assert(typeof access_token === 'string')
  // })
  // it('has refresh token', () => {
  //   assert(typeof refresh_token === 'string')
  // })
})

describe('App', function () {
  it('mounts', () => {
    assert.strictEqual(vm.$el.querySelector('h1').textContent, 'Mock Title')
  })

  it('has message "Hello world from Vue!"', () => {
    assert.strictEqual(App.data().message, 'Hello world from Vue!')
  })

  it('has spotify object', () => {
    assert(typeof App.data().spotify === 'object')
  })

  it('has getCurrentlyPlayingTrack', () => {
    assert(typeof App.methods.getCurrentlyPlayingTrack === 'function')
  })
})
