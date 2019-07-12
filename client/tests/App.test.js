/* eslint-disable no-undef */
import Vue from 'vue'
import App from '../src/public/components/App.vue'

describe('App', function () {
  test('has message "Hello world from Vue!"', () => {
    expect(App.data().message).toBe('Hello world from Vue!')
  })
})