# Logic Pad

A modern web app to create custom Logic Grid puzzles from Islands of Insight.

This is intended as an unofficial companion to Islands of Insight, allowing you to create and play custom puzzles.
It is not a replacement of the full game.
You are strongly recommended to discover the grid rules in-game before using Logic Pad.

Note that this app is still early in development and major refactors are planned.

## Developing Logic Pad

[Bun >=v1.1.0](https://bun.sh/) is required for this project.

```bash
# 1. Clone this repository
git clone https://github.com/hlysine/logic-pad.git

# 2. Restore dependencies
cd logic-pad
bun install

# 3. Run the dev server
bun dev

# You can now develop with hot module reload
```

In addition to the bundled JS code, the code editor also requires a TS type declaration file to
display documentation and type info. If you have modified anything in `src/data`, you should
regenerate the type definition with `bun build-types`
