import GridData from '../../grid';
import Solver from '../solver';
import Worker from './backtrackWorker?worker';
import { instance as areaNumberInstance } from '../../symbols/areaNumberSymbol';
import { instance as viewpointInstance } from '../../symbols/viewpointSymbol';
import { instance as dartInstance } from '../../symbols/dartSymbol';
import { instance as galaxyInstance } from '../../symbols/galaxySymbol';
import { instance as lotusInstance } from '../../symbols/lotusSymbol';
import { instance as myopiaInstance } from '../../symbols/myopiaSymbol';
import { instance as undercluedInstance } from '../../rules/undercluedRule';
import { instance as connectAllInstance } from '../z3/modules/connectAllModule';
import { instance as banPatternInstance } from '../../rules/banPatternRule';
import { instance as regionAreaInstance } from '../../rules/regionAreaRule';
import { Serializer } from '../../serializer/allSerializers';

export default class BacktrackSolver extends Solver {
  private static readonly supportedInstrs = [
    areaNumberInstance.id,
    viewpointInstance.id,
    dartInstance.id,
    galaxyInstance.id,
    lotusInstance.id,
    myopiaInstance.id,
    undercluedInstance.id,
    connectAllInstance.id,
    banPatternInstance.id,
    regionAreaInstance.id,
  ];

  public readonly id = 'backtrack';

  public readonly description =
    'Solves puzzles using backtracking with optimizations (blazingly fast). Support most rules and symbols (including underclued).';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    const worker = new Worker();

    try {
      const solutions = await new Promise<GridData[]>(resolve => {
        worker.addEventListener('message', (e: MessageEvent<string[]>) => {
          resolve(e.data.map((grid: string) => Serializer.parseGrid(grid)));
        });

        worker.postMessage(Serializer.stringifyGrid(grid));
      });

      for (const solution of solutions) {
        yield solution;
      }
      yield null;
    } finally {
      worker.terminate();
    }
  }

  public isInstructionSupported(instructionId: string): boolean {
    return BacktrackSolver.supportedInstrs.some(i => instructionId == i);
  }
}
