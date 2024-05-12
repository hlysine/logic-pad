import GridData from '../../grid';
import Solver from '../solver';
import { solve } from './worker';
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

export default class BacktrackAdvancedSolver extends Solver {
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

  public readonly id = 'backtrack advanced';

  public readonly description =
    'Solves puzzles using backtracking with optimizations (blazingly fast). Support most rules and symbols (including underclued).';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    console.log('Solving');

    console.time('Solve time');

    const res = solve(grid);

    console.timeEnd('Solve time');

    console.log(res);

    yield res;
  }

  public isInstructionSupported(instructionId: string): boolean {
    return BacktrackAdvancedSolver.supportedInstrs.some(
      i => instructionId == i
    );
  }
}
