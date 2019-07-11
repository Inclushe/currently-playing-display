# Currently Playing Display

Testing getting Spotify tokens requires an unautomated browser. This may need to be done manually by going to this URL:
https://accounts.spotify.com/authorize?client_id=1130bb87f6ea402e98afed27aee886c8&response_type=code&redirect_uri=http://127.0.0.1:9999&scope=user-read-currently-playing

## TODO

## Planned Support

- [ ] Spotify (using web API)
- [ ] Last.fm (using musicbrainz for album covers)

## Timeline

- [ ] Server
  - [X] Serve whatever's in client (for now)
  - [X] Serve callback route
    - [X] Test success
    - [X] Test failure
  - [X] Serve reset token route
    - [X] Test success
    - [X] Test failure
  - [ ] Refactor
  - [ ] Decide how it should be returned to the client
- [ ] Client
  - [ ] Recreate design from Figma
    - [ ] Decide whether to include gradient, blurred cover art, or both
  - [ ] Start work in Vue

Remember to change all instances of "CHANGEME"
