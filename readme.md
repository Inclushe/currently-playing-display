# Currently Playing Display

Testing getting Spotify tokens requires an unautomated browser. This may need to be done manually by going to this URL:
https://accounts.spotify.com/authorize?client_id=1130bb87f6ea402e98afed27aee886c8&response_type=code&redirect_uri=http://127.0.0.1:9999&scope=user-read-currently-playing

## TODO

## Planned Support

- [ ] Spotify (using web API)
- [ ] Last.fm (using musicbrainz for album covers as last.fm api ToS disallows image hotlinking)

## Known Issues

- [ ] Vue breaks when there is no album art (local files)
- [ ] No message when nothing playing
- [ ] Testing using postToSpotify doesn't work (find a different way to test vue templates)

## Timeline

- [?] Server
  - [X] Serve whatever's in client (for now)
  - [X] Serve callback route
    - [X] Test success
    - [X] Test failure
  - [X] Serve reset token route
    - [X] Test success
    - [X] Test failure
  - [X] Refactor
  - [X] Decide how it should be returned to the client
- [ ] Client
  - [X] Barebones client fetch from Spotify
  - [X] Recreate design from Figma
  - [ ] Backgrounds
    - [X] Make album blurred background
    - [X] Modularize gradient maker
      - [X] Decide if it should be animated
  - [X] Make gradient background
  - [X] Add Interval
  - [?] Add Settings (rudimentary for now, click album cover)
    - [X] Background Style
      - [X] Gradient
      - [X] Cover Art Blurred
      - [X] Both
      - [X] None
  - [?] Animate Gradient
    - Could be better
  - [?] Fix give-me-a-gradient to make gradients more saturated
  - [X] Recreate Figma designs
  - [X] Animate Song Transitions
    - Mock in AE first
  - [X] Refresh token on expiration
  - [X] Eat Params
  - [X] Fix Background on wide displays
  - [X] Gradients are washed out in Chrome (fixed within give-me-a-gradient)
  - [ ] Hide Setting Button
  - [ ] Settings
    - [ ] Implement
      - [?] Provider
      - [X] Background Type
      - [X] Animation Toggle
      - [ ] Album Curved Edges
      - [ ] Track Info
        - [ ] Always show album title
        - [ ] Hide Album Name According to below rules
          - [ ] Track is from a single
          - [ ] Album is self-titled
          - [ ] Track shares the name of the album
        - [ ] Always hide album title
    - [ ] Auto Save
  - [ ] Add Last.FM as Option
    - [ ] Make input box that takes username on homepage
    - [ ] Add functionality to app
    - [ ] Get album covers from musicbrainz

## Nice to haves

- [ ] Parse Track Title dashes and parentheses as tags

## Bugs

- [ ] Background transitions can get nasty
- [ ] Gradients require CSS filter to saturate
- [ ] Album image is loaded multiple times

Remember to change all instances of "CHANGEME"
