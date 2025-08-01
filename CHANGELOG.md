# 30/7/2025

- Fixed incorrect validation on galaxy symbols (solvers are unaffected)

# 8/6/2025

- Fixed playback line position in music grids where the playback track and the grid have different BPM
- Fixed out-of-bounds grid zones
- Fixed music grid track defaulting to a gray grid

# 30/4/2025

- Fixed myopia not being satisfied when placed near the edge of the grid
- Fixed ban pattern rule missing some checks for reverse reflective grids

# 14/4/2025

- Excluded the wrap-around rule from the auto solver's optimization

# 30/3/2025

- Updated the cspuz solver to fix lotuses/galaxies

# 28/3/2025

- Optimized the auto solver by combining results from multiple solvers when unsupported instructions are present
- Added "All light/dark area must contain this pattern" rule

# 21/3/2025

- Removed top nav bar shadow

# 20/3/2025

- Improved the accuracy of drag-and-drop animations in the editor's rule list
- Color adjustments
  - Light theme no longer has a dark background
  - Dark theme now has a slightly brighter background to contrast with dark tiles
  - Aqua theme now uses white text for contrast

# 12/3/2025

- Added the auto solver - automatically selects the fastest solver based on environment and grid support
- Added support for uniqueness checking in the cspuz solver
- Out-of-bounds grid connections/zones are no longer allowed

# 11/3/2025

- Added the cspuz solver - WebAssembly based CSP reduction solver with incredible performance
- Fixed lotuses between two tiles missing certain checks

# 8/3/2025

- Added support for reversed reflection in the wrap-around rule
- Small solver improvements
  - All solvers now report "No solution" if no tiles are filled in an underclued grid
  - Display author name of solvers
  - Internal API change to the cancellation mechanism

# 28/2/2025

- Fixed browser zoom and device pixel ratio affecting the generated puzzle image

# 27/2/2025

- Fixed minesweeper and focus numbers counting tiles twice in reversed wrap-around grids
- Capitalized Minesweeper Numbers for consistency
- Fixed a crash due to the tile count overlay activating while the grid is rendering

# 26/2/2025

- Cut the number of samples loaded by music grids to reduce memory usage
- Improved dragging behavior: tiles of opposite color will only be replaced if you stared dragging from a tile of opposite color

# 25/2/2025

- Added **Focus Numbers**, supported by backtrack and universal solvers
- Non-standard tools are now hidden behind a toggle by default
- Redesigned the minesweeper symbol
- Moved the zone tool to last and reworked keybinds

# 24/2/2025

- Rework site settings to mostly be applied instantly
  - **Note: all site settings are reset**
- Moved wrap-around visualization toggle to site settings

# 23/2/2025

- Added a toggle to turn off wrap-around visualizations
- Fixed viewpoints in wrap-around grids
- Fixed padding in a grid-only puzzle image
- Fixed the code editor being cut off on large screens

# 22/2/2025

- You can now color the semi-transparent tiles directly in wrap-around rule
- Improved the hitbox of merge and zone tools in the editor
- Fixed pattern detection, galaxies and lotuses when all edges are reverse-wrapped

# 21/2/2025

- Fixed validation of lotuses and galaxies in wrap-around grids
- Added a new option in image sharing - grid only
- Fixed wrap-around rule in 0-size grids

# 20/2/2025

- Added the wrap-around rule

# 18/2/2025

- Puzzle images now use full-sized cards if there are not a lot of instructions
- Fixed a scrolling bug in puzzle image box

# 17/2/2025

- Fixed transforms not working in puzzle image renderer
- You can now choose whether to share your current progress or a fresh render of the puzzle

# 16/2/2025

- Added a button to share puzzle screenshot in solve mode
- Fixed a bug in the universal solver causing it to miss the last tile of an underclued grid

# 15/2/2025

- Changed grid editor modals to be fullscreen for mobile-friendliness
- Fixed various z-order issues
- Fixed cell boundaries not being visible on grids with very small tile size

# 14/2/2025

- Enhanced support for smaller screens
  - Tweaked the rendering of merged given tiles to increase visibility
  - Scaled up the color toggle
  - Collapsed the left editor pane
  - Scaled down the instruction cards and added a dense layout
  - Scaled down elements of the header bar
  - Scaled down puzzle metadata
  - Added an intermediate layout designed for tablets
- Refactored solve controls so that the cancel button is in a more sensible place when looking for alternate solutions

# 13/2/2025

- Reworked the underclued solver to behave like backtrack solver but with universal rules and symbols support
- Renamed underclued solver to universal solver
- Added a button to cancel the current solve attempt
- Optimized grid data copying for the universal solver
- Changed the thumbnail grid of the lying symbols rule
- Fixed an error related to myopia being a lying symbol

# 11/2/2025

- Added the lying symbols rule

# 9/2/2025

- Fixed the backtrack solver incorrectly reporting no solution in some grids with galaxy symbols

# 8/2/2025

- Fixed underclued tile count in perfection mode

# 6/2/2025

- Sanitize patterns in "Don't make this pattern" rules to avoid removed cells

# 1/2/2025

- Hidden tiles now match tile colors against grid solution directly

# 31/1/2025

- Changed default velocity of music grid notes to 0.5
- Note velocity is now normalized by pitch by default
- You can now copy a link that displays the solution for further editing

# 30/1/2025

- You can no longer undo a grid reset in perfection mode
- Added hotkey indications for various buttons
- Fixed "copy solve path" button not working for underclued grids
- Added a button to reset solver
- Disabled fancy animations in the editor
- Drum sample volume can now be controlled with the velocity field

# 29/1/2025

- Changed how cell count per zone works
- The perfection rule now locks further input on error even if a solution is not available
- The perfection rule is now searchable in the editor
- Undo/redo hotkeys are now usable in editor modal boxes
- Fixed site update leading to blank pages in some instances
- Fixed broken images when offline
- If a solution is available, you can now amend an error in perfection mode without having to undo

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
