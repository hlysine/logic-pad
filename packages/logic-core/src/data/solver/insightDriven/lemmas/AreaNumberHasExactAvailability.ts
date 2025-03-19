import { Lemma, makeBasicRequirementFunction } from '../LemmaUtils.js';
import AreaNumberSymbol from '../../../symbols/areaNumberSymbol.js';
import OffByXRule from '../../../rules/offByXRule.js';
import { Color, State } from '../../../primitives.js';
import GridData from '../../../grid.js';

const areaNumberInstance = new AreaNumberSymbol(0, 0, 0);

function getUnsatisfiedAreaNumberSymbols(grid: GridData): AreaNumberSymbol[] {
  return (grid.symbols.get(areaNumberInstance.id) as AreaNumberSymbol[]).filter(
    symbol => symbol.validateSymbol(grid) !== State.Satisfied
  );
}

export const AreaNumberHasExactAvailability: Lemma = {
  id: 'AreaNumberHasExactAvailability',
  apply: (grid: GridData) => {
    // Find the first area number symbol which is not satisfied and has exactly the right number of tiles
    const unsatisfiedAreaNumberSymbol: AreaNumberSymbol[] =
      getUnsatisfiedAreaNumberSymbols(grid);
    const areaNumberSymbol: AreaNumberSymbol = unsatisfiedAreaNumberSymbol.find(
      symbol => symbol.countTiles(grid).possible === symbol.number
    )!;
    if (!areaNumberSymbol) return [false, grid]; // No symbol found
    // Surround the empty tiles around the area number region using the opposite color
    const thisX = Math.floor(areaNumberSymbol.x);
    const thisY = Math.floor(areaNumberSymbol.y);
    const color = grid.getTile(thisX, thisY).color;
    // Fill the empty tiles around the region
    grid.iterateArea(
      { x: thisX, y: thisY },
      tile => tile.color === Color.Gray || tile.color === color,
      (tile, x, y) => {
        grid = grid.fastCopyWith({
          tiles: grid.setTile(x, y, tile.withColor(color)),
        });
      }
    );
    return [true, grid];
  },
  score: 2,
  requirements: makeBasicRequirementFunction([
    {
      instruction: areaNumberInstance,
      presence: true,
    },
    {
      instruction: new OffByXRule(0),
      presence: false,
    },
  ]),
};
