# 28/1/2025

- Puzzles without a difficulty rating now display a question mark
- Added `hihat-open` note for music grids

# 27/1/2025

- Added the perfection mode in which all cell colors are final (accessible in the `/perfection` page)
- Enhanced the foresight rule to consider solve paths
- Added cell count per zone rule
- Changed zones internally to be a grid attribute

# 26/1/2025

- Added small variance in music grid playback to hopefully make chords more prominent
- Mute individual tiles when the whole music grid is playing
- Added a small fix for load errors during future deployments
- Site updates now preserve your current puzzle (but still reset the solve progress)

# 25/1/2025

- Added drum samples (kick, snare, hihat, crash, tom, rim) to music grids
- Fixed symbol colors on hidden tiles
- Added a config in the Hidden symbol to reveal location
- Added support for dual-color galaxies and lotuses

# 24/1/2025

- Added the Hidden symbol which hides other symbols until the tile is colored correctly
- Fixed a bug causing the exit confirmation setting to be ignored
- You can no longer have more than one off-by-X or foresight rules

# 23/1/2025

- Settings rework: toggles now live in a settings dialog which you can open from the quick access bar on the top right corner
- Added a setting to disable exit confirmation
- Added a setting to invert primary colors by default

# 20/1/2025

- Fixed text overflow in puzzle description

# 12/1/2025

- Fixed ban pattern rule in the backtrack solver
- Fixed dart symbol in backtrack solver

# 10/1/2025

- Fixed myopia rule in the backtrack solver
- Include the API of Logic Pad in the same repo using a monorepo setup

# 5/1/2025

- Moved the core API of Logic Pad to a separate package at https://github.com/hlysine/logic-core

# 3/1/2025

- Allow the grid to be resized by gestures/ctrl+scroll wheel

# 26/8/2024

- Fixed the theme switcher not highlighting the current theme

# 4/7/2024

- Added a toggle in myopia arrows to check diagonals
- Added a small padding between instructions

# 19/6/2024

- Reworked hotkeys again to avoid clashing with undo/reset

# 18/6/2024

- Added the ability to reorder rules
- Changed the control scheme of the merge tool to work on mobile
- Split resize tool into row and column variants
- Reworked hotkeys for tools

# 24/5/2024

- Scaffolding for backend
- Logic Pad is now accessible at <logic-pad.com>

# 22/5/2024

- Internal rework of the code generation mechanism
- All solvers now ignore rules that do not affect the solution
- Disallowed grid of negative size

# 21/5/2024

- Fixed myopia arrows not treating empty tiles appropriately
- Massive restructure of codebase to prepare for backend code
- Fixed bogus tile count when a viewpoint is on a gray tile

# 20/5/2024

- Enhanced support for Markdown in puzzle description
- Added support for `||spoilers||` which can be revealed by solving the puzzle
- You can now count gray tiles by holding `ctrl`
- Added a button to reset the site in case of bugs
- Fixed myopia arrows sometimes turning green when incomplete
- Fixed tile count overlay to support older browsers

# 19/5/2024

- Optimized site loading and enabled installation as PWA app
- Added support for Safari 16
- Fixed the backtrack solver to work with new options in symbols per area rule
- Added a new curated puzzle

# 18/5/2024

- Fixed incorrect rendering of the thumbnail grid of ban pattern rule
- Added "at least/at most" options to symbols per area rule
- Added a confirmation message when leaving the puzzle editor
- Clicking the site icon now brings you back to the front page
- Fixed front page colors in different themes
- Added more curated puzzles
- Added changelog

# 17/5/2024

- Added front page
- You can now use Markdown in puzzle description
- Improved the backtrack solver to support more rules and symbols (ALaggyDev)
- The underclued solver now reports a solution as unique if it fills the grid completely
- Added optional checkpoints in music grids
- Fixed several bugs related to music grid playback

# 16/5/2024

- Added foresight rule for optional hints
- Display all rules by default in the rule search box
- Fixed symbol colors when the underlying tile does not exist
- Added the resize tool
- Several QoL improvements in the puzzle editor
