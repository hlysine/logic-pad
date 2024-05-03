import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import LetterSymbol, {
  instance as letterInstance,
} from '../../../symbols/letterSymbol';
import { Point } from 'grilops';

export default class LetterModule extends Z3Module {
  public readonly id = letterInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const symbols = grid.symbols.get(this.id) as LetterSymbol[] | undefined;
    if (!symbols || symbols.length === 0) {
      return;
    }

    const rc = ctx.regionConstrainer;

    const letterMap = new Map<string, Arith<Name>>();

    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);
      if (letterMap.has(symbol.letter)) {
        ctx.solver.add(
          letterMap
            .get(symbol.letter)!
            .eq(rc.regionIdGrid.get(new Point(y, x))!)
        );
      } else {
        letterMap.set(symbol.letter, rc.regionIdGrid.get(new Point(y, x))!);
      }
    }

    const letters = Array.from(letterMap.values());

    for (let i = 0; i < letters.length - 1; i++) {
      for (let j = i + 1; j < letters.length; j++) {
        ctx.solver.add(letters[i].neq(letters[j]));
      }
    }
  }
}

export const instance = new LetterModule();
