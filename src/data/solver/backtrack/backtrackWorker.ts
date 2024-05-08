import GridData from '../../grid';
import { State, Color } from '../../primitives';
import { Serializer } from '../../serializer/allSerializers';
import TileData from '../../tile';
import validateGrid from '../../validate';

// Check if the grid is valid
function isValid(grid: GridData): boolean {
  return validateGrid(grid, null).final !== State.Error;
}

// Chooses the next empty cell to search
function nextCell(grid: GridData): { x: number; y: number } | null {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const tile = grid.getTile(x, y);
      if (tile.exists && tile.color === Color.Gray) return { x, y };
    }
  }
  return null;
}

// Actual backtracking
function backtrack(grid: GridData, solutions: GridData[]): boolean {
  if (!isValid(grid)) return false;

  // Find the first empty cell
  const pos = nextCell(grid);
  if (!pos) {
    // Solution found
    solutions.push(grid);
    return solutions.length >= 2;
  }

  // TODO: Use a better method to determine the order

  {
    const newGrid = grid.setTile(
      pos.x,
      pos.y,
      new TileData(true, false, Color.Light)
    );
    const res = backtrack(newGrid, solutions);
    if (res) return res;
  }

  {
    const newGrid = grid.setTile(
      pos.x,
      pos.y,
      new TileData(true, false, Color.Dark)
    );
    const res = backtrack(newGrid, solutions);
    if (res) return res;
  }

  return false;
}

onmessage = e => {
  const grid = Serializer.parseGrid(e.data as string);

  console.time('Solve time');

  const solutions: GridData[] = [];
  backtrack(grid, solutions);

  console.timeEnd('Solve time');

  postMessage(solutions.map(grid => Serializer.stringifyGrid(grid)));
};

// make typescript happy
// eslint-disable-next-line import/no-anonymous-default-export
export default null;
