import GridData from '../grid';

export default abstract class SolverBase {
  public abstract get id(): string;

  public abstract solve(grid: GridData): AsyncGenerator<GridData | null>;

  public isEnvironmentSupported(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public abstract isInstructionSupported(instructionId: string): boolean;

  public isGridSupported(grid: GridData): boolean {
    if (grid.rules.some(rule => !this.isInstructionSupported(rule.id))) {
      return false;
    }
    if ([...grid.symbols.keys()].some(id => !this.isInstructionSupported(id))) {
      return false;
    }
    return true;
  }
}
