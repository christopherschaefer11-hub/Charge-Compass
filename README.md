# Charge Compass
Private Omaha charger map for a Wagoneer S.

Build: node build.mjs
Test: node test.mjs
No package installation required. Cloudflare Worker ESM with R2 BUCKET.

POST /api/refresh fetches the public USDOT/BTS AFDC layer and replaces stations.json in R2 only after validation. GET /api/stations reads it. Both are protected by owner-private Sites access. Use the Sites service bearer only in the OAI-Sites-Authorization header for unattended runs. Never change the audience without adding application-level write authorization.

Station directory is not live stall availability. Field Club is an approximate home-area anchor. Route is representative, sourced from OSRM. Favorites and notes are device-local.

Weekly refresh automation: 6add1d8dd2ac8191b8cd311e9f9963c6. Enabled Sunday mornings around 06:00 America/Chicago. Created through Automations because Sites schedule linking returned invalid_project. Reuse this automation; do not create a duplicate based on an empty Sites automations list.
