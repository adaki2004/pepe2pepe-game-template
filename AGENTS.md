# Publish a game through the IMD Swarm

Read [ART_DIRECTION.md](ART_DIRECTION.md): every game needs a distinct visual identity and an original, gameplay-specific cover.
## Verified arcade workflow exception

When the approved workflow references ARCADE_REWARDS.md, follow it instead of the contract-only gameplay rules in ONCHAIN.md. Use the frozen engine and reward vault, mandatory host session API, and platform-signed claims submitted by players. No AI during play, no score-trusting endpoint, no private server or player gas sponsorship. Standalone publication is a landing page linking to hosted play; provide a non-reward review demo. Do not invent custom reward rules or launch from a browser-only brief.

## On-chain workflow exception

When assigned a contract-to-website workflow that explicitly references ONCHAIN.md, follow ONCHAIN.md for contracts, token economics, ownership, wallet bridge and export. The browser-only prohibition on wallets does not apply to that explicit route. Do not turn a browser-game assignment into a token launch yourself.

## Know your role

If you are already executing an assigned Swarm `build-website` task, you are the build worker: apply the game/export contract in INTEGRATION.md, implement and test the game, and deliver its static export. Do not open another paid job, wait for your own future hosting CID, or run the release helper inside that disposable build. Include the mandatory callback from REGISTRATION.md in the game README and your final handoff. The original coordinating creator agent handles publication waiting and submission after your task completes. If there is no post-publication continuation, report registration pending; a completed build is not a completed publishing workflow. The workflow below is for that coordinating agent.

Read README.md, CREATOR_GUIDE.md, INTEGRATION.md and REGISTRATION.md before acting. The human supplies only the game idea, visual design and UX (brief.json). Fill missing creative details with sensible defaults. You, the coordinating creator agent, own the complete workflow through successful submission. Do not send the person to a CID, manifest, deployment or submission form.

1. Plan: refine brief.json with the user's idea, design and UX. Run `npm run brief`.
2. Build: submit `.private/job.json` to the IMD Swarm's `job.open` action using your existing authorized access. Discover current payment terms at https://api.imd.fun/requests/capabilities and API at https://api.imd.fun/openapi.json. Listing submission is free; Swarm compute is separately priced. Never spend outside the creator's authorized budget or request an operator key. Keep the paid request receipt private and reuse it after timeouts. Do not invent a free build endpoint. If no authorized Swarm access is configured, explain that blocker; do not report a job started.
3. Test: require the Swarm implementation and design review to test the exported game, including keyboard, touch, pause, restart, iframe storage denial and audio gestures. Inspect its test evidence; run the hosted iframe yourself when browser tools are available. Fix failures via the existing Swarm continuation flow, never claim that structural acceptance alone proves gameplay quality.
4. Host: the job must request `ipfs: true` and `github: true`. Swarm publication happens AFTER the build job completes. Keep waiting. Swarm gives the game its own IPFS website and ENS name; naming/certificate issuance can take longer than pinning. Retain the direct IPFS link.
5. Submit: run `npm run release -- --job JOB_UUID`. This automatically resolves the published CID, downloads and validates pepe-game.json, verifies entry/cover availability, saves a private idempotency receipt, and POSTs the review API. It may run while building and wait for publication. Resume the exact same command after transient failures. An optional contact can be provided if the creator volunteered it; otherwise the Swarm job is the contact reference. No human submission step.

Report the working website, Swarm job, submission ID and actual review status. Pending is successful submission, not approval. Admin approval remains human. Never call admin endpoints or put credentials, private receipts, contact information, wallet keys, or authorization tokens in dist, public logs, source commits, screenshots, videos or the published cover. Do not expose a private receipt in a chat transcript.

The release script belongs in the coordinating agent's workspace, not inside the game browser or the disposable build worker: the final hosting CID does not exist while the worker builds. Keep the coordination process alive or schedule a continuation until submission succeeds. Do not stop when the worker hands back source.
