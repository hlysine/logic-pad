import GridData from '../../grid';
import { Color, State } from '../../primitives';
import { Serializer } from '../../serializer/allSerializers';
import validateGrid from '../../validate';

function posToCoords(pos: number | undefined, width: number): [number, number] {
  if (pos === undefined) {
    throw new Error('pos is undefined');
  }
  return [pos % width, Math.floor(pos / width)];
}

function coordsToPos(a: [number, number], width: number) {
  return a[0] + a[1] * width;
}

function getValidGrid(
  grid: GridData,
  assumptions: number[],
  canAssump: boolean[]
): [GridData, number[], boolean] {
  while (true) {
    // Get assumption
    const newAssump = canAssump.findIndex(
      (a, i) => a && !assumptions.includes(i)
    );
    if (newAssump === -1) {
      return [grid, assumptions, true];
    }
    // Set assumption's color to dark
    const coords = posToCoords(newAssump, grid.width);
    grid = grid.setTile(coords[0], coords[1], tile =>
      tile.withColor(Color.Dark)
    );
    assumptions.push(newAssump);
    for (const a of grid.connections.getConnectedTiles({
      x: coords[0],
      y: coords[1],
    })) {
      canAssump[coordsToPos([a.x, a.y], grid.width)] =
        a.x === coords[0] && a.y === coords[1];
    }
    const state = validateGrid(grid, null);
    // If the grid is invalid, try to backtrack to a right assumption
    if (state.final === State.Error) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      [grid, assumptions] = tryToBacktrack(grid, assumptions);
      if (assumptions.length === 0) {
        return [grid, assumptions, false];
      }
    }
  }
}

function tryToBacktrack(
  grid: GridData,
  assumptions: number[]
): [GridData, number[]] {
  while (assumptions.length > 0) {
    const coords = posToCoords(assumptions.at(-1), grid.width);
    if (grid.getTile(coords[0], coords[1]).color === Color.Light) {
      grid = grid.setTile(coords[0], coords[1], tile =>
        tile.withColor(Color.Gray)
      );
      assumptions.pop();
    } else {
      grid = grid.setTile(coords[0], coords[1], tile =>
        tile.withColor(Color.Light)
      );
      const state = validateGrid(grid, null);
      if (state.final === State.Error) {
        grid = grid.setTile(coords[0], coords[1], tile =>
          tile.withColor(Color.Gray)
        );
        assumptions.pop();
      } else {
        return [grid, assumptions];
      }
    }
  }
  return [grid, assumptions];
}

function computeSolution(initialGrid: GridData): GridData {
  const canAssump: boolean[] = initialGrid.tiles
    .map(row => row.map(t => t.exists && !t.fixed))
    .flat();
  let lastValidGrid: Color[] = [];
  let assumptions: number[] = [];
  let currentGrid: GridData = initialGrid.copyWith({});
  let anyNewGrid;
  while (assumptions.length > 0 || lastValidGrid.length === 0) {
    [currentGrid, assumptions, anyNewGrid] = getValidGrid(
      currentGrid,
      assumptions,
      canAssump
    );
    console.log(
      currentGrid.tiles
        .map(row =>
          row
            .map(t => {
              const color = t.color === Color.Light ? 'w' : 'b';
              if (t.color === Color.Gray) return 'n';
              if (!t.exists) return '.';
              return t.fixed ? color.toUpperCase() : color;
            })
            .join('')
        )
        .join('\n')
    );
    if (!anyNewGrid) {
      break;
    }
    const newLastValidGrid = currentGrid.tiles
      .map(row => row.map(t => t.color))
      .flat();
    if (lastValidGrid.length !== 0) {
      const diff = newLastValidGrid.map(
        (color, i) => color === lastValidGrid[i]
      );
      diff.forEach((same, i) => {
        if (!same) {
          newLastValidGrid[i] = Color.Gray;
        }
      });
    }
    [currentGrid, assumptions] = tryToBacktrack(currentGrid, assumptions);
    lastValidGrid = newLastValidGrid;
  }
  // Create a new grid with lastValidGrid
  let solutionGrid = initialGrid.copyWith({});
  lastValidGrid.forEach((color, i) => {
    const coords = posToCoords(i, solutionGrid.width);
    solutionGrid = solutionGrid.setTile(coords[0], coords[1], tile =>
      tile.withColor(color)
    );
  });
  console.log(
    solutionGrid.tiles
      .map(row =>
        row
          .map(t => {
            const color = t.color === Color.Light ? 'w' : 'b';
            if (t.color === Color.Gray) return 'n';
            if (!t.exists) return '.';
            return t.fixed ? color.toUpperCase() : color;
          })
          .join('')
      )
      .join('\n')
  );
  return solutionGrid;
}

onmessage = e => {
  if (!e.data || typeof e.data !== 'string') return;
  const grid = Serializer.parseGrid(e.data);
  const solved = computeSolution(grid);
  postMessage(Serializer.stringifyGrid(solved));
};

// make typescript happy
// eslint-disable-next-line import/no-anonymous-default-export
export default null;
