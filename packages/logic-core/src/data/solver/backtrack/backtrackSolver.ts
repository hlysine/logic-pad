import { EventIterator } from 'event-iterator';
import GridData from '../../grid.js';
import { instance as banPatternInstance } from '../../rules/banPatternRule.js';
import { instance as cellCountInstance } from '../../rules/cellCountRule.js';
import { instance as regionAreaInstance } from '../../rules/regionAreaRule.js';
import { instance as sameShapeInstance } from '../../rules/sameShapeRule.js';
import { instance as symbolsPerRegionInstance } from '../../rules/symbolsPerRegionRule.js';
import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import { instance as uniqueShapeInstance } from '../../rules/uniqueShapeRule.js';
import { Serializer } from '../../serializer/allSerializers.js';
import { instance as areaNumberInstance } from '../../symbols/areaNumberSymbol.js';
import { instance as dartInstance } from '../../symbols/dartSymbol.js';
import { instance as galaxyInstance } from '../../symbols/galaxySymbol.js';
import { instance as letterInstance } from '../../symbols/letterSymbol.js';
import { instance as lotusInstance } from '../../symbols/lotusSymbol.js';
import { instance as minesweeperInstance } from '../../symbols/minesweeperSymbol.js';
import { instance as myopiaInstance } from '../../symbols/myopiaSymbol.js';
import { instance as viewpointInstance } from '../../symbols/viewpointSymbol.js';
import Solver from '../solver.js';
import { instance as connectAllInstance } from '../z3/modules/connectAllModule.js';

export default class BacktrackSolver extends Solver {
  private static readonly supportedInstrs = [
    areaNumberInstance.id,
    viewpointInstance.id,
    dartInstance.id,
    galaxyInstance.id,
    lotusInstance.id,
    myopiaInstance.id,
    minesweeperInstance.id,
    letterInstance.id,
    undercluedInstance.id,
    connectAllInstance.id,
    banPatternInstance.id,
    regionAreaInstance.id,
    symbolsPerRegionInstance.id,
    cellCountInstance.id,
    sameShapeInstance.id,
    uniqueShapeInstance.id,
  ];

  public readonly id = 'backtrack';

  public readonly description =
    'Solves puzzles using backtracking with optimizations (blazingly fast). Support most rules and symbols (including underclued).';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    const worker = new Worker(
      new URL(`./backtrackWorker.js`, import.meta.url),
      {
        type: 'module',
      }
    );

    try {
      const iterator = new EventIterator<GridData>(({ push, stop, fail }) => {
        worker.postMessage(Serializer.stringifyGrid(grid.resetTiles()));

        worker.addEventListener('message', (e: MessageEvent<string | null>) => {
          if (e.data) {
            push(Serializer.parseGrid(e.data));
          } else {
            stop();
          }
        });

        worker.addEventListener('error', (e: ErrorEvent) => {
          alert(`Error while solving!\n${e.message}`);
          fail(e as unknown as Error);
        });
      });

      for await (const solution of iterator) {
        yield solution;
      }

      yield null;
    } finally {
      worker.terminate();
    }
  }

  public isInstructionSupported(instructionId: string): boolean {
    return BacktrackSolver.supportedInstrs.includes(instructionId);
  }
}
