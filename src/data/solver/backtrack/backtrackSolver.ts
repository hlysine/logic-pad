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
import EventIterator from 'event-iterator';
import { instance as letterInstance } from '../../symbols/letterSymbol';

export default class BacktrackSolver extends Solver {
  private static readonly supportedInstrs = [
    areaNumberInstance.id,
    viewpointInstance.id,
    dartInstance.id,
    galaxyInstance.id,
    lotusInstance.id,
    myopiaInstance.id,
    letterInstance.id,
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
      const iterator = new EventIterator<GridData>(({ push, stop, fail }) => {
        worker.postMessage(Serializer.stringifyGrid(grid));

        worker.addEventListener('message', (e: MessageEvent<string | null>) => {
          if (e.data) {
            push(Serializer.parseGrid(e.data));
          } else {
            stop();
          }
        });

        worker.addEventListener('error', (e: ErrorEvent) => {
          alert(`Error while solving!\n${e.message}`);
          fail(new Error(e.message));
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
    return BacktrackSolver.supportedInstrs.some(i => instructionId === i);
  }
}
