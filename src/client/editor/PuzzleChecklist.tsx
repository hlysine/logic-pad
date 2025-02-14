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
import { Color, State } from '@logic-pad/core/data/primitives';
import { BiSolidFlagCheckered } from 'react-icons/bi';
import { BsCreditCard2Front, BsPatchCheckFill } from 'react-icons/bs';
import { FaCircleHalfStroke, FaHourglassHalf } from 'react-icons/fa6';
import { MetadataSchema } from '@logic-pad/core/data/puzzle';
import { RiRobot2Fill } from 'react-icons/ri';
import GridData from '@logic-pad/core/data/grid';
import { HiViewGrid, HiViewGridAdd } from 'react-icons/hi';
import { IconBaseProps } from 'react-icons';
import { useSolver } from '../contexts/SolverContext.tsx';
import Loading from '../components/Loading';
import { CancelRef } from '@logic-pad/core/data/solver/solver.ts';

const SolverSelector = lazy(() => import('./SolverSelector'));

function ChecklistItem({
  icon: Icon,
  iconClass,
  children,
  tooltip,
}: {
  icon: React.JSXElementConstructor<IconBaseProps>;
  iconClass: string;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 tooltip tooltip-top tooltip-info"
      data-tip={tooltip}
    >
      <Icon size={22} className={iconClass} />
      {children}
    </div>
  );
}

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
  const [solveRef, setSolveRef] = useState<CancelRef | null>(null);
  const [solution, setSolution] = useState<TiedToGrid<GridData | null> | null>(
    null
  );
  const [alternate, setAlternate] =
    useState<TiedToGrid<GridData | null> | null>(null);

  useEffect(() => {
    if (solution && !solution.grid.resetTiles().equals(grid.resetTiles())) {
      setSolution(null);
      if (solveRef !== null) {
        solveRef.cancel?.();
        setSolveRef(null);
      }
    }
    if (alternate && !alternate.grid.resetTiles().equals(grid.resetTiles())) {
      setAlternate(null);
      if (solveRef !== null) {
        solveRef.cancel?.();
        setSolveRef(null);
      }
    }
  }, [grid, solution, alternate, solveRef]);

  const metadataValid = useMemo(
    () => MetadataSchema.safeParse(metadata).success,
    [metadata]
  );

  const autoValidation = useMemo(() => !grid.requireSolution(), [grid]);

  const solutionIsNotEmpty = useMemo(
    () =>
      grid.tiles.some(row =>
        row.some(tile => !tile.fixed && tile.color !== Color.Gray)
      ),
    [grid]
  );

  const solutionIsComplete = useMemo(() => grid.isComplete(), [grid]);

  const solutionIsValid = state.final !== State.Error;

  const autoSolvable = useMemo(
    () => solver?.isGridSupported(grid) ?? false,
    [solver, grid]
  );

  const checklistComplete =
    metadataValid &&
    (autoValidation
      ? solution !== null
        ? solution.value !== null
        : solutionIsComplete && solutionIsValid
      : solution !== null
        ? solution.value !== null
        : solutionIsNotEmpty);

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
        <ChecklistItem
          key="metadataValid"
          icon={BsCreditCard2Front}
          iconClass={metadataValid ? 'text-success' : 'text-error'}
          tooltip={
            metadataValid
              ? 'All required metadata fields are filled'
              : 'Fill all required metadata fields'
          }
        >
          {metadataValid ? 'Metadata valid' : 'Metadata invalid'}
        </ChecklistItem>
        <ChecklistItem
          key="autoValidation"
          icon={BiSolidFlagCheckered}
          iconClass={autoValidation ? 'text-success' : 'text-success/50'}
          tooltip={
            autoValidation
              ? 'You puzzle solution is automatically validated'
              : 'Only the solution you provide will be accepted'
          }
        >
          {autoValidation ? 'Auto validation' : 'Solution required'}
        </ChecklistItem>
        {autoValidation ? (
          <>
            <ChecklistItem
              key="solutionIsValid"
              icon={BsPatchCheckFill}
              iconClass={
                solutionIsValid && solutionIsComplete
                  ? 'text-success'
                  : 'text-error'
              }
              tooltip="A valid and complete solution is required to prove that the puzzle is solvable"
            >
              {solutionIsValid && solutionIsComplete
                ? 'Solution valid'
                : solutionIsValid
                  ? 'Solution incomplete'
                  : 'Solution invalid'}
            </ChecklistItem>
          </>
        ) : (
          <ChecklistItem
            key="solutionIsNotEmpty"
            icon={FaCircleHalfStroke}
            iconClass={solutionIsNotEmpty ? 'text-success' : 'text-error'}
            tooltip="Solution cannot be empty"
          >
            {solutionIsNotEmpty ? 'Solution not empty' : 'Solution empty'}
          </ChecklistItem>
        )}
        {solution !== null && (
          <>
            <ChecklistItem
              key="solution"
              icon={HiViewGrid}
              iconClass={
                solution.value !== null ? 'text-success' : 'text-error'
              }
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
                icon={HiViewGridAdd}
                iconClass={
                  alternate !== null
                    ? alternate.value !== null
                      ? 'text-success/50'
                      : 'text-success'
                    : 'opacity-0'
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
            icon={FaHourglassHalf}
            iconClass={'text-info'}
            tooltip={
              solution === null
                ? 'Solving...'
                : 'Looking for alternate solutions...'
            }
          >
            <span className="flex-1 text-start">
              {solution === null ? 'Solving...' : 'Verifying...'}
            </span>
            {solveRef?.cancel && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  solveRef.cancel?.();
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
              icon={RiRobot2Fill}
              iconClass={autoSolvable ? 'text-success' : 'text-success/50'}
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
                  const cancelRef: CancelRef = {};
                  setSolveRef(cancelRef);
                  setSolution(null);
                  setAlternate(null);
                  try {
                    let isAlternate = false;
                    for await (const solution of solver.solve(
                      grid,
                      cancelRef
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
                    cancelRef.cancel?.();
                    setSolveRef(null);
                  }
                }}
              />
            </Suspense>
          </>
        )}
      </div>
    </Accordion>
  );
});
