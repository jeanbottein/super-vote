# super-vote's promo video

A one-minute vertical video (1080x1920, 60 fps) for TikTok, Reels and Shorts: a
group chat that cannot pick a team name, then super-vote deciding it by
majority judgment, what that method is and why it needs no strategy, a summer
trip by approval voting, a dinner whose results wait for the poll to close,
the science behind both methods, and what super-vote promises. It is a web
page, rendered frame by frame.

```bash
npm ci                                       # Node 22.22+ or 24.15+, like the web app
npm run render                               # out/super-vote-promo.mp4, about 3 minutes
npm run render:no-music                      # effects only, under a platform's own sound
node render.mjs out/draft.mp4 --draft        # 30 fps, for a quick look
node snap.mjs out/stills 9.8 12.4            # stills of chosen moments, in seconds
node snap.mjs out/fidelity 0 --query=?fidelity  # the README's scene, to set beside docs/images
```

It needs Google Chrome (`CHROME=<path>` where it is not in macOS's
/Applications), ffmpeg, and the network: the emojis load from GitHub.

## How it works

- **`src/scenes.js`** is the video, scene by scene, on one GSAP timeline set
  to a 120 BPM grid: a beat is half a second, and cuts fall on beats. Each
  scene's start is in its table `T`, and the soundtrack's plan in `MUSIC`.
  `render.mjs` seeks it frame by frame and never plays it, so two renders are
  the same.
- **`src/ui.js`** draws the app's screens (the form, the share sheet, ballots,
  results) as its components render them, in the app's own stylesheets:
  `lib.mjs` serves an `app.css` made from `clients/web/src` as it is asked for
  (`app-css.mjs`: scoped to `.app` elements, laid out for a phone). The styles
  follow the app; the markup is a copy, so a component whose markup changes
  needs the same change here. The fidelity view shows any difference.
- **`src/ranking.js`** stages the live results with `Ranking.java`'s rules:
  majority mention, then GMJ score, ties sharing a rank. The server stays the
  reference; the fidelity view reproduces the README's scores.
- **`src/audio.js`** synthesizes the soundtrack in the page (an
  OfflineAudioContext): a groove in F major and a sound for each cue the
  scenes register, so that it lines up with the frames to the sample.
  `render.mjs` brings it to -14 LUFS with ffmpeg.

Credits: Microsoft's Fluent Emoji 3D (MIT), Bricolage Grotesque (OFL), GSAP
(its standard no-charge license), Playwright (Apache 2.0).

## Traps already paid for

- CSS `zoom` scales an element's own `transform` too: GSAP moves an unzoomed
  holder around each zoomed `.app` card.
- At equal specificity a rule inside `@scope` beats one outside it, whatever
  their order: the stage's overrides of the app double their class
  (`.app.app`).
- The app's `display` rules (`flex`, `grid`) beat the `hidden` attribute.
- A `tl.set()` at time 0 never renders: the playhead starts there.
- Never seek the timeline while building it: a tween first rendered out of
  order keeps the wrong starting values. Where something will be is measured
  with `spot()` instead.
