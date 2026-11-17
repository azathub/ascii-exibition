# ASCII Art Exhibition

Fullscreen animated ASCII art. `#4b74ff` on `#ffffff`.

All seven Asciitopia patterns appear in the existing animation picker under
the **Asciitopia** category, using their default settings. They can be previewed
and added to the regular exhibition playlist. Fifteen additional, original
generative patterns are under **Generative art**. The Asciitopia weather scene
uses its offline demo and makes no network requests.

Every animation has a stable, one-based index shown in the picker and playlist.
Enter an index (for example, `25` or `#25`) in the animation search field to
find that animation.

The [Asciitopia core patterns](https://github.com/flawnn/asciitopia) are bundled
locally for static hosting with `npm run build:asciitopia`.

## Run

```bash
npm install
npm run build:asciitopia
python3 -m http.server 8000
# open http://localhost:8000, press F11 for fullscreen
```

The Asciitopia bundle is built from the npm dependency; Node.js 22 or newer is
required for that build.
