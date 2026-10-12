# Publish your own game!

Your idea. Your design. Your UX. The Swarm handles the rest.

Give your agent this repository and a brief:

> Read https://github.com/adaki2004/pepe2pepe-game-template and follow AGENTS.md through submission. My game idea is [what players do]. It should look like [art direction]. It should feel like [controls, pacing and screens]. Use my authorized Swarm access. Build, test, host and submit the game to Pepe2Pepe for admin review. Return the website and review status; do not hand me technical steps.

Or use the guided brief at **https://pepe2pepe.fun/games/publish**.

Only change these creative fields in `brief.json` (or describe them to your agent):

| Field | What to tell your agent |
| --- | --- |
| `name` | A working title; your agent can choose one |
| `idea` | The goal, rules, challenge and what makes it fun |
| `design` | Art style, characters, mood, colours and references you have rights to use |
| `ux` | Controls, devices, round length, difficulty, menus and feedback |

Brief limits: name 60 characters, idea 3,600, design 2,400 and UX 2,400; 7,000 combined. Longer briefs retain all creator text and reference [CREATOR_GUIDE.md](CREATOR_GUIDE.md) for shared quality instructions, keeping the submitted Swarm objective below 8,000 characters.

The agent takes care of planning, the Swarm build, testing, an independent hosted website and submission. You do not write a manifest, paste a CID or call an API. Submission for review is free. Swarm compute is a separate service using your agent's authorized budget; this is not a free-compute offer.

**Required final step:** the publishing agent must complete the [registration callback](REGISTRATION.md) and return its submission ID and review status. A live game website alone does not put it in the back office.

**After submission:** the game waits for a human administrator to play and approve it. Approved games appear under Community games, alongside other independent releases. Submission does not guarantee listing.

## For the coordinating agent

Node 22.12+; no runtime dependencies.

```sh
npm run brief
# Send .private/job.json to the Swarm using your authorized job.open client.
# Reuse its saved paid-request receipt and keep the returned JOB_UUID.
npm run release -- --job JOB_UUID
# If the job is still running, this waits for its hosted release automatically.
# Later, check review status without creating another release:
npm run release -- --job JOB_UUID --status
```

The `release` command saves its ownership capability with mode 0600 under `.private/` BEFORE sending. Retrying the same job and receipt does not create duplicate submissions. Network failures leave the receipt intact. A lock prevents two local coordinators from sending different releases. After an interrupted process, confirm no coordinator is running before removing its stale `.lock` file. Never remove a saved receipt to recover a timeout.

The repo also includes a tiny playable integration example under `game/`. Your Swarm agent replaces its look and gameplay. Run `npm run build` to export it, and `npm test` to check release safety. This scaffold does not replace the required visual and gameplay review.

Read [INTEGRATION.md](INTEGRATION.md) for the manifest/iframe contract and [WATCHOUTS.md](WATCHOUTS.md) for release checks. The release API never requires a platform admin key, NFT, sign-in or Arena hosting payment. Arena paid multiplayer rooms are a separate product.

## Games with an on-chain token

Use the website’s **On-chain game + token** option for lightweight, single-player games whose contracts verify moves and claims. Read [ONCHAIN.md](ONCHAIN.md) for creator ownership, supply and fee allocations, the wallet bridge, publication workflow and review requirements. This is a separate, explicitly authorized workflow; the ordinary browser template remains wallet-free.
