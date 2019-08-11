const express = require('express')
const spotifyController = require('../controllers/spotifyController')
const router = express.Router()

router.get('/status', (request, response) => {
  response.send('OK')
})

router.get('/spotify/authorize', spotifyController.authorize)
router.get('/spotify/callback',
  spotifyController.checkForCode,
  spotifyController.callback
)
router.get('/spotify/refresh',
  spotifyController.checkForRefreshToken,
  spotifyController.refresh
)

module.exports = router
