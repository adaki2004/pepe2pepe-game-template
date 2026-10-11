# Before your agent says “submitted”

- [ ] The creator's idea, visual style and UX are reflected in the actual game.
- [ ] Production export runs directly and inside the opaque-origin player iframe.
- [ ] Keyboard and advertised touch controls work; start, pause, restart and game over are tested.
- [ ] Sound starts after a gesture; mute works; hidden tabs pause.
- [ ] Layout works at 390px and desktop sizes; text and controls remain readable.
- [ ] No external assets, missing paths, private credentials, copyrighted art without permission or hidden payments.
- [ ] Test evidence exists. Structural Swarm acceptance alone is not a gameplay test.
- [ ] Swarm hosted the final export; the CID and manifest come from that exact job.
- [ ] The coordinating agent ran the release helper after publication, with no human CID/form step.
- [ ] A successful API response and durable private receipt exist.
- [ ] Public result says pending review unless the admin actually approved it.

Never bundle `.private`, `.env`, wallet keys, local tokens or receipts into a build. The example game is a starting point, not production-ready art. Do not market the game as on-chain gameplay: the static hosting uses IPFS/ENS; game execution and moderation are off-chain.
