/* eslint-disable no-undef */
require('jsdom-global')(``, { url: 'http://localhost/' })
const Vue = require('vue')
const App = require('../.temp/App.js').default
const assert = require('assert')
let vm, Constructor

before(() => {
  Constructor = Vue.extend(App)
  vm = new Constructor({
    propsData: {
      mock: true
    }
  }).$mount()
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
