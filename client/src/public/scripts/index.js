const buttonsElement = document.body.querySelector('#buttons')
const lastfmUsernameElement = document.body.querySelector('#lastfmUsernameInput')
const lastfmButtonElement = document.body.querySelector('#lastfmButton')
const lastfmForm = document.body.querySelector('#usernameForm')
const closeButtonElement = document.body.querySelector('#close')
const errorMessageElement = document.body.querySelector('#error')
let isShowingUsernameElement = false
let isInErrorState = false

lastfmButtonElement.addEventListener('click', showLastfmElement)
closeButtonElement.addEventListener('click', hideLastfmElement)

lastfmForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = lastfmForm.username.value
  disableSubmitButton()
  hideErrorMessage()
  checkIfUsernameIsValid(username)
    .then(isValid => {
      enableSubmitButton()
      if (isValid) {
        redirectToAppPageWithUsername(username)
      } else {
        showErrorMessage()
      }
    })
})

window.addEventListener('load', () => {
  let queries = getQueriesFromURL()
  if (queries && queries.lastfmAuth) {
    showLastfmElement()
  }
})

function checkIfUsernameIsValid (username) {
  return fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${process.env.lastfm_key}&limit=1&format=json`)
    .then(res => res.json())
    .then(json => {
      if (json.error) {
        return false
      } else {
        return true
      }
    })
}

function redirectToAppPageWithUsername (username) {
  window.location = `/app?username=${username}&auth_provider=lastfm&key=${process.env.lastfm_key}`
}

function showLastfmElement () {
  buttonsElement.style.display = 'none'
  lastfmUsernameElement.style.display = 'block'
  isShowingUsernameElement = true
}

function hideLastfmElement () {
  buttonsElement.style.display = 'block'
  lastfmUsernameElement.style.display = 'none'
  isShowingUsernameElement = false
}

function disableSubmitButton () {
  console.log(lastfmForm.sumbitButton)
  lastfmForm.sumbitButton.disabled = true
}

function enableSubmitButton () {
  lastfmForm.sumbitButton.disabled = false
}

function showErrorMessage () {
  errorMessageElement.textContent = 'Username not found.'
}

function hideErrorMessage () {
  errorMessageElement.textContent = ''
}

function getQueriesFromURL () {
  return Array.from(window.location.search.split('&')).reduce((object, pair, index) => {
    if (index === 0) {
      pair = pair.slice(1, pair.length)
    }
    const key = pair.slice(0, pair.indexOf('='))
    const value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}