import { instance as banPatternInstance } from '../../rules/banPatternRule.js';
import { instance as cellCountInstance } from '../../rules/cellCountRule.js';
import { instance as regionAreaInstance } from '../../rules/regionAreaRule.js';
import { instance as sameShapeInstance } from '../../rules/sameShapeRule.js';
import { instance as symbolsPerRegionInstance } from '../../rules/symbolsPerRegionRule.js';
import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import { instance as uniqueShapeInstance } from '../../rules/uniqueShapeRule.js';
import { instance as offByXInstance } from '../../rules/offByXRule.js';
import { instance as areaNumberInstance } from '../../symbols/areaNumberSymbol.js';
import { instance as dartInstance } from '../../symbols/dartSymbol.js';
import GalaxySymbol, {
  instance as galaxyInstance,
} from '../../symbols/galaxySymbol.js';
import { instance as letterInstance } from '../../symbols/letterSymbol.js';
import LotusSymbol, {
  instance as lotusInstance,
} from '../../symbols/lotusSymbol.js';
import { instance as minesweeperInstance } from '../../symbols/minesweeperSymbol.js';
import { instance as viewpointInstance } from '../../symbols/viewpointSymbol.js';
import { instance as connectAllInstance } from '../../rules/connectAllRule.js';
import EventIteratingSolver from '../eventIteratingSolver.js';
import GridData from '../../grid.js';
import { Color } from '../../primitives.js';

export default class CspuzSolver extends EventIteratingSolver {
  private static readonly supportedInstrs = [
    minesweeperInstance.id,
    areaNumberInstance.id,
    letterInstance.id,
    dartInstance.id,
    viewpointInstance.id,
    lotusInstance.id,
    galaxyInstance.id,
    connectAllInstance.id,
    banPatternInstance.id,
    sameShapeInstance.id,
    uniqueShapeInstance.id,
    regionAreaInstance.id,
    cellCountInstance.id,
    offByXInstance.id,
    undercluedInstance.id,
    symbolsPerRegionInstance.id,
  ];

  public readonly id = 'cspuz';

  public readonly author = 'semiexp';

  public readonly description =
    'A blazingly fast WebAssembly solver that supports most rules and symbols (including underclued).';

  protected createWorker(): Worker {
    return new Worker(new URL('./cspuzWorker.js', import.meta.url), {
      type: 'module',
    });
  }

  public isGridSupported(grid: GridData): boolean {
    if (!super.isGridSupported(grid)) {
      return false;
    }

    // special handling for galaxies and lotuses since dual-color symbols are not supported yet
    for (const [_, symbols] of grid.symbols) {
      for (const symbol of symbols) {
        if (symbol instanceof GalaxySymbol || symbol instanceof LotusSymbol) {
          if (symbol.x % 1 !== 0 && symbol.y % 1 !== 0) {
            return false;
          } else if (symbol.x % 1 !== 0 || symbol.y % 1 !== 0) {
            const tile1 = grid.getTile(
              Math.floor(symbol.x),
              Math.floor(symbol.y)
            );
            const tile2 = grid.getTile(
              Math.ceil(symbol.x),
              Math.ceil(symbol.y)
            );
            if (!tile1.fixed || !tile2.fixed || tile1.color !== tile2.color) {
              return false;
            }
          }
        }
      }
    }

    // special handling for fixed gray tiles
    if (grid.getTileCount(true, true, Color.Gray) > 0) {
      return false;
    }

    return true;
  }

  public isInstructionSupported(instructionId: string): boolean {
    return CspuzSolver.supportedInstrs.includes(instructionId);
  }

  public async isEnvironmentSupported(): Promise<boolean> {
    try {
      const abortController = new AbortController();
      for await (const _ of this.solve(
        GridData.create(['.']),
        abortController.signal
      )) {
        abortController.abort();
      }
      return true;
    } catch (_ex) {
      return false;
    }
  }
}
