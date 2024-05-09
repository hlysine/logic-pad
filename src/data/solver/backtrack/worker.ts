import { Color, Position } from '../../primitives';
import Instruction from '../../instruction';
import GridData from '../../grid';
import TileData from '../../tile';
import Rule from '../../rules/rule';
import Symbol from '../../symbols/symbol';
import { array } from '../../helper';
import AreaNumberSymbol, {
  instance as areaNumberInstance,
} from '../../symbols/areaNumberSymbol';
import DartSymbol, { instance as dartInstance } from '../../symbols/dartSymbol';
import ViewpointSymbol, {
  instance as viewpointInstance,
} from '../../symbols/viewpointSymbol';
import GalaxySymbol, {
  instance as galaxyInstance,
} from '../../symbols/galaxySymbol';
import LotusSymbol, {
  instance as lotusInstance,
} from '../../symbols/lotusSymbol';
import { verifyAreaNumberSymbol } from './symbols/areaNumber';
import { buildDartAdjacency, verifyDartSymbol } from './symbols/dart';
import {
  verifyGalaxySymbol,
  verifyLotusSymbol,
} from './symbols/directionLinker';
import { verifyViewpointSymbol } from './symbols/viewpoint';
import ConnectAllRule, {
  instance as connectAllInstance,
} from '../../rules/connectAllRule';
import { verifyConnectAllRule } from './rules/connectAll';

export enum BTTile {
  Empty,
  Dark,
  Light,
  Border,
}

export type BTColor = BTTile.Dark | BTTile.Light;

export class BTGridData {
  public readonly tiles: BTTile[][];
  public readonly symbols: Symbol[];
  public readonly rules: Rule[];
  public readonly width: number;
  public readonly height: number;

  public constructor(
    tiles: BTTile[][],
    symbols: Symbol[],
    rules: Rule[],
    width: number,
    height: number
  ) {
    this.tiles = tiles;
    this.symbols = symbols;
    this.rules = rules;
    this.width = width;
    this.height = height;
  }

  public getTile(x: number, y: number): BTTile {
    return this.tiles[y][x];
  }

  public isInBound(x: number, y: number) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  public getEdges(pos: Position): Position[] {
    const positions: Position[] = [];

    if (pos.x > 0) {
      if (this.getTile(pos.x - 1, pos.y) != BTTile.Border)
        positions.push({ x: pos.x - 1, y: pos.y });
    }
    if (pos.x + 1 < this.width) {
      if (this.getTile(pos.x + 1, pos.y) != BTTile.Border)
        positions.push({ x: pos.x + 1, y: pos.y });
    }
    if (pos.y > 0) {
      if (this.getTile(pos.x, pos.y - 1) != BTTile.Border)
        positions.push({ x: pos.x, y: pos.y - 1 });
    }
    if (pos.y + 1 < this.height) {
      if (this.getTile(pos.x, pos.y + 1) != BTTile.Border)
        positions.push({ x: pos.x, y: pos.y + 1 });
    }

    return positions;
  }
}

export function getOppositeColor(color: BTColor): BTColor {
  return color == BTTile.Dark ? BTTile.Light : BTTile.Dark;
}

export function colorToBTTile(color: Color): BTTile {
  if (color === Color.Gray) return BTTile.Empty;
  else if (color === Color.Light) return BTTile.Light;
  else return BTTile.Dark;
}

// This interface stores tiles that are "near" to a symbol or rule. ("near" means able to influence the result of a symbol or rule)
// For example, if the instruction is an area symbol, affected tiles will store the position of the empty tiles on the border of the symbol.
interface Adjacency {
  instruction: Instruction;
  affectedTiles: Position[];
}

export function solveAdvanced(grid: GridData): GridData | null {
  // Translate to BT data types
  const newGrid = translateToBTGridData(grid);

  // Generate adjacencies
  const adjacencies: Adjacency[] = [];

  for (const symbol of newGrid.symbols) {
    let tiles: Position[] | false;
    if (symbol.id == areaNumberInstance.id) {
      tiles = verifyAreaNumberSymbol(newGrid, symbol as AreaNumberSymbol);
      if (!tiles) return null;
    } else if (symbol.id == dartInstance.id) {
      tiles = buildDartAdjacency(newGrid, symbol as DartSymbol);
      if (!tiles) return null;
    } else if (symbol.id == viewpointInstance.id) {
      tiles = verifyViewpointSymbol(newGrid, symbol as ViewpointSymbol);
      if (!tiles) return null;
    } else if (symbol.id == galaxyInstance.id) {
      tiles = verifyGalaxySymbol(newGrid, symbol as GalaxySymbol);
      if (!tiles) return null;
    } else if (symbol.id == lotusInstance.id) {
      tiles = verifyLotusSymbol(newGrid, symbol as LotusSymbol);
      if (!tiles) return null;
    }

    if (tiles!) adjacencies.push({ instruction: symbol, affectedTiles: tiles });
  }

  // Call backtrack
  const result = backtrack(newGrid, adjacencies);
  if (!result) return null;

  return translateBackGridData(grid, newGrid);
}

function translateToBTGridData(grid: GridData): BTGridData {
  const tiles: BTTile[][] = array(grid.width, grid.height, (x, y) => {
    const tile = grid.getTile(x, y);

    if (!tile.exists) return BTTile.Border;
    else if (tile.color == Color.Dark) return BTTile.Dark;
    else if (tile.color == Color.Light) return BTTile.Light;
    else return BTTile.Empty;
  });

  const symbols: Symbol[] = [];
  grid.symbols.forEach(s => symbols.push(...s));

  const rules: Rule[] = [...grid.rules];

  return new BTGridData(tiles, symbols, rules, grid.width, grid.height);
}

function translateBackGridData(grid: GridData, btGrid: BTGridData): GridData {
  let tiles: TileData[][] = [];
  for (let y = 0; y < grid.height; y++) {
    tiles[y] = [];
    for (let x = 0; x < grid.width; x++) {
      const origTile = grid.getTile(x, y);

      if (!origTile.exists) tiles[y][x] = TileData.doesNotExist();
      else if (origTile.fixed || origTile.color != Color.Gray)
        tiles[y][x] = origTile;
      else
        tiles[y][x] = new TileData(
          true,
          false,
          btGrid.getTile(x, y) == BTTile.Dark ? Color.Dark : Color.Light
        );
    }
  }

  return grid.withTiles(tiles);
}

function buildAdjacencyGrid(
  grid: BTGridData,
  adjList: Adjacency[]
): (Adjacency[] | null)[][] {
  let adjGrid: (Adjacency[] | null)[][] = [];

  // Initialize the map
  for (let y = 0; y < grid.height; y++) {
    adjGrid[y] = [];
    for (let x = 0; x < grid.width; x++) {
      adjGrid[y][x] = null;
    }
  }

  for (const adj of adjList) {
    for (const pos of adj.affectedTiles) {
      const tile = grid.getTile(pos.x, pos.y);

      if (tile != BTTile.Empty) continue;

      if (!adjGrid[pos.y][pos.x]) adjGrid[pos.y][pos.x] = [];
      adjGrid[pos.y][pos.x]!.push(adj);
    }
  }

  return adjGrid;
}

function isValid(
  grid: BTGridData,
  adjGrid: (Adjacency[] | null)[][],
  placed: Position,
  originalAdj: [Adjacency, Position[]][]
): boolean {
  // Loop through all symbols & rules that are "near" to this cell
  // For most constraints, only cells that are "near" can make the constraint invalid, so only those cells should be checked

  if (adjGrid[placed.y][placed.x]) {
    for (const adj of adjGrid[placed.y][placed.x]!) {
      let result: Position[] | false;

      if (adj.instruction.id == areaNumberInstance.id) {
        result = verifyAreaNumberSymbol(
          grid,
          adj.instruction as AreaNumberSymbol
        );
      } else if (adj.instruction.id == dartInstance.id) {
        //     // For dart, we don't need to rebuild adjacency
        result = verifyDartSymbol(grid, adj.instruction as DartSymbol)
          ? adj.affectedTiles
          : false;
      } else if (adj.instruction.id == viewpointInstance.id) {
        result = verifyViewpointSymbol(
          grid,
          adj.instruction as ViewpointSymbol
        );
      } else if (adj.instruction.id == galaxyInstance.id) {
        result = verifyGalaxySymbol(grid, adj.instruction as GalaxySymbol);
      } else if (adj.instruction.id == lotusInstance.id) {
        result = verifyLotusSymbol(grid, adj.instruction as LotusSymbol);
      }

      if (!result!) return false;

      // Save affected cells
      originalAdj.push([adj, adj.affectedTiles]);
      // Update adjacency
      adj.affectedTiles = result;
    }
  }

  // Area symbol special case
  for (const symbol of grid.symbols) {
    // Opposite color case
    // A cell can potentially invalidate an area symbol even if the cell is not "near" to the symbol
    // TODO: Duplicated area check
    if (
      symbol.id == areaNumberInstance.id &&
      !verifyAreaNumberSymbol(grid, symbol as AreaNumberSymbol)
    )
      return false;
  }

  for (const rule of grid.rules) {
    if (
      rule.id == connectAllInstance.id &&
      !verifyConnectAllRule(grid, rule as ConnectAllRule)
    )
      return false;
  }

  return true;
}

function naiveNextTile(grid: BTGridData): Position | null {
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.getTile(x, y) == BTTile.Empty) return { x, y };
    }
  }
  return null;
}

// This function chooses the next empty tile to search.
// The logic is that cells that are more "near" to symbols and rules should be searched first (more constrained).
// This help reduces the search space.
function advancedNextTile(
  grid: BTGridData,
  adjGrid: (Adjacency[] | null)[][]
): Position | null {
  // Find the cell with the most constraints in the lookup
  let highest: number = 0;
  let pos: Position | null = null;
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (!adjGrid[y][x]) continue;

      if (adjGrid[y][x]!.length > highest) {
        highest = adjGrid[y][x]!.length;
        pos = { x, y };
      }
    }
  }
  if (pos) return pos;

  // Fallback to naive next tile
  return naiveNextTile(grid);
}

// Reverse all adjacency changes made.
function reverseAdjChange(originalAdj: [Adjacency, Position[]][]) {
  for (const [adj, affectedTiles] of originalAdj) {
    adj.affectedTiles = affectedTiles;
  }
}

function backtrack(grid: BTGridData, adjacencies: Adjacency[]): boolean {
  // Build an adjacency lookup grid
  // TODO: Do not build this lookup grid on every backtrack
  const adjGrid = buildAdjacencyGrid(grid, adjacencies);

  // Find the first empty cell
  let pos = advancedNextTile(grid, adjGrid);
  if (!pos) return true;

  // TODO: Use a better method to determine the order

  {
    grid.tiles[pos.y][pos.x] = BTTile.Light;

    // Guess
    const originalAdj: [Adjacency, Position[]][] = [];
    if (
      isValid(grid, adjGrid, pos, originalAdj) &&
      backtrack(grid, adjacencies)
    )
      return true;

    // Reverse adjacency changes
    reverseAdjChange(originalAdj);
  }

  {
    grid.tiles[pos.y][pos.x] = BTTile.Dark;

    // Guess
    const originalAdj: [Adjacency, Position[]][] = [];
    if (
      isValid(grid, adjGrid, pos, originalAdj) &&
      backtrack(grid, adjacencies)
    )
      return true;

    // Reverse adjacency changes
    reverseAdjChange(originalAdj);
  }

  // If both fail, returns to initial state
  grid.tiles[pos.y][pos.x] = BTTile.Empty;
  return false;
}

interface PossibleState {
  dark: boolean;
  light: boolean;
}

export function solveUnderclued(input: GridData): GridData | null {
  let grid = input;
  let count = 0;

  const possibles: PossibleState[][] = array(grid.width, grid.height, () => ({
    dark: false,
    light: false,
  }));

  function search(x: number, y: number, tile: TileData, color: Color): boolean {
    const newGrid = grid.setTile(x, y, tile.withColor(color));

    // Solve
    const solution = solveAdvanced(newGrid);
    count++;

    // Update the new possible states
    if (solution) {
      solution.forEach((solTile, solX, solY) => {
        if (solTile.color === Color.Dark) {
          possibles[solY][solX].dark = true;
        } else {
          possibles[solY][solX].light = true;
        }
      });
    }

    return solution !== null;
  }

  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const tile = grid.getTile(x, y);

      if (!tile.exists || tile.color !== Color.Gray) continue;

      console.log(`Trying (${x}, ${y})`);

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
