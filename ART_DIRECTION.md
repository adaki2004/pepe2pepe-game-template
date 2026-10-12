# A game with its own visual identity

This guide applies to browser, contract and verified arcade builds. Respect the human's art direction first. Different art does not authorize changes to verified reward mechanics.

## Pick a direction, not a template

Before building, write a three-line art decision: the player fantasy, the visual medium, and one memorable motif from the actual game. Choose a suitable direction such as woodcut adventure, warm miniature diorama, ink-and-paper tactics, sun-bleached rally poster, underwater photographic collage or precise monochrome vector arcade. These are prompts, not a required style menu. Avoid making every brief a purple neon frog on a generic sci-fi dashboard.

Use intentional silhouette, negative space, scale and a limited palette. Menus and HUD should belong to the game's world. Draw from original or licensed assets and document provenance. Do not copy other games' copyrighted characters or covers.

## The cover is a small game poster

Deliver one original landscape cover, ideally 1200×630, showing a recognisable action, place or mechanic from the finished game. A well-composed gameplay capture with deliberate typography is welcome. Do not use a generic frog portrait, logo on a gradient, floating dashboard tiles or unrelated generated scenery. Do not bake EXAMPLE, FREE, TOKEN, prices or platform UI badges into the image; the host adds them.

Sketch two different compositions, choose the stronger one, and inspect it at 240px wide and on a phone. Keep a strong focal point and optional short readable title; no tiny subtitles. Check that the art honestly matches the playable release. Include the decision and a thumbnail in the committed validation notes. Do not claim to have generated art if you only drew placeholder geometry.

## Optional tools, not mandatory dependencies

- [PixiJS](https://pixijs.com/): expressive 2D rendering, sprites and effects.
- [Three.js](https://threejs.org/): small 3D worlds and miniature dioramas.
- Canvas, SVG or DOM: crisp illustrated games when a small custom renderer fits.

Choose one stack that serves the idea; a library is not an art direction. Read current official docs, pin versions, bundle locally, avoid external runtime CDNs. Keep text readable, motion optional, touch targets usable and audio gesture-gated. Verify actual frame pacing on desktop and a narrow touch viewport. Report actual compressed download and extracted asset sizes separately; follow the publishing service's advertised limits and never silently drop assets or evidence to fit.
