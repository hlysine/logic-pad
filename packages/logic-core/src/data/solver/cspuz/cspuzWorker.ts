import { solveLogicPad } from 'logic-pad-solver-core';
import { Serializer } from '../../serializer/allSerializers.js';
import { gridToJson } from './jsonify.js';
import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import { Color } from '../../primitives.js';

function stringToColor(str: 'dark' | 'light' | null): Color {
  if (str === 'dark') {
    return Color.Dark;
  } else if (str === 'light') {
    return Color.Light;
  } else {
    return Color.Gray;
  }
}

onmessage = e => {
  const grid = Serializer.parseGrid(e.data as string);

  const puzzleData = gridToJson(grid);

  const solverResult = solveLogicPad(
    puzzleData,
    !!grid.findRule(r => r.id === undercluedInstance.id)
  );

  if (solverResult === null) {
    postMessage(null);
  } else if ('error' in solverResult) {
    throw new Error(solverResult.error);
  } else {
    const solution = grid.withTiles(tiles => {
      for (const [y, row] of solverResult.entries()) {
        for (const [x, color] of row.entries()) {
          tiles[y][x] = tiles[y][x].withColor(stringToColor(color));
        }
      }
      return tiles;
    });
    if (solution.resetTiles().colorEquals(solution)) {
      postMessage(null);
    } else {
      postMessage(Serializer.stringifyGrid(solution));
    }
  }

  postMessage(undefined);
};

export {};
