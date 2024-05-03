import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useEmbed } from '../EmbedContext';
import { useGrid } from '../GridContext';
import Accordion from '../components/Accordion';
import { useGridState } from '../GridStateContext';
import { Color, State } from '../../data/primitives';
import { BiSolidFlagCheckered } from 'react-icons/bi';
import { cn } from '../../utils';
import { BsCreditCard2Front, BsPatchCheckFill } from 'react-icons/bs';
import { FaCircleHalfStroke } from 'react-icons/fa6';
import { MetadataSchema } from '../../data/puzzle';
import { Solver } from '../../data/solver/allSolvers';
import { RiRobot2Fill } from 'react-icons/ri';
import GridData from '../../data/grid';
import { HiViewGrid, HiViewGridAdd } from 'react-icons/hi';

function ChecklistItem({
  icon,
  children,
  tooltip,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <div
      className="flex items-center gap-2 tooltip tooltip-top tooltip-info"
      data-tip={tooltip}
    >
      {icon}
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

  const solverRequest = useRef(0);
  const [isPending, setPending] = useState(false);
  const [solution, setSolution] = useState<TiedToGrid<GridData | null> | null>(
    null
  );
  const [alternate, setAlternate] =
    useState<TiedToGrid<GridData | null> | null>(null);

  useEffect(() => {
    if (solution && !solution.grid.equals(grid)) {
      setSolution(null);
    }
    if (alternate && !alternate.grid.equals(grid)) {
      setAlternate(null);
    }
  }, [grid, solution, alternate]);

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

  const autoSolvable = useMemo(() => Solver.isGridSupported(grid), [grid]);

  const checklistComplete =
    metadataValid &&
    (autoValidation
      ? solution !== null
        ? solution.value !== null
        : solutionIsComplete && solutionIsValid
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
          icon={
            <BsCreditCard2Front
              size={22}
              className={cn(metadataValid ? 'text-success' : 'text-error')}
            />
          }
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
          icon={
            <BiSolidFlagCheckered
              size={22}
              className={cn(
                autoValidation ? 'text-success' : 'text-success/50'
              )}
            />
          }
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
              icon={
                <BsPatchCheckFill
                  size={22}
                  className={cn(
                    solutionIsValid && solutionIsComplete
                      ? 'text-success'
                      : 'text-error'
                  )}
                />
              }
              tooltip="A valid and complete solution is required to prove that the puzzle is solvable"
            >
              {solutionIsValid && solutionIsComplete
                ? 'Solution valid'
                : solutionIsValid
                  ? 'Solution incomplete'
                  : 'Solution invalid'}
            </ChecklistItem>
            {solution !== null || isPending ? (
              <>
                <ChecklistItem
                  key="solution"
                  icon={
                    <HiViewGrid
                      size={22}
                      className={cn(
                        solution !== null
                          ? solution.value !== null
                            ? 'text-success'
                            : 'text-error'
                          : 'opacity-0'
                      )}
                    />
                  }
                  tooltip={
                    solution !== null
                      ? solution.value !== null
                        ? 'Solution found. Click to view'
                        : 'This puzzle has no solution'
                      : 'Solving...'
                  }
                >
                  <span className="flex-1 text-start">
                    {solution !== null
                      ? solution.value !== null
                        ? 'Solution found'
                        : 'No solution'
                      : 'Solving...'}
                  </span>
                  {!!solution?.value && (
                    <button
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
                {solution?.value !== null && (
                  <ChecklistItem
                    key="alternate"
                    icon={
                      <HiViewGridAdd
                        size={22}
                        className={cn(
                          alternate !== null
                            ? alternate.value !== null
                              ? 'text-success/50'
                              : 'text-success'
                            : 'opacity-0'
                        )}
                      />
                    }
                    tooltip={
                      alternate !== null
                        ? alternate.value !== null
                          ? 'Click to view alternate solution'
                          : 'The solution is unique'
                        : 'Looking for alternate solutions...'
                    }
                  >
                    <span className="flex-1 text-start">
                      {alternate !== null
                        ? alternate.value !== null
                          ? 'Solution not unique'
                          : 'Unique solution'
                        : 'Solving...'}
                    </span>
                    {!!alternate?.value && (
                      <button
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
              </>
            ) : (
              <>
                <ChecklistItem
                  key="autoSolvable"
                  icon={
                    <RiRobot2Fill
                      size={22}
                      className={cn(
                        autoSolvable ? 'text-success' : 'text-success/50'
                      )}
                    />
                  }
                  tooltip={
                    autoSolvable
                      ? 'Can be solved automatically by the solver'
                      : 'Cannot be solved automatically'
                  }
                >
                  {autoSolvable ? 'Auto solvable' : 'Not auto solvable'}
                </ChecklistItem>
                <button
                  className="btn btn-outline btn-info btn-sm"
                  onClick={async () => {
                    const requestId = ++solverRequest.current;
                    setPending(true);
                    try {
                      let isAlternate = false;
                      for await (const solution of Solver.solve(grid)) {
                        if (!isAlternate) {
                          if (requestId !== solverRequest.current) break;
                          setSolution({ grid, value: solution });
                          isAlternate = true;
                        } else {
                          if (requestId !== solverRequest.current) break;
                          setAlternate({ grid, value: solution });
                        }
                      }
                    } finally {
                      setPending(false);
                    }
                  }}
                >
                  Solve
                </button>
              </>
            )}
          </>
        ) : (
          <ChecklistItem
            key="solutionIsNotEmpty"
            icon={
              <FaCircleHalfStroke
                size={22}
                className={cn(
                  solutionIsNotEmpty ? 'text-success' : 'text-error'
                )}
              />
            }
            tooltip="Solution cannot be empty"
          >
            {solutionIsNotEmpty ? 'Solution not empty' : 'Solution empty'}
          </ChecklistItem>
        )}
      </div>
    </Accordion>
  );
});
