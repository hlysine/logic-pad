import { Lemma, makeBasicRequirementFunction } from '../lemmaUtils.js';
import AreaNumberSymbol from '../../../symbols/areaNumberSymbol.js';
import OffByXRule from '../../../rules/offByXRule.js';
import { Color, State } from '../../../primitives.js';
import GridData from '../../../grid.js';

const areaNumberInstance = new AreaNumberSymbol(0, 0, 0);

function getUnsatisfiedGrayAreaNumberSymbols(
  grid: GridData
): AreaNumberSymbol[] {
  return (grid.symbols.get(areaNumberInstance.id) as AreaNumberSymbol[]).filter(
    symbol =>
      symbol.validateSymbol(grid) !== State.Satisfied &&
      grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y)).color ===
        Color.Gray
  );
}

export const AreaNumberImpossibleSymbolColor: Lemma = {
  id: 'AreaNumberImpossibleSymbolColor',
  apply: (grid: GridData) => {
    // Find the first area number symbol which is not satisfied and has exactly the right number of tiles
    const unsatisfiedGrayAreaNumberSymbol: AreaNumberSymbol[] =
      getUnsatisfiedGrayAreaNumberSymbols(grid);
    let areaNumberSymbol: AreaNumberSymbol | undefined;
    const checks = [false, false];
    let tmpGrid1, tmpGrid2: GridData;
    for (const symbol of unsatisfiedGrayAreaNumberSymbol) {
      tmpGrid1 = grid.fastCopyWith({
        tiles: grid.setTile(
          Math.floor(symbol.x),
          Math.floor(symbol.y),
          grid
            .getTile(Math.floor(symbol.x), Math.floor(symbol.y))
            .withColor(Color.Dark)
        ),
      });
      checks[0] = symbol.countTiles(tmpGrid1).possible >= symbol.number;
      tmpGrid2 = grid.fastCopyWith({
        tiles: grid.setTile(
          Math.floor(symbol.x),
          Math.floor(symbol.y),
          grid
            .getTile(Math.floor(symbol.x), Math.floor(symbol.y))
            .withColor(Color.Light)
        ),
      });
      checks[1] = symbol.countTiles(tmpGrid2).possible >= symbol.number;
      // If only one of the two colors is possible, take it
      if (checks[0] !== checks[1]) {
        areaNumberSymbol = symbol;
        break;
      }
    }
    if (!areaNumberSymbol) return [false, grid]; // No symbol found
    return [true, (checks[0] ? tmpGrid1 : tmpGrid2!)!];
  },
  score: 3,
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
