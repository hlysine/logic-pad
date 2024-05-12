import { Color, Position } from '../../primitives';
import GridData from '../../grid';
import TileData from '../../tile';
import { array } from '../../helper';
import AreaNumberSymbol, {
  instance as areaNumberInstance,
} from '../../symbols/areaNumberSymbol';
import DartSymbol, { instance as dartInstance } from '../../symbols/dartSymbol';
import ViewpointSymbol, {
  instance as viewpointInstance,
} from '../../symbols/viewpointSymbol';
import { instance as galaxyInstance } from '../../symbols/galaxySymbol';
import { instance as lotusInstance } from '../../symbols/lotusSymbol';
import { instance as undercluedInstance } from '../../rules/undercluedRule';
import ConnectAllRule from '../../rules/connectAllRule';
import BTModule, { BTGridData, BTTile, IntArray2D, Rating } from './data';
import AreaNumberBTModule from './symbols/areaNumber';
import DirectionLinkerBTModule from './symbols/directionLinker';
import DirectionLinkerSymbol from '../../symbols/directionLinkerSymbol';
import DartBTModule from './symbols/dart';
import ViewpointBTModule from './symbols/viewpoint';
import { instance as connectAllInstance } from '../z3/modules/connectAllModule';
import ConnectAllBTModule from './rules/connectAll';
import BanPatternRule, {
  instance as banPatternInstance,
} from '../../rules/banPatternRule';
import BanPatternBTModule from './rules/banPattern';
import RegionAreaBTModule from './rules/regionArea';
import RegionAreaRule, {
  instance as regionAreaInstance,
} from '../../rules/regionAreaRule';
import MyopiaSymbol, {
  instance as myopiaInstance,
} from '../../symbols/myopiaSymbol';
import MyopiaBTModule from './symbols/myopia';
import { Serializer } from '../../serializer/allSerializers';

function translateToBTGridData(grid: GridData): BTGridData {
  const tiles: BTTile[][] = array(grid.width, grid.height, (x, y) => {
    const tile = grid.getTile(x, y);

    if (!tile.exists) return BTTile.NonExist;
    else if (tile.color === Color.Dark) return BTTile.Dark;
    else if (tile.color === Color.Light) return BTTile.Light;
    else return BTTile.Empty;
  });

  const connections: Position[][][] = array(
    grid.width,
    grid.height,
    (x, y) => grid.connections.getConnectedTiles({ x, y }) as Position[]
  );

  const modules: BTModule[] = [];

  for (const [id, symbolList] of grid.symbols) {
    for (const symbol of symbolList) {
      let module: BTModule | undefined;
      if (id === areaNumberInstance.id) {
        module = new AreaNumberBTModule(symbol as AreaNumberSymbol);
      } else if (id === dartInstance.id) {
        module = new DartBTModule(symbol as DartSymbol);
      } else if (id === viewpointInstance.id) {
        module = new ViewpointBTModule(symbol as ViewpointSymbol);
      } else if (id === galaxyInstance.id || id === lotusInstance.id) {
        module = new DirectionLinkerBTModule(symbol as DirectionLinkerSymbol);
      } else if (id === myopiaInstance.id) {
        module = new MyopiaBTModule(symbol as MyopiaSymbol);
      }

      if (!module) throw new Error('Symbol not supported.');

      modules.push(module);
    }
  }

  for (const rule of grid.rules) {
    let module: BTModule | undefined;
    if (rule.id === connectAllInstance.id) {
      module = new ConnectAllBTModule(rule as ConnectAllRule);
    } else if (rule.id === regionAreaInstance.id) {
      module = new RegionAreaBTModule(rule as RegionAreaRule);
    } else if (rule.id === banPatternInstance.id) {
      module = new BanPatternBTModule(rule as BanPatternRule);
    } else if (rule.id === undercluedInstance.id) {
      continue;
    }

    if (!module) throw new Error('Rule not supported.');

    modules.push(module);
  }

  return new BTGridData(tiles, connections, modules, grid.width, grid.height);
}

function translateBackGridData(grid: GridData, btGrid: BTGridData): GridData {
  const tiles: TileData[][] = array(grid.width, grid.height, (x, y) => {
    const origTile = grid.getTile(x, y);

    if (!origTile.exists || origTile.fixed || origTile.color !== Color.Gray)
      return origTile;
    else
      return origTile.withColor(
        btGrid.getTile(x, y) === BTTile.Dark ? Color.Dark : Color.Light
      );
  });

  return grid.withTiles(tiles);
}

function isValid(
  grid: BTGridData,
  places: Position[],
  checkable: (IntArray2D | null)[],
  ratings: (Rating[] | null)[]
): [(IntArray2D | null)[], (Rating[] | null)[]] | false {
  const newCheckable: (IntArray2D | null)[] = [...checkable];
  const newRatings: (Rating[] | null)[] = [...ratings];

  for (let i = 0; i < grid.modules.length; i++) {
    const module = grid.modules[i];

    // Check if skippable
    if (checkable[i] && !places.some(pos => checkable[i]!.get(pos.x, pos.y)))
      continue;

    const result = module.checkLocal(grid, places);
    if (!result) return false;

    // If returns true, it means do not change checkable and ratings
    if (result === true) continue;

    newCheckable[i] = result.tilesNeedCheck;
    newRatings[i] = result.ratings;
  }

  return [newCheckable, newRatings];
}

// This function chooses the next empty tile to search.
function getNextTile(
  grid: BTGridData,
  ratings: (Rating[] | null)[]
): Position | null {
  const scores: number[][] = [];

  // TODO: Sum up all the scores of connected tiles without overcounting

  for (let y = 0; y < grid.height; y++) {
    scores[y] = [];
    for (let x = 0; x < grid.width; x++) {
      scores[y][x] = 0;
    }
  }

  for (const rating of ratings) {
    if (!rating) continue;
    for (const score of rating) {
      scores[score.pos.y][score.pos.x] += score.score;
    }
  }

  let highest = 0;
  let pos: Position | null = null;
  let fallback: Position | null = null;

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.getTile(x, y) !== BTTile.Empty) continue;
      if (scores[y][x] > highest) {
        highest = scores[y][x];
        pos = { x, y };
      }

      if (!fallback) fallback = { x, y };
    }
  }

  return pos ?? fallback;
}

function backtrack(
  grid: BTGridData,
  checkable: (IntArray2D | null)[],
  ratings: (Rating[] | null)[],
  solutionFn: (grid: BTGridData) => boolean
): boolean {
  // Find the best empty cell to guess
  const pos = getNextTile(grid, ratings);

  // Found a solution
  if (!pos) return !solutionFn(grid.clone());

  // TODO: Use a better method to determine the order

  {
    grid.setTileWithConnection(pos.x, pos.y, BTTile.Light);

    const places = grid.connections[pos.y][pos.x];
    const result = isValid(grid, places, checkable, ratings);

    if (result && backtrack(grid, result[0], result[1], solutionFn))
      return true;
  }

  {
    grid.setTileWithConnection(pos.x, pos.y, BTTile.Dark);

    const places = grid.connections[pos.y][pos.x];
    const result = isValid(grid, places, checkable, ratings);

    if (result && backtrack(grid, result[0], result[1], solutionFn))
      return true;
  }

  // If both fail, returns to initial state
  grid.setTileWithConnection(pos.x, pos.y, BTTile.Empty);
  return false;
}

function solveNormal(input: GridData, solutionFn: (grid: GridData) => boolean) {
  // Translate to BT data types
  const grid = translateToBTGridData(input);

  const checkable: (IntArray2D | null)[] = [];
  const ratings: (Rating[] | null)[] = [];

  for (const module of grid.modules) {
    const res = module.checkGlobal(grid);
    if (!res) return [];

    checkable.push(res.tilesNeedCheck);
    ratings.push(res.ratings);
  }

  // Call backtrack
  backtrack(grid, checkable, ratings, sol =>
    solutionFn(translateBackGridData(input, sol))
  );
}

function solveUnderclued(input: GridData): GridData | null {
  interface PossibleState {
    dark: boolean;
    light: boolean;
  }

  let grid = input;
  let count = 0;

  const possibles: PossibleState[][] = array(grid.width, grid.height, () => ({
    dark: false,
    light: false,
  }));

  function search(x: number, y: number, tile: TileData, color: Color): boolean {
    count++;

    // console.log(`Trying (${x}, ${y}) with ${color}`);

    const newGrid = grid.setTile(x, y, tile.withColor(color));

    // Solve
    let solution: GridData | undefined;
    solveNormal(newGrid, sol => {
      solution = sol;
      return false;
    });

    if (!solution) return false;

    // Update the new possible states
    solution.forEach((solTile, solX, solY) => {
      if (solTile.color === Color.Dark) {
        possibles[solY][solX].dark = true;
      } else {
        possibles[solY][solX].light = true;
      }
    });

    return true;
  }

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const tile = grid.getTile(x, y);

      if (!tile.exists || tile.color !== Color.Gray) continue;

      // We can skip this solve if it is proved to be solvable
      const darkPossible =
        possibles[y][x].dark || search(x, y, tile, Color.Dark);
      const lightPossible =
        possibles[y][x].light || search(x, y, tile, Color.Light);

      // No solution
      if (!darkPossible && !lightPossible) return null;

      if (darkPossible && !lightPossible)
        grid = grid.setTile(x, y, tile.withColor(Color.Dark));
      if (!darkPossible && lightPossible)
        grid = grid.setTile(x, y, tile.withColor(Color.Light));
    }
  }

  console.log(`Solve count: ${count}`);

  return grid;
}

function solve(grid: GridData, solutionFn: (grid: GridData) => boolean) {
  if (grid.findRule(rule => rule.id === undercluedInstance.id)) {
    const res = solveUnderclued(grid);
    if (res) solutionFn(res);
  } else {
    solveNormal(grid, solutionFn);
  }
}

onmessage = e => {
  const grid = Serializer.parseGrid(e.data as string);

  console.time('Solve time');

  let count = 0;

  solve(grid, solution => {
    if (count === 0) console.timeLog('Solve time', 'First solution');

    postMessage(Serializer.stringifyGrid(solution));

    count += 1;
    return count < 2;
  });

  console.timeEnd('Solve time');

  postMessage(null);
};

// make typescript happy
// eslint-disable-next-line import/no-anonymous-default-export
export default null;
