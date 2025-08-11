import { api } from '../online/api';

class OnlineSolveTracker {
  async completeSolve(
    puzzleId: string,
    msTimeElapsed?: number
  ): Promise<boolean> {
    const alreadySolved = JSON.parse(
      sessionStorage.getItem('alreadySolved') ?? '[]'
    ) as string[];
    if (alreadySolved.includes(puzzleId)) return false;

    alreadySolved.push(puzzleId);
    sessionStorage.setItem('alreadySolved', JSON.stringify(alreadySolved));

    if (msTimeElapsed !== undefined)
      await api.completionSolving(puzzleId, msTimeElapsed);
    await api.completionComplete(puzzleId);
    return true;
  }

  sendSolving(puzzleId: string, msTimeElapsed: number) {
    if (!this.isSolved(puzzleId))
      api.completionSolvingBeacon(puzzleId, msTimeElapsed);
  }

  isSolved(puzzleId: string) {
    const alreadySolved = JSON.parse(
      sessionStorage.getItem('alreadySolved') ?? '[]'
    ) as string[];
    return alreadySolved.includes(puzzleId);
  }

  clearSolveRecords() {
    sessionStorage.removeItem('alreadySolved');
  }
}

export default new OnlineSolveTracker();
