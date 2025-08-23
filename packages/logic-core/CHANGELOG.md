# 0.13.3

- Fix crash in checksum serializer

# 0.13.1

- Trim and lower-case all strings in the checksum serializer

# 0.13.0

- Added checksum serializer and compressor

# 0.12.6

- Remove unused dependencies and update others

# 0.12.5

- Add puzzle equality check

# 0.12.4

- Add new checklist item for valid grid dimension

# 0.12.3

- Implement puzzle checklist logic

# 0.12.2

- getPuzzleTypes now only require GridData as parameter

# 0.12.1

- Expose grid with solution serialization publicly

# 0.12.0

- Removed "link" attribute from puzzle metadata
- Added helper functions for online mode

# 0.11.4

- Fixed incorrect validation on galaxy symbols (solvers are unaffected)

# 0.11.3

- Fixed out-of-bounds grid zones
- Fixed music grid track defaulting to a gray grid

# 0.11.2

- Fixed myopia not being satisfied when placed near the edge of the grid
- Fixed ban pattern rule missing some checks for reverse reflective grids

# 0.11.1

- Updated logic-pad-solver-core to 0.1.2

# 0.11.0

- Added "All light/dark area must contain this pattern" rule

# 0.10.4

- Optimized the auto solver by combining results from multiple solvers when unsupported instructions are present

# 0.10.3

- Added checks to remove out-of-bound connections/zones

# 0.10.2

- Added support for checking uniqueness in the cspuz solver
- Added the auto solver

# 0.10.1

- Fixed lotus between two tiles not checking half of the tiles

# 0.10.0

- Added the cspuz solver

# 0.9.0

- Added reversed reflection in wrap-around rule
- Breaking API change to solvers
  - The `solve` method now accept an `AbortSignal` for cancellation
  - Added new fields to solvers: `author` and `supportsCancellation`

# 0.8.0

- Added focus numbers, supported by backtrack and universal solvers
- Capitalized Minesweeper Numbers for consistency
- Fixed minesweeper and focus numbers counting tiles twice in reversed wrap-around grids

# 0.7.1

- Fixed viewpoints in wrap-around grids
- Fixed pattern detection, galaxies and lotuses when all edges are reverse-wrapped
  - Reverse-wrapping all edges simulates a real projective plane which is one-sided and cannot count the same tile twice in patterns

# 0.7.0

- Added the wrap-around rule
- Non-breaking API changes to support wrap-around rule
  - Added `GetTileHandler` (currently a stub)
  - `GridData.getTile` now converts "logical" coordinates (can be infinite) to "array" coordinates (bounded by the array size)
  - Added `GridData.toArrayCoordinates` to convert logical coordinates to array coordinates
  - Changes to iteration methods in `GridData` to support logical and array coordinates

# 0.6.1

- Fixed a bug in the universal solver causing it to miss the last tile of an underclued grid

# 0.6.0

- Rule and symbol list sanitization is now performed in `GridData.create` rather than `GridData` constructor
- Added `fastCopyWith` to skip sanitization
- Breaking change to the `GridData.setTile` method - now returns the tile array instead of a new `GridData`
- Added cancellation API to solvers
- Refactored JS solvers to use a common adapter class `EventInteratingSolver`
- Reworked and renamed the underclued solver to universal solver

# 0.5.0

- Added the lying symbols rule
- Added a new state - Ignored, to be used by the lying symbols rule and any future instructions that can negate another instructions

# 0.4.6

- Fixed the backtrack solver incorrectly reporting no solution in some grids with galaxy symbols

# 0.4.5

- Changed default velocity of music grid notes to 0.5
- Added an option to normalize note velocity by pitch
- Removed the color config from hidden symbols. Color matching is now based on the grid solution

# 0.4.4

- Added mode variants for rules and symbols
- The perfection rule now locks further input on error even if a solution is not available
- If a solution is available, you can now amend an error in perfection mode without having to undo

# 0.4.3

- Changed how cell count per zone works

# 0.4.2

- Puzzles can now have no difficulty rating (represented as difficulty = 0)

# 0.4.1

- Changed zones to be a grid attribute rather than a config of the cell count per zone rule

# 0.4.0

- Added the cell count per zone rule

# 0.3.0

- Added the perfection rule
- Added support for solve paths in the foresight rule

# 0.2.2

- Added support for dual-color galaxies and lotuses

# 0.2.1

- Added a config in Hidden symbol to reveal location

# 0.2.0

- Added Hidden symbol
- Added caches for major rules in GridData

# 0.1.6

- Fixed dart symbol again in backtrack solver

# 0.1.5

- Fixed ban pattern rule in backtrack solver
- Fixed dart symbol in backtrack solver

# 0.1.4

- Fixed myopia rule in backtrack solver

# 0.1.3

- Added package metadata
- Updated readme
- Merged into the logic-pad repository

# 0.1.0

- Initial release
