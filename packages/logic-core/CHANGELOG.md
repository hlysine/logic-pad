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
