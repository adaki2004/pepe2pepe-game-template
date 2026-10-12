# Browser build sizes and Swarm delivery

Measured 2026-10-12 from the local PepeArena `Builds/Web` export:

- Total: 59,734,295 bytes = **56.97 MiB**, 17 files.
- Web.data.gz: 46.14 MiB transfer / 59.40 MiB unpacked.
- Web.wasm.gz: 10.70 MiB transfer / 40.76 MiB unpacked.
- Framework + loader + template: roughly 0.13 MiB transfer.

This is the local build's file footprint, not a measured cold-network waterfall or total runtime memory. The deployed version may differ. It is a separate Unity/Railway product, not evidence that Swarm can accept the same export today.

## Current boundary

The Swarm source checkout enforces an **8 MiB Git submission bundle** limit. This is not an instruction from the Pepe2Pepe prompt. Its token-site workflow also enforces at most 128 assets and 8 MiB per file, with a 64 MiB aggregate validation fetch budget that covers both immutable and named copies plus RPC. An exported site therefore needs to stay below half that validation budget with overhead. Git bundle size, extracted build size and compressed browser transfer size are different measurements.

Pepe2Pepe's catalogue does not impose an 8 MiB total game-download limit. However, listing still requires a valid completed Swarm publication; increasing our prompt cannot bypass upstream acceptance. The upstream service's live capabilities/publication checks take precedence over local source documentation.

## Larger-game target — pending upstream support

A **64 MiB compressed full browser-build target** accommodates this PepeArena reference. This is a proposed larger-game profile, NOT a presently supported Swarm upload allowance. Before enabling it, the Swarm operator must support the needed source bundle/artifact transport, per-asset sizes and publication validation budget. Token publication also needs a larger validation budget or a supported immutable asset-manifest strategy. Do not omit validation evidence or move files to unverified mutable external URLs as a workaround.

Keep the initial interactive download smaller through staged loading where the engine permits. Show real loading progress, cancel/retry failures and test on a modest laptop/phone. Record compressed transfer bytes, extracted bytes, initial-playable download, peak memory and observed frame pacing separately in artifacts/validation.md. Size is a ceiling, not a quality target: a distinctive 2 MiB game can be more polished than a generic 60 MiB game.
