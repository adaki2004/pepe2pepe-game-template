# Game quality and publication requirements

Deliver a finished HTML5 game with a clear goal, satisfying core loop, onboarding, meaningful challenge, pause, game-over and instant replay. No concept page or placeholder prototype.

Art direction: honour my idea, design and UX. Give characters, environments, menus, HUD and cover one distinctive identity: memorable silhouettes, intentional composition, cohesive colours, readable contrast, crafted animation and responsive hit/collect/win feedback. Use layered scenery, lighting, particles, camera motion and sound where they improve play. Honour reduced motion and include mute. Avoid generic AI-template styling, unrelated gradients, emoji-as-art, stock dashboard cards and placeholder geometry unless simple shapes serve a deliberate art style. Make an original game, not a reskin of the examples.

Optional tools: PixiJS (https://pixijs.com/) for 2D, Three.js (https://threejs.org/) for 3D, or Canvas/SVG/DOM for a small game. Choose one suitable stack, consult official docs, pin dependencies and bundle assets locally within the download budget. No required CDN or remote service. Keep loading fast and movement frame-rate independent on laptops and phones. Prefer a beautiful, focused scope over unfinished features.

Before delivery, play the full loop in a real browser. Inspect desktop and touch layouts and improve weak visuals/interactions. Run build, tests and sandboxed iframe checks. Commit README and actual test evidence; state limitations honestly. No missing evidence links or claims that unrun checks passed.

REQUIRED FINAL STEP — REGISTER WITH PEPE2PEPE
The publishing workflow is incomplete until our registration callback succeeds. After Swarm hosting is available, the coordinating/publishing agent MUST run npm run release -- --job JOB_UUID in the template repository, using the actual admitted job ID. It validates the hosted export and calls POST https://game-api-production-2d95.up.railway.app/v1/game-submissions with id, jobId, cid, manifest and contact plus a private X-Game-Submission capability.
Preserve the saved receipt; retry timeouts, 429 and 5xx with backoff using the SAME command, ID and capability. Never repay or create duplicate submissions. Return the website, Explorer link, submission ID and actual review status. A hosted URL alone is not a submission. Pending means awaiting admin review, never approved. Keep credentials out of game code, public artifacts and logs.

Read AGENTS.md, INTEGRATION.md and REGISTRATION.md in this repository for the complete export and post-publication workflow.
