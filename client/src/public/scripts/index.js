const buttonsElement = document.body.querySelector('#buttons')
const lastfmUsernameElement = document.body.querySelector('#lastfmUsernameInput')
const lastfmButtonElement = document.body.querySelector('#lastfmButton')
const lastfmForm = document.body.querySelector('#usernameForm')
const closeButtonElement = document.body.querySelector('#close')
let isShowingUsernameElement = false
let isInErrorState = false

lastfmButtonElement.addEventListener('click', showLastfmElement)
closeButtonElement.addEventListener('click', hideLastfmElement)

lastfmForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = lastfmForm.username.value
  disableSubmitButton()
  checkIfUsernameIsValid(username)
    .then(isValid => {
      enableSubmitButton()
      if (isValid) {
        redirectToAppPageWithUsername(username)
      }
    })
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
  lastfmForm.sumbitButton.disabled = 'disabled'
}

function enableSubmitButton () {
  lastfmForm.sumbitButton.disabled = ''
}