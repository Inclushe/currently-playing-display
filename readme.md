# Currently Playing Display

## TODO

## Planned Support

- [X] Spotify (using web API)
- [ ] Last.fm (using musicbrainz for album covers as last.fm api ToS disallows image hotlinking)

## Issues

- [X] Vue breaks when there is no album art (local files)
- [X] No message when nothing playing
- [ ] Background transitions can get nasty
- [ ] Gradients require CSS filter to saturate
- [ ] Album image is loaded multiple times
- [ ] Album image blinks on load even though we wait for it to load

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
  - [X] Decide how it should be5 returned to the client
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
  - [X] Hide Setting Button
  - [ ] Settings
    - [ ] Implement
      - [?] Provider
      - [X] Background Type
      - [X] Animation Toggle
      - [X] Album Curved Edges
      - [X] Track Info
        - [X] Make Radio Buttons like checkboxes
        - [X] Always show album title
        - [X] Hide Album Name According to below rules
          - [X] Track is from a single
          - [X] Album is self-titled
          - [X] Track shares the name of the album
        - [X] Always hide album title
    - [X] Auto Save
    - [?] Make Settings Responsive
    - [?] Hide cursor when settings is hidden
    - [ ] Add Reset Button
    - [ ] Add Credits
  - [X] Add Last.FM as Option
    - [X] Separate into providers
      - [X] Spotify
        - [X] authenticate
        - [X] getCurrentTrack
        - [X] getAlbumArt
        - [X] refreshToken (only for spotify)
        - [X] handleGetCurrentTrackErrors
      - [X] Last.fm
        - [X] authenticate
        - [X] getCurrentTrack
        - [X] getAlbumArt
    - [ ] Fix track transitions in Firefox
      - Painting takes a long time for some reason
    - [ ] Make input box that takes username on homepage
    - [ ] Add functionality to app
      - [ ] Call Last.fm API
      - [ ] Use MBID to get album art from coverartarchive.org
      - [ ] Fill it in
    - [ ] Get album covers from musicbrainz

## Nice to haves

- [ ] Parse Track Title dashes and parentheses as tags

Remember to change all instances of "CHANGEME"
