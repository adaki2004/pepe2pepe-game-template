# Agent integration contract

Human input is the brief. Everything below belongs to the coordinating agent and Swarm workers.

## Supported games

Free single-player static HTML5, Canvas or WebGL games. No dedicated server, wallet, paid admission, token prizes or trusted leaderboard in v1. Every asset is local and relative; no required remote fonts or third-party scripts. Export index.html, a 1200×630 cover and pepe-game.json at the directory root (normally dist/).

```json
{"schemaVersion":"pepe-browser-game/1","title":"My Pond Game","version":"1.0.0","summary":"Catch fireflies before the pond goes quiet.","description":"A short arcade game with a clear goal, score and restart.","controls":"Arrow keys or touch controls. P pauses.","genre":"arcade","players":1,"mobile":true,"entry":"index.html","cover":"cover.svg"}
```

Genres: arcade, puzzle, action, strategy, casual. Title 2–60 characters, summary 10–160, description 10–2000, controls 5–500. Semver is numeric major.minor.patch. Relative asset paths only, no traversal, query, remote URL or absolute path. Cover may be SVG, PNG, JPEG or WebP. Use only art you may publish.

## Iframe bridge

The player sandbox is `allow-scripts allow-pointer-lock`; no same-origin storage, navigation, popups or wallet access. Catch localStorage/sessionStorage failures. Embed dimensions vary; use the viewport, touch controls and readable text. Audio starts after a gesture. Pause on page visibility loss.

The parent sends `{protocol:'pepe-game/1', type:'init', channel:string}`. Check `event.source === parent`, save the channel and reply ready. Handle pause/resume only with matching source, protocol and channel. On game over send a finite nonnegative integer score. `parent.postMessage(message, '*')` is necessary for opaque origins; it must never contain secrets. See game/bridge.js for a small implementation. Scores are display hints only, not proof for payouts.

## Mandatory registration callback

Follow [REGISTRATION.md](REGISTRATION.md). The final `POST /v1/game-submissions` is required, not optional. Never report end-to-end completion without the returned submission ID and review status. Include these instructions in the build-worker handoff so the post-publication agent knows it must finish registration.

## Complete the Swarm lifecycle

1. Generate `.private/job.json` from the creative brief.
2. Use the Swarm `job.open` capability with skill build-website, github true, ipfs true, onchain false. Current protocol and terms: https://api.imd.fun/openapi.json and https://api.imd.fun/requests/capabilities. Use a supported agent integration and authorized spending budget. The optional @identitymd/paid-client is a workspace package, not a published npm dependency: do not blindly npm-install it.
3. Persist the work/payment receipt BEFORE submission. Resume the same order after uncertainty; never pay twice to fix a lost response. Never use a platform operator key as a public creator credential.
4. Keep the coordinating agent alive until `GET https://api.imd.fun/jobs/JOB_UUID` shows completed and site has a published CID. The build worker cannot know this future CID. The release helper waits up to two hours and can be resumed.
5. Run the release helper. It downloads the manifest from https://ipfs.imd.fun/ipfs/CID/pepe-game.json and POSTs to https://game-api-production-2d95.up.railway.app/v1/game-submissions with a persisted random UUID and secret X-Game-Submission capability. It checks that the published site's job ID matches. Never put that capability in a URL or public source.
6. Return website, job URL, submission ID and pending status. A human administrator approves in the back office. Check the private status with the same receipt; after approval return https://pepe2pepe.fun/games/play/SUBMISSION_ID.

Public API reference: https://pepe2pepe.fun/games/docs/openapi.json. Public catalogue: GET /v1/catalog. Private review status: GET /v1/game-submissions/:id with X-Game-Submission. Updates are new immutable releases, new version and new job/CID; retain older receipts. Never submit a mutable ENS address in place of a CID. ENS provides a friendly standalone address; the arcade pins the exact reviewed release.

## Recovery

- Build failure: inspect the same Swarm job, fix through continuation using authorized access.
- Publication pending: wait, then resume the same release command. Job completed does not mean hosted.
- Limo certificate not ready: return the working IPFS link and name; don't claim the HTTPS name works yet.
- API timeout/429/5xx: preserve receipt, back off, retry the same command.
- 409: stop and inspect the receipt; do not generate replacement IDs blindly.
- Rejected: read the private reason, fix in a new version, submit the replacement through Swarm.
- Approved: return the public arcade player link. Hidden means no longer discoverable; IPFS is still public.

New submissions require a Swarm job ID. The API checks that the job completed, published this CID and contains the same manifest. This verifies publication, not creator identity or asset rights. Admin review still checks those claims. Existing submissions and their original private receipts remain usable.
