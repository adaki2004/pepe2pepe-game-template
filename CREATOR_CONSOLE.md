# Token-game creator console (beta)

Open [Games → Creator Console](https://pepe2pepe.fun/games/creator) with the wallet that owns your approved token game. Robinhood games use [/robinhood/games/creator](https://pepe2pepe.fun/robinhood/games/creator). A wallet signature unlocks activity; it is not a transaction or spending approval.

## Before the game is live

The console also shows pending token builds saved in the current browser, filtered to the connected creator wallet. Follow the Swarm job directly from the build card. Contract builds, website publication and game review come before live player statistics. If you submitted from another browser, open **Your submissions** there: private browser receipts are not a public wallet directory.

[Preview the console](https://pepe2pepe.fun/games/creator?example=1) without signing anything. The preview is prominently labelled **EXAMPLE DATA**; its numbers, wallets and SKYLINE HEIST release are illustrative, not evidence of a deployed game or real activity. It cannot fund a vault or save settings. Live and example player tables support wallet search; neither exposes raw IP addresses.

A rejected workflow quote can receive at most two bounded website-plan clarifications before any payment quote exists. Only reviewed frontend/export wording can change; the signed creative brief, ownership, chain and launch economics stay fixed. Unsupported refusals stop for platform review. Do not submit again to clear a waiting or clarification state.

## Three distinct things

| Capability | Current behaviour |
|---|---|
| Browser game without a token | No wallet needed; scores are display-only. |
| Verified arcade with a token | A supported fixed rules engine verifies inputs. Players claim tokens from a creator-funded vault and pay gas. Free entry does not mean gas-free claims. |
| Buying the token | A trade through its liquidity pool, separate from playing or claiming. A general embedded swap is **not implemented**. A creation prompt cannot enable arbitrary contract permissions. |

Contract-governed puzzles use their own reviewed rules and the existing contract bridge; the arcade console's reward controls do not apply to those games.

## What the owner can see

Rolling 24-hour started runs, distinct player wallets, verified play time, verified reward amounts, and the latest 100 active wallets with per-wallet totals. Distinct wallets are not necessarily distinct humans. Failed or unfinished runs count as starts, not verified play time. Only the owner can unlock private activity. The reward-pool token balance is read on demand from the selected chain; it includes reservations and must not be confused with uncommitted funds.

Earned amounts are issued reward entitlements, **not confirmed on-chain payments**. Use the vault's block-explorer link to inspect actual claims and transfers. Expired unclaimed entitlements remain in the historical earned count. No client-reported "claimed" flag is trusted. Raw IP addresses, session capabilities, replay inputs and claim signatures are not returned by the creator API.

## Editable controls

- Pause admission of new reward runs.
- Game reward budget per rolling 24 hours: default 10,000 points.
- Per-wallet reward budget per rolling 24 hours: default 1,000 points.
- Per-wallet started runs per rolling 24 hours: default 20, configurable 1–100. The global 20/hour wallet limit still applies.

The launch policy is 1 token per point, max 100 points per run. Reward budgets can be set from 100 to 1,000,000 points; wallet budget cannot exceed the game budget. These are admission limits, not changes to the vault's immutable exchange rate. A new run reserves its full possible 100-point reward, then verification releases the unused amount. Signed entitlements count against the rolling earned budget even if not claimed. Admission and policy edits share a database lock so concurrent requests cannot overbook budgets.

Existing sessions keep their reserved rewards and existing signatures remain valid. Lowering a budget below current usage blocks further admission until usage ages out. A pause does not confiscate earned rewards. Limits are per listed release and wallet; they cannot stop Sybil wallets, automated legal play, or external pool trading. Shared IPs and VPNs make per-IP reward allocations unsuitable as a promise of one-human-one-allocation. Platform abuse controls may evolve separately.

## Funding and ownership

The creator funds the vault with a wallet-confirmed token transfer. The platform sponsors the approved launch build only, not reward inventory or player gas. Vault funding is locked until its close date (see the contract); unused funds are recoverable by its owner only after all claim deadlines. Creator allocation and trading-fee receipts are available in the existing receipt controls. The platform signer cannot mint, trade, manage liquidity or withdraw the creator treasury.

## API and authorization

All creator requests are POST /v1/arcade/creator through the trusted website proxy, with an EIP-191 signature by the manifest's verified creator. The five-minute authorization message binds the game, action, timestamp, and (for edits) the exact ordered policy and revision. The backend validates owner independently; an address supplied by the browser is never proof of ownership. Edits use a monotonically increasing revision, so replaying an old signed edit cannot restore previous settings. Read authorization stays in browser memory only. No authorization belongs in a URL, analytics event or log.

The public static game never receives owner authorization. AI is used only for creation guidance; the verifier executes only the built-in reviewed engine, never generated server code. See ARCADE_REWARDS.md for the gameplay interface.

## Public launchpad activity

[Launchpad activity](https://pepe2pepe.fun/games/activity) is currently marked **Coming soon** in the public UI. Its retained backend provides aggregate website briefs, token/browser split, build pipeline, review queues, listed releases and a 14-day UTC submission chart. GET /v1/launchpad-stats returns only aggregate numbers and timestamps, cached for 60 seconds with concurrent requests combined into one database read. It does not query the blockchain.

A token brief is an intent, not a deployed token. Listed token games count only approved releases with an on-chain manifest. Website brief totals include declined requests and count each request ID once. Release totals are separate; external-agent submissions have no matching website-build receipt. Hidden/rejected releases do not count as published. Distinct versions may have separate release IDs. No private brief, contact, wallet, IP, signature or capability is selected for this endpoint.
