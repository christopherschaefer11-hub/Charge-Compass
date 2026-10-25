# Charge Compass: GitHub handoff

Source exported October 25, 2026, from published commit 2faba8d9b32d6c9d5ddac84e539dd69a1b98c892.

## Upload
Extract this ZIP, create a GitHub repository, and upload the extracted files to its root. Include .gitignore and .openai/hosting.json. Upload the files, not just the ZIP. This does not change or migrate the existing private Site.

## Build and test
Use Node.js 22 or newer:

    node test.mjs
    node build.mjs

No npm dependencies are needed. The build emits dist/server/index.js (Cloudflare Worker ESM), preview.html (frontend with embedded seed data), and omaha-commute-chargers.kml. Leaflet and map tiles require internet access. This version is not an offline PWA.

## Hosting
GitHub can store the entire source. GitHub Pages alone cannot run server.mjs or /api/* endpoints. This is not a drop-in Pages deployment.

To keep all features on another host, configure a Worker-compatible runtime, an R2 bucket bound as BUCKET, authentication, and a scheduled refresh. The current server relies on owner-private Sites authentication; its Origin check is not authentication. Do not expose the refresh endpoint without replacing that protection. Never put service tokens in frontend code or GitHub.

For Pages, adapt the frontend to read a static JSON dataset updated by a scheduled workflow, or use a separately authenticated backend. The existing Sunday automation only updates the existing Site. A private repository does not automatically make a hosted website private.

## Files
- index.html: authored UI, map, filters, favorites, notes and navigation.
- core.mjs: station normalization, compatibility, access cautions, corridor distance, KML.
- server.mjs: API routes and persistent refresh logic.
- build.mjs / test.mjs: build and checks.
- stations-raw.json: bundled public USDOT/BTS AFDC snapshot.
- route.json / anchors.json: representative Field Club to Lamp Rynearson commute.
- .openai/hosting.json: existing Sites project identity and storage binding; not a configuration for another host.

Git history, credentials and local runtime state are excluded. Personalized commute anchors and vehicle description are included; review before publishing a public repository. Favorites and notes remain in your browser and are not exported. The seed is an October 24 snapshot, not the current server database. Directory status is not live stall availability. Preserve source/map attribution.
