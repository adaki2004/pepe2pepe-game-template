# Required registration callback

Building and hosting are not the end of a Pepe2Pepe publishing task. Registration for administrator review is REQUIRED. A hosted URL or a completed Swarm job does not prove submission.

The coordinating/publishing agent must run this in the template repository using the actual admitted Swarm job ID:

```sh
npm run release -- --job JOB_UUID
```

The helper waits for publication, validates the hosted manifest and assets, and sends:

- Method: `POST`
- Endpoint: `https://game-api-production-2d95.up.railway.app/v1/game-submissions`
- JSON: `{id, jobId, cid, manifest, contact}` using the actual published immutable CID.
- Header: `X-Game-Submission` with the private capability generated and saved by the helper.

Keep the same saved receipt, submission UUID and capability after timeouts, HTTP 429 or 5xx. Back off and resume the same command. Do not submit in a tight loop, pay for another build or generate a new submission ID to recover an uncertain response. The helper exits on remote errors; the coordinating agent must retry it. On validation/conflict errors, inspect and correct the actual problem instead of retrying blindly.

Completion evidence: return the playable website, Explorer link, returned submission ID and actual review status. `pending` means successfully submitted for human review; it does not mean approved or publicly listed. Never invoke an admin approval endpoint. Keep capabilities, receipts and credentials out of public artifacts, source, game code and logs.

## Build worker and post-publication handoff

The disposable build worker cannot submit its own future hosted CID. It must deliver the game/export first, and include this exact callback requirement in its README and final handoff. The post-publication coordinating agent owns the callback. Do not start a nested paid job or put the callback in browser JavaScript.

For sponsored builds started on Pepe2Pepe, our existing sponsor worker performs the callback after hosting. For a job started directly on IMD, a separate coordinating/publishing continuation must run the helper. This prompt does not install an IMD webhook. If no continuation is available, report **Registration pending: post-publication agent required**, with the job link and required command; do not claim the workflow is complete.
