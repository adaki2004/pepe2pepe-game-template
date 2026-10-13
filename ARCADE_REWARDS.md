# Verified arcade + game token — pepe-arcade/1

Read [ART_DIRECTION.md](ART_DIRECTION.md): every game needs a distinct visual identity and an original, gameplay-specific cover.
This route is available only when the signed launch plan explicitly requests it. Browser-only games keep their existing contract. Contract-enforced puzzle games still follow ONCHAIN.md. Do not silently migrate an old launch or invent platform signing permissions.

## Build an excellent game around reviewed rules

Produce a complete polished HTML5 game, with original art direction, strong silhouette/readability, responsive animation, varied audio, clear hit feedback and touch controls. Choose an appropriate rendering library (Canvas, PixiJS, Phaser or Three.js are options, not requirements). Avoid generic dashboard styling or placeholder graphics. The user supplies idea, look and experience; you implement and test the entire release.

Rewarded gameplay uses the **exact** [sdk/arcade-engine.mjs](sdk/arcade-engine.mjs), whose file keccak256 must match the approved workflow's `rulesHash`. Do not modify it. The first ruleset, `pepe-arcade-run/1`, is a 60-second, 30-tick/second dodge-and-shoot arcade. World coordinates are 0–1000; directions are input bits 1=left, 2=right, 4=up, 8=down, 16=fire. Each tick records a two-character lowercase hex byte (00–1f). The run ends at 1800 ticks or zero health; score is capped at 100. Renderer interpolates between fixed ticks independently of frame rate. Freeze physics and input recording when paused; a real-time five-minute session deadline still applies. Throttle catch-up to avoid a spiral after a hidden tab.

You may transform visuals into a space dogfight, storm chase, haunted carnival or another distinctive theme while retaining the same rules. New collision, movement, scoring, physics, time or win rules require a separately reviewed backend verifier/version before token rewards are available. If the brief cannot fit, state the incompatibility for review; never pretend an arbitrary game score is verified.

No AI during play or result verification. The worker recomputes legal state transitions from the transcript. This rejects invented scores and illegal inputs, but does not prevent bots, offline optimization, multiple wallets or automated legal play. Do not advertise cheat-proof or human-only rewards. The economy must remain bounded under optimal automated play.

## Ownership, launch and funding

Apply the fixed supply, ownership, allocation and fee receivers from [ONCHAIN.md](ONCHAIN.md): plain one-billion-supply launch token; 80% Swarm pool, 10% Swarm, nominally 9.5% creator and 0.5% Pepe2Pepe. Creator/platform receive 90/10 of requester trading-fee receipts. Swarm separately retains its network share. Creator owns application administration; seeded LP is held by Swarm.

The platform sponsors only the approved 0.5 IMD launch build. No player transactions, recurring gas, rewards, liquidity additions or other launch budget are promised. The creator funds the reward vault by transferring the game token into it. The host has creator funding controls. Each valid point earns **1 token** (1000000000000000000 raw units), maximum 100 tokens per run. This fixed initial policy is in the signed plan, not a creator-supplied score or game-chosen payout. No paid entry in this version.

The unfunded verifier EOA is supplied by the approved workflow. It signs reward vouchers only, never transactions; it has no mint, upgrade, treasury or LP permissions. This is an explicit trusted-results service, not trustless validation. A compromised signer can authorize false claims against funded reserves; the contract caps each claim but cannot detect a dishonest signer. Use bounded reserves. Service outages can delay or prevent verification; reward claims expire as disclosed. Do not accept stakes or payment from players.

## Contracts

Copy [contracts/ArcadeRewardVault.sol](contracts/ArcadeRewardVault.sol) unchanged, with its OpenZeppelin dependencies. Use an application contract named `Game` that inherits it and only forwards constructor arguments:

```solidity
contract Game is ArcadeRewardVault {
    constructor(address creator, address launchToken, address verifier,
                bytes32 rules, uint64 closingTime)
        ArcadeRewardVault(creator, launchToken, verifier, rules,
                          1 ether, closingTime) {}
}
```

Use the actual launch token from the Swarm deployment plan, explicit creator owner, approved signer and rules hash. Choose closingTime approximately 365 days after deployment (constructor accepts 14–366 days); disclose the exact deployed timestamp. No upgrades, proxy, extra withdrawal path, additional claims, minting or replacement token. Owner recovers unused deposited reward tokens only after closingTime, when all vouchers have expired. Player-funded stakes are forbidden. Successful claims pay only `msg.sender`, which must equal the signed player. EIP-712 binds chain, vault, session, player, release hash, rules hash, amount and deadline. Duplicate sessions cannot claim twice.

Expose the exact vault ABI: `owner`, `token`, `signer`, `rulesHash`, `rewardPerPoint`, `maxReward`, `closesAt`, `claimed(bytes32)`, `claimReward(bytes32,address,bytes32,bytes32,uint256,uint64,bytes)`, `recoverExpired`. There is no transaction for start, each tick or game completion. Only funding/recovery and player claims transact.

## Standard host interface

Bundle `sdk/arcade-client.js`, `sdk/arcade-engine.mjs` and `sdk/onchain-bridge.js` locally. The opaque iframe still uses `pepe-game/1` source-window/channel binding. The SDK wraps `arcade.start`, `arcade.finish`, `arcade.status`, `arcade.claim` inside the existing `type: "chain"` bridge. No raw wallet provider, secret or private session capability enters the iframe.

1. Player connects a wallet and clicks Play; `start()` starts the run without a message signature or transaction. Connecting an address is not proof of ownership; the host verifies ownership only when claiming. Result includes server seed, rules hash, tick rate, maximum ticks and expiry. Start returns an existing unfinished/unclaimed session for safe recovery; inspect `state` before starting animation.
2. Call `tick(input)` once per fixed simulation tick. Render its returned state using your own art and effects. Never send frame updates to the API. Never calculate token entitlement in the client.
3. When `run.done`, call `finish()`. The host uploads bounded inputs once, preserving idempotent retries.
4. Poll `status()` only while queued (at least two seconds apart, stop after 60 seconds and offer Retry). Show “Checking your run…” honestly. The bridge returns `signed`, `rejected` or `expired`; a zero-score run has no voucher. For v1 game compatibility, `signed` means claim-ready UI data: a newly verified run also has `verificationState: "verified"` and `voucher.authorizationRequired: true`, with no signature yet. A queued result is not a payout.
5. Offer Claim only when nonzero claim-ready reward details exist. `claim()` opens the host confirmation: first a free wallet message proves ownership and binds this run, then a separate claim transaction pays network gas. The host obtains and validates the actual signed voucher before transacting. Existing signed rewards do not need the extra ownership message. Never try to submit unsigned preview data directly to a contract. Show expiry and failures. Never auto-retry uncertain transactions. The host's My reward control supports claim recovery after refresh.

The host stores a session capability outside the game. It creates a private browser session, verifies release approval and contract funding, reserves a maximum run reward, and queues deterministic verification. A connected address is only a hint until claim-time wallet proof. After that proof, a separate worker with the unfunded key rechecks the transcript and signs the computed amount. Admission allows one active run per browser, with browser/network/global rate and queue bounds. Claim authorization enforces the creator's per-wallet budget and a global 20-per-hour wallet limit. These are abuse bounds, not proof of unique humans. Multiple wallets are not prevented. Spent but unexpired vouchers may conservatively reserve capacity until expiry, even after claiming; this favors avoiding overcommitment over perfect capital efficiency.

Backend transport is versioned `/v1/arcade`: POST `play`, POST `sessions/:id/finish`, GET `sessions/:id`, POST `sessions/:id/claimChallenge`, POST `sessions/:id/authorize`. Legacy POST `challenge` and `sessions/:id/start` remain for already-open older clients. The backend uses a `verified` state for replay-checked, unsigned results; the host adapts it to the v1 bridge representation above. These routes require a trusted host envelope; use the SDK rather than calling them from the game. The host bridge is the public integration interface. Bridge reward details are exposed directly as `voucher.player`, `voucher.amount`, `voucher.deadline`, `voucher.session`, `voucher.releaseHash` and `voucher.rulesHash`. A real signed voucher additionally retains its EIP-712 `domain`, `types`, `value` and `signature`. Do not confuse claim-ready display details with a signed authorization. The host handles proof, signatures, contract checks and transaction confirmation. Receipts/results, errors and rule version are stable protocol data; do not rely on internal database tables.

## Hosted play and standalone publication

Standalone `index.html` shows a beautiful game cover, description and **Play on Pepe2Pepe** linking to `https://pepe2pepe.fun[/robinhood]/games/play/BUILD_REQUEST_ID` (the approved context supplies `id`). No standalone wallet integration or rewarded play. When framed, wait for the actual host handshake before entering the game; do not merely trust a `?host=true` parameter. This controls the shipped UX, not copied-code execution. Origin checks/iframe restrictions cannot prove a human used our website; rewards require our authenticated session and signature regardless of where modified code runs.

The host sends `preview:true` in the init handshake for administrator preview. Provide a clearly marked **Review demo · no rewards** using a fixed local seed in that case. It must exercise controls, physics, loss/win feedback and pause without wallet or backend calls. Keep normal public rewarded play dependent on a session. Do not display demo scores as verified results.

## Mandatory enriched publication callback

Keep the existing on-chain export and Swarm workflow callback: actual job ID, workflow ID, immutable CID, verified deployment handoff, real launch ID, creator, chain, Game/token addresses, allocation/trading/split/platform addresses, ABI/source/test evidence and cover. `dist/pepe-game.json` retains `schemaVersion: "pepe-onchain-game/1"`, with `maxActionValueWei: "0"`, `maxTokenApproval: "0"`, and adds:

```json
"rewards": {
  "protocol": "pepe-arcade/1",
  "rulesId": "pepe-arcade-run/1",
  "rulesHash": "EXACT_HASH_FROM_APPROVED_CONTEXT",
  "signer": "EXACT_UNFUNDED_SIGNER_FROM_APPROVED_CONTEXT",
  "rewardPerPoint": "1000000000000000000",
  "hostedOnly": true
}
```

This `rewards` object goes inside `onchain`. Never invent addresses/hash/launch receipts. The platform verifies deployed getters and runtime hash and stores this provenance before review. The sponsorship worker performs the registration callback after publication; do not create a nested job or run the browser-only release helper in the build. Existing owner consent without verifier authorization cannot enable this route.

Ship `artifacts/validation.md` and machine-readable test evidence: exact engine hash, deterministic replay fixtures, malformed transcript rejection, responsive keyboard/touch controls, pause/restart/end state, wallet cancellation, pending/expired claims, tampering/wrong wallet, duplicate/cross-vault/cross-chain claim, underfunded vault and owner recovery deadline. Include commands actually run and any limitations. Never claim production rewards tested unless actual receipts exist. Admin reviews the immutable release before listing.

## Creator operations

See [CREATOR_CONSOLE.md](CREATOR_CONSOLE.md) for owner activity, funding and reward controls, and [BUILD_SIZES.md](BUILD_SIZES.md) for measured sizes and current publishing limits.
