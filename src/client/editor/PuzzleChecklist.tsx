import {
  Suspense,
  lazy,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useEmbed } from '../contexts/EmbedContext.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import Accordion from '../components/Accordion';
import { useGridState } from '../contexts/GridStateContext.tsx';
import {
  PuzzleChecklistItem,
  validatePuzzleChecklist,
} from '@logic-pad/core/data/puzzle';
import GridData from '@logic-pad/core/data/grid';
import { useSolver } from '../contexts/SolverContext.tsx';
import Loading from '../components/Loading';
import { FaCheckCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

const SolverSelector = lazy(() => import('./SolverSelector'));

function ChecklistItem({
  type,
  children,
  tooltip,
}: {
  type: 'success' | 'error' | 'info' | 'none';
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 tooltip tooltip-top tooltip-info"
      data-tip={tooltip}
    >
      {type === 'success' ? (
        <FaCheckCircle size={22} className="text-success" />
      ) : type === 'error' ? (
        <FaTimesCircle size={22} className="text-error" />
      ) : type === 'info' ? (
        <FaInfoCircle size={22} className="text-info" />
      ) : (
        <FaInfoCircle size={22} className="opacity-0" />
      )}
      {children}
    </div>
  );
}

const checklistItemMap = {
  metadataValid: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="metadataValid"
      type={item.success ? 'success' : 'error'}
      tooltip={
        item.success
          ? 'All required metadata fields are filled'
          : 'Fill all required metadata fields'
      }
    >
      {item.success ? 'Metadata valid' : 'Metadata invalid'}
    </ChecklistItem>
  ),
  gridValid: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="gridValid"
      type={item.success ? 'success' : 'error'}
      tooltip={
        item.success
          ? 'Grid dimensions are valid'
          : 'Grid dimensions must be greater than zero'
      }
    >
      {item.success ? 'Grid valid' : 'Grid invalid'}
    </ChecklistItem>
  ),
  autoValidation: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="autoValidation"
      type={item.success ? 'success' : 'info'}
      tooltip={
        item.success
          ? 'You puzzle solution is automatically validated'
          : 'Only the solution you provide will be accepted'
      }
    >
      {item.success ? 'Auto validation' : 'Solution required'}
    </ChecklistItem>
  ),
  solutionIsValid: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="solutionIsValid"
      type={item.success ? 'success' : 'error'}
      tooltip="A valid solution is required to prove that the puzzle is solvable"
    >
      {item.success ? 'Solution valid' : 'Solution invalid'}
    </ChecklistItem>
  ),
  solutionIsComplete: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="solutionIsComplete"
      type={item.success ? 'success' : 'error'}
      tooltip="A complete solution is required to prove that the puzzle is solvable"
    >
      {item.success ? 'Solution complete' : 'Solution incomplete'}
    </ChecklistItem>
  ),
  solutionIsNotEmpty: (item: PuzzleChecklistItem) => (
    <ChecklistItem
      key="solutionIsNotEmpty"
      type={item.success ? 'success' : 'error'}
      tooltip="Solution cannot be empty"
    >
      {item.success ? 'Solution not empty' : 'Solution empty'}
    </ChecklistItem>
  ),
};

interface TiedToGrid<T> {
  grid: GridData;
  value: T;
}

export default memo(function PuzzleChecklist() {
  const { features } = useEmbed();
  const { grid, metadata, setGrid } = useGrid();
  const { state } = useGridState();
  const { solver } = useSolver();

  const solverRequest = useRef(0);
  const [solveRef, setSolveRef] = useState<AbortController | null>(null);
  const [solution, setSolution] = useState<TiedToGrid<GridData | null> | null>(
    null
  );
  const [alternate, setAlternate] =
    useState<TiedToGrid<GridData | null> | null>(null);

  useEffect(() => {
    if (solution && !solution.grid.resetTiles().equals(grid.resetTiles())) {
      setSolution(null);
      if (solveRef !== null) {
        solveRef.abort();
        setSolveRef(null);
      }
    }
    if (alternate && !alternate.grid.resetTiles().equals(grid.resetTiles())) {
      setAlternate(null);
      if (solveRef !== null) {
        solveRef.abort();
        setSolveRef(null);
      }
    }
  }, [grid, solution, alternate, solveRef]);

  const checklist = useMemo(
    () => validatePuzzleChecklist(metadata, grid, state),
    [metadata, grid, state]
  );

  const autoSolvable = useMemo(
    () => solver?.isGridSupported(grid) ?? false,
    [solver, grid]
  );

  const checklistComplete =
    checklist.isValid && (solution === null || solution.value !== null);

  if (!features.checklist) return null;

  return (
    <Accordion
      title={
        <>
          <span>Checklist</span>
          {checklistComplete ? (
            <div className="badge badge-success ml-2">Complete</div>
          ) : (
            <div className="badge badge-error ml-2">Incomplete</div>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-2 text-sm">
        {checklist.items.map(item =>
          checklistItemMap[item.id as keyof typeof checklistItemMap]?.(item)
        )}
        {solution !== null && (
          <>
            <ChecklistItem
              key="solution"
              type={solution.value !== null ? 'success' : 'error'}
              tooltip={
                solution.value !== null
                  ? 'Solution found. Click to view'
                  : 'This puzzle has no solution'
              }
            >
              <span className="flex-1 text-start">
                {solution.value !== null ? 'Solution found' : 'No solution'}
              </span>
              {!!solution?.value && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => {
                    setGrid(solution.value!);
                    setSolution({
                      grid: solution.value!,
                      value: solution.value,
                    });
                    if (alternate) {
                      setAlternate({
                        grid: solution.value!,
                        value: alternate.value,
                      });
                    }
                  }}
                >
                  View
                </button>
              )}
            </ChecklistItem>
            {(alternate !== null || !solveRef) && (
              <ChecklistItem
                key="alternate"
                type={
                  alternate !== null
                    ? alternate.value !== null
                      ? 'info'
                      : 'success'
                    : 'none'
                }
                tooltip={
                  alternate !== null
                    ? alternate.value !== null
                      ? 'Click to view alternate solution'
                      : 'The solution is unique'
                    : 'Alternate solution not reported by solver'
                }
              >
                <span className="flex-1 text-start">
                  {alternate !== null
                    ? alternate.value !== null
                      ? 'Solution not unique'
                      : 'Unique solution'
                    : 'Alternate unavailable'}
                </span>
                {!!alternate?.value && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => {
                      setGrid(alternate.value!);
                      if (solution)
                        setSolution({
                          grid: alternate.value!,
                          value: solution.value,
                        });
                      setAlternate({
                        grid: alternate.value!,
                        value: alternate.value,
                      });
                    }}
                  >
                    View
                  </button>
                )}
              </ChecklistItem>
            )}
            {!solveRef && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setSolution(null);
                  setAlternate(null);
                }}
              >
                Reset solver
              </button>
            )}
          </>
        )}
        {solveRef && (
          <ChecklistItem
            key="solving"
            type="info"
            tooltip={
              solution === null
                ? 'Solving...'
                : 'Looking for alternate solutions...'
            }
          >
            <span className="flex-1 text-start">
              {solution === null ? 'Solving...' : 'Verifying...'}
            </span>
            {solver?.supportsCancellation && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  solveRef.abort();
                  setSolveRef(null);
                }}
              >
                Cancel
              </button>
            )}
          </ChecklistItem>
        )}
        {!solveRef && solution === null && (
          <>
            <ChecklistItem
              key="autoSolvable"
              type={autoSolvable ? 'success' : 'info'}
              tooltip={
                autoSolvable
                  ? 'Can be solved automatically by the solver'
                  : 'Cannot be solved automatically'
              }
            >
              {autoSolvable ? 'Auto solvable' : 'Not auto solvable'}
            </ChecklistItem>
            <Suspense fallback={<Loading />}>
              <SolverSelector
                onSolve={async solver => {
                  const requestId = ++solverRequest.current;
                  const abortController = new AbortController();
                  setSolveRef(abortController);
                  setSolution(null);
                  setAlternate(null);
                  try {
                    let isAlternate = false;
                    for await (const solution of solver.solve(
                      grid,
                      abortController.signal
                    )) {
                      if (!isAlternate) {
                        if (requestId !== solverRequest.current) break;
                        setSolution({ grid, value: solution });
                        isAlternate = true;
                      } else {
                        if (requestId !== solverRequest.current) break;
                        setAlternate({ grid, value: solution });
                        break;
                      }
                    }
                  } catch (ex) {
                    console.error(ex);
                  } finally {
                    abortController.abort();
                    setSolveRef(null);
                  }
                }}
              />
            </Suspense>
          </>
        )}
        {checklistComplete && (
          <button className="btn btn-primary">Publish puzzle</button>
        )}
      </div>
    </Accordion>
  );
});
