import { createLazyFileRoute, useBlocker } from '@tanstack/react-router';
import { memo, RefObject, useMemo, useRef, useSyncExternalStore } from 'react';
import { useRouteProtection } from '../router/useRouteProtection';
import ResponsiveLayout from '../components/ResponsiveLayout';
import { FaExternalLinkAlt, FaTrash, FaUpload } from 'react-icons/fa';
import {
  allSolvers,
  Compressor,
  GridData,
  Serializer,
  State,
  validateGrid,
  validatePuzzleChecklist,
} from '@logic-pad/core/index';
import PQueue from 'p-queue';
import Loading from '../components/Loading';
import Difficulty from '../metadata/Difficulty';
import PuzzleEditorModal, {
  PuzzleEditorRef,
} from '../editor/PuzzleEditorModal';
import { Puzzle } from '@logic-pad/core/data/puzzle';
import { cn } from '../uiHelper';

type UploadEntryData = {
  data: string;
} & (
  | {
      status: 'decoding';
    }
  | {
      status: 'verified';
      gridWithSolution: GridData;
      solutionStatus: 'included' | 'unique' | 'alt';
      title: string;
      description: string;
      author: string;
      difficulty: number;
    }
  | {
      status: 'invalid';
      gridWithSolution: GridData;
      solutionStatus: 'unknown' | 'included' | 'unique' | 'alt' | 'none';
      title: string;
      description: string;
      author: string;
      difficulty: number;
      error: string;
    }
  | {
      status: 'solving';
      gridWithSolution: GridData;
      solutionStatus: 'unknown' | 'included' | 'unique' | 'alt' | 'none';
      title: string;
      description: string;
      author: string;
      difficulty: number;
      error: string;
      solverRef: AbortController;
    }
  | {
      status: 'uploaded' | 'published';
      gridWithSolution: GridData;
      title: string;
      description: string;
      author: string;
      difficulty: number;
      id: string;
    }
);

type UploadEntry = UploadEntryData & {
  listeners: (() => void)[];
};

function getErrorMessage(checklistItem: string) {
  switch (checklistItem) {
    case 'metadataValid':
      return 'Invalid metadata';
    case 'gridValid':
      return 'Invalid grid size';
    case 'solutionIsNotEmpty':
      return 'Missing solution';
    case 'solutionIsComplete':
      return 'Incomplete solution';
    case 'solutionIsValid':
      return 'Invalid solution';
    default:
      return 'Unknown error';
  }
}

const linkRegex = /https?:\/\/[\w\-.]+\/\w+\?(?:[\w=&])*d=([\w_%-]+)/gm;

class UploadManager {
  private uploads: readonly UploadEntry[] = [];
  public taskQueue = new PQueue({ concurrency: 5 });
  private arrayListeners: (() => void)[] = [];

  public subscribeToArray = (listener: () => void) => {
    this.arrayListeners.push(listener);
    return () => {
      this.arrayListeners = this.arrayListeners.filter(l => l !== listener);
    };
  };

  public getUploads = () => {
    return this.uploads;
  };

  public subscribeToEntry = (data: string) => {
    return (listener: () => void) => {
      const entry = this.uploads.find(e => e.data === data);
      if (entry) {
        entry.listeners.push(listener);
        return () => {
          const entry = this.uploads.find(e => e.data === data);
          if (entry)
            entry.listeners = entry.listeners.filter(l => l !== listener);
        };
      }
      return () => {};
    };
  };

  public getEntry = (data: string) => () => {
    return this.uploads.find(e => e.data === data);
  };

  public extractFromText = (text: string) => {
    const links = text.matchAll(linkRegex);
    for (const match of links) {
      if (match[1]) {
        this.add(match[1]);
      }
    }
  };

  public add = (data: string) => {
    if (data.length === 0) return;
    if (this.uploads.find(e => e.data === data)) return;
    const entry: UploadEntry = {
      status: 'decoding',
      data,
      listeners: [],
    };
    this.uploads = [...this.uploads, entry];
    this.enqueueDecode(entry);
    this.notifyArrayChange();
  };

  public edit = (newEntry: {
    data: string;
    gridWithSolution: GridData;
    title: string;
    description: string;
    author: string;
    difficulty: number;
  }) => {
    const entry = this.uploads.find(e => e.data === newEntry.data);
    if (!entry) return;
    const resetGrid = newEntry.gridWithSolution.resetTiles();
    if (resetGrid.colorEquals(newEntry.gridWithSolution)) {
      this.updateEntryVerification(newEntry.data, {
        title: newEntry.title,
        description: newEntry.description,
        author: newEntry.author,
        difficulty: newEntry.difficulty,
        grid: newEntry.gridWithSolution,
        solution: null,
      });
    } else {
      this.updateEntryVerification(newEntry.data, {
        title: newEntry.title,
        description: newEntry.description,
        author: newEntry.author,
        difficulty: newEntry.difficulty,
        grid: resetGrid,
        solution: newEntry.gridWithSolution,
      });
    }
  };

  public delete = (data: string) => {
    this.uploads = this.uploads.filter(e => e.data !== data);
    this.notifyArrayChange();
  };

  private notifyArrayChange = () => {
    for (const listener of this.arrayListeners) {
      listener();
    }
  };

  private notifyEntryChange = (data: string) => {
    const entry = this.uploads.find(e => e.data === data);
    for (const listener of entry?.listeners ?? []) {
      listener();
    }
  };

  private replace = (entry: UploadEntryData) => {
    const index = this.uploads.findIndex(e => e.data === entry.data);
    if (index !== -1) {
      this.uploads = [
        ...this.uploads.slice(0, index),
        { ...entry, listeners: this.uploads[index].listeners },
        ...this.uploads.slice(index + 1),
      ];
      this.notifyEntryChange(entry.data);
    }
  };

  private enqueueDecode = (entry: UploadEntry) => {
    void this.taskQueue.add(
      async () => {
        const puzzle = Serializer.parsePuzzle(
          await Compressor.decompress(decodeURIComponent(entry.data))
        );
        this.updateEntryVerification(entry.data, puzzle);
      },
      { id: entry.data }
    );
  };

  public enqueueSolve = (entry: UploadEntry) => {
    if (entry.status !== 'invalid' && entry.status !== 'verified') return;
    if (
      entry.solutionStatus !== 'included' &&
      entry.solutionStatus !== 'unknown'
    )
      return;
    if (entry.gridWithSolution.requireSolution()) return;
    const controller = new AbortController();
    void (async () => {
      try {
        await this.taskQueue.add(
          async ({ signal }) => {
            let updatedEntry = this.uploads.find(e => e.data === entry.data);
            if (!updatedEntry) return;
            if (
              updatedEntry.status !== 'invalid' &&
              updatedEntry.status !== 'verified'
            )
              return;
            this.replace({
              status: 'solving',
              data: updatedEntry.data,
              title: updatedEntry.title,
              author: updatedEntry.author,
              description: updatedEntry.description,
              difficulty: updatedEntry.difficulty,
              gridWithSolution: updatedEntry.gridWithSolution,
              solutionStatus: 'unknown',
              error: 'Solving',
              solverRef: controller,
            });
            const solver = [...allSolvers.values()][0];
            if (!solver) return;
            try {
              let isAlternate = false;
              for await (const solution of solver.solve(
                updatedEntry.gridWithSolution,
                signal
              )) {
                if (!isAlternate) {
                  updatedEntry = this.uploads.find(e => e.data === entry.data);
                  if (!updatedEntry) return;
                  if (updatedEntry.status !== 'solving') return;
                  if (solution) {
                    this.replace({
                      status: 'solving',
                      data: updatedEntry.data,
                      title: updatedEntry.title,
                      author: updatedEntry.author,
                      description: updatedEntry.description,
                      difficulty: updatedEntry.difficulty,
                      gridWithSolution: solution,
                      solutionStatus: 'unique',
                      error: 'Checking uniqueness',
                      solverRef: controller,
                    });
                  } else {
                    this.replace({
                      status: 'invalid',
                      data: updatedEntry.data,
                      title: updatedEntry.title,
                      author: updatedEntry.author,
                      description: updatedEntry.description,
                      difficulty: updatedEntry.difficulty,
                      gridWithSolution: updatedEntry.gridWithSolution,
                      solutionStatus: 'none',
                      error: 'No solution',
                    });
                  }
                  isAlternate = true;
                } else {
                  updatedEntry = this.uploads.find(e => e.data === entry.data);
                  if (!updatedEntry) return;
                  if (updatedEntry.status !== 'solving') return;
                  if (solution) {
                    this.replace({
                      status: 'verified',
                      data: updatedEntry.data,
                      title: updatedEntry.title,
                      author: updatedEntry.author,
                      description: updatedEntry.description,
                      difficulty: updatedEntry.difficulty,
                      gridWithSolution: updatedEntry.gridWithSolution,
                      solutionStatus: 'alt',
                    });
                  } else {
                    this.replace({
                      status: 'verified',
                      data: updatedEntry.data,
                      title: updatedEntry.title,
                      author: updatedEntry.author,
                      description: updatedEntry.description,
                      difficulty: updatedEntry.difficulty,
                      gridWithSolution: updatedEntry.gridWithSolution,
                      solutionStatus: 'unique',
                    });
                  }
                  break;
                }
              }
            } catch (ex) {
              console.error(ex);
            } finally {
              controller.abort();
              updatedEntry = this.uploads.find(e => e.data === entry.data);
              if (updatedEntry?.status === 'solving') {
                this.replace({
                  status: 'verified',
                  data: updatedEntry.data,
                  title: updatedEntry.title,
                  author: updatedEntry.author,
                  description: updatedEntry.description,
                  difficulty: updatedEntry.difficulty,
                  gridWithSolution: updatedEntry.gridWithSolution,
                  solutionStatus: 'included',
                });
              }
            }
          },
          { id: entry.data, signal: controller.signal }
        );
      } catch (_) {
        const updatedEntry = this.uploads.find(e => e.data === entry.data);
        if (updatedEntry?.status === 'solving') {
          const resetGrid = updatedEntry.gridWithSolution.resetTiles();
          if (resetGrid.colorEquals(updatedEntry.gridWithSolution)) {
            this.updateEntryVerification(updatedEntry.data, {
              title: updatedEntry.title,
              author: updatedEntry.author,
              description: updatedEntry.description,
              difficulty: updatedEntry.difficulty,
              grid: updatedEntry.gridWithSolution,
              solution: null,
            });
          } else {
            this.updateEntryVerification(updatedEntry.data, {
              title: updatedEntry.title,
              author: updatedEntry.author,
              description: updatedEntry.description,
              difficulty: updatedEntry.difficulty,
              grid: resetGrid,
              solution: updatedEntry.gridWithSolution,
            });
          }
        }
      }
    })();
    return controller;
  };

  private updateEntryVerification = (data: string, puzzle: Puzzle) => {
    if (puzzle.solution) {
      const state = validateGrid(puzzle.grid, puzzle.solution);
      const checklist = validatePuzzleChecklist(
        {
          title: puzzle.title,
          description: puzzle.description,
          difficulty: puzzle.difficulty,
          author: puzzle.author,
        },
        puzzle.solution,
        state
      );
      if (checklist.isValid) {
        this.replace({
          status: 'verified',
          data,
          gridWithSolution: puzzle.solution,
          solutionStatus: 'included',
          title: puzzle.title,
          author: puzzle.author,
          description: puzzle.description,
          difficulty: puzzle.difficulty,
        });
      } else {
        this.replace({
          status: 'invalid',
          data,
          gridWithSolution: puzzle.solution,
          solutionStatus: State.isSatisfied(state.final)
            ? 'included'
            : 'unknown',
          title: puzzle.title,
          author: puzzle.author,
          description: puzzle.description,
          difficulty: puzzle.difficulty,
          error: getErrorMessage(
            checklist.items.find(item => !item.success && item.mandatory)?.id ??
              'unknown'
          ),
        });
      }
    } else {
      this.replace({
        status: 'invalid',
        data,
        gridWithSolution: puzzle.grid,
        solutionStatus: 'unknown',
        title: puzzle.title,
        author: puzzle.author,
        description: puzzle.description,
        difficulty: puzzle.difficulty,
        error: getErrorMessage('solutionIsNotEmpty'),
      });
    }
  };
}

function useUploadManager(managerRef: RefObject<UploadManager>) {
  return useSyncExternalStore(
    managerRef.current.subscribeToArray,
    managerRef.current.getUploads
  );
}

function useUploadEntry(managerRef: RefObject<UploadManager>, data: string) {
  return useSyncExternalStore(
    managerRef.current.subscribeToEntry(data),
    managerRef.current.getEntry(data)
  );
}

const UploadEntryRow = memo(function UploadEntryRow({
  data,
  uploadManager,
}: {
  data: string;
  uploadManager: RefObject<UploadManager>;
}) {
  const entry = useUploadEntry(uploadManager, data);
  const puzzleEditorRef = useRef<PuzzleEditorRef>(null);
  const autoSolvable = useMemo(() => {
    if (entry && 'gridWithSolution' in entry) {
      return !entry.gridWithSolution.requireSolution();
    } else {
      return false;
    }
  }, [entry]);
  if (!entry) return null;
  const puzzleInfo =
    entry.status !== 'decoding' ? (
      <div className="flex gap-2 items-center flex-wrap">
        {entry.status === 'solving' && <Loading className="w-6 h-6" />}
        <div className="font-mono max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {entry.title}
        </div>
        <div className="badge badge-secondary badge-sm shrink-0">
          {entry.author}
        </div>
        <Difficulty value={entry.difficulty} size="xs" />
        <div
          className="tooltip tooltip-info tooltip-top"
          data-tip="Open in a new tab"
        >
          <button
            className="btn btn-sm btn-square btn-ghost"
            onClick={async () => {
              const resetGrid = entry.gridWithSolution.resetTiles();
              let puzzle: Puzzle;
              if (resetGrid.colorEquals(entry.gridWithSolution)) {
                puzzle = {
                  title: entry.title,
                  description: entry.description,
                  author: entry.author,
                  difficulty: entry.difficulty,
                  grid: entry.gridWithSolution,
                  solution: null,
                };
              } else {
                puzzle = {
                  title: entry.title,
                  description: entry.description,
                  author: entry.author,
                  difficulty: entry.difficulty,
                  grid: resetGrid,
                  solution: entry.gridWithSolution,
                };
              }
              const data = await Compressor.compress(
                Serializer.stringifyPuzzle(puzzle)
              );
              const url = new URL(window.location.origin);
              url.pathname = '/create';
              url.searchParams.set('loader', 'visible');
              url.searchParams.set('d', data);
              window.open(url.toString(), '_blank');
            }}
          >
            <FaExternalLinkAlt />
          </button>
        </div>
        <div
          className="tooltip tooltip-error tooltip-top"
          data-tip="Delete this puzzle"
        >
          <button
            className="btn btn-sm btn-ghost btn-square text-error"
            onClick={() => uploadManager.current.delete(entry.data)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    ) : (
      <div className="flex gap-2 items-center flex-wrap">
        <Loading className="w-6 h-6" />
        <div className="font-mono max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {entry.data}
        </div>
      </div>
    );
  const controls =
    entry.status === 'invalid' || entry.status === 'verified' ? (
      <>
        {autoSolvable ? (
          <button
            className="btn btn-sm"
            onClick={() => {
              uploadManager.current.enqueueSolve(entry);
            }}
          >
            Auto-solve
          </button>
        ) : (
          <div className="btn btn-sm btn-disabled">Not auto-solvable</div>
        )}
        <button
          className="btn btn-sm"
          onClick={() => {
            puzzleEditorRef.current?.open(
              {
                title: entry.title,
                description: entry.description,
                author: entry.author,
                difficulty: entry.difficulty,
              },
              entry.gridWithSolution
            );
          }}
        >
          Edit
        </button>
        <PuzzleEditorModal
          ref={puzzleEditorRef}
          onChange={(metadata, gridWithSolution) => {
            uploadManager.current.edit({
              data: entry.data,
              title: metadata.title,
              description: metadata.description,
              author: metadata.author,
              difficulty: metadata.difficulty,
              gridWithSolution,
            });
          }}
        />
        <div
          className={cn(
            'badge shrink-0',
            (entry.solutionStatus === 'alt' ||
              entry.solutionStatus === 'included') &&
              'badge-info',
            entry.solutionStatus === 'unique' && 'badge-success',
            (entry.solutionStatus === 'none' ||
              entry.solutionStatus === 'unknown') &&
              'badge-error'
          )}
        >
          {entry.solutionStatus === 'alt' && 'Alternate solution'}
          {entry.solutionStatus === 'unknown' && 'Unknown solution'}
          {entry.solutionStatus === 'included' && 'Solution provided'}
          {entry.solutionStatus === 'unique' && 'Unique solution'}
          {entry.solutionStatus === 'none' && 'No solution'}
        </div>
      </>
    ) : entry.status === 'solving' ? (
      <>
        <button
          className="btn btn-sm"
          onClick={() => {
            entry.solverRef.abort();
          }}
        >
          Cancel solve
        </button>
      </>
    ) : null;
  const statusBadge =
    entry.status === 'decoding' ? (
      <div className="badge shrink-0">Decoding...</div>
    ) : entry.status === 'invalid' ? (
      <div className="badge badge-error shrink-0">Invalid</div>
    ) : entry.status === 'verified' ? (
      <div className="badge badge-success shrink-0">Verified</div>
    ) : entry.status === 'solving' ? (
      <div className="badge badge-info shrink-0">Solving...</div>
    ) : null;

  return (
    <div key={entry.data} className="flex flex-col gap-1">
      <div className="flex gap-2 items-center justify-between min-h-8 flex-wrap">
        {puzzleInfo}
        <div className="flex gap-2 items-center flex-wrap">
          {'error' in entry && <div>{entry.error}</div>}
          {controls}
          {statusBadge}
        </div>
      </div>
      <div className="divider m-0" />
    </div>
  );
});

export const Route = createLazyFileRoute('/_layout/uploader')({
  component: memo(function Uploader() {
    useRouteProtection('login');
    const uploadManager = useRef<UploadManager>(null!);
    uploadManager.current ??= new UploadManager();

    const entries = useUploadManager(uploadManager);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useBlocker({
      shouldBlockFn: () => !window.confirm('Are you sure you want to leave?'),
      disabled: entries.length === 0,
    });

    return (
      <ResponsiveLayout>
        <div className="text-3xl">
          <FaUpload className="inline-block me-4" />
          Puzzle uploader [WIP]
        </div>
        <div>
          Paste puzzles links into the box below. You can paste multiple links
          and their data will be automatically extracted.
        </div>
        <div>
          You can edit the extracted puzzle data before uploading or use the
          auto solver to generate missing solutions.
        </div>
        <div className="flex gap-2 items-center justify-between">
          <div>{entries.length} uploads</div>
          <button
            className="btn btn-sm"
            onClick={() => {
              uploadManager.current.getUploads().forEach(entry => {
                uploadManager.current.enqueueSolve(entry);
              });
            }}
          >
            Auto-solve all
          </button>
        </div>
        <div className="divider m-0" />
        {entries.map(entry => (
          <UploadEntryRow
            key={entry.data}
            data={entry.data}
            uploadManager={uploadManager}
          />
        ))}
        <textarea
          ref={textareaRef}
          placeholder="Paste puzzle links here"
          className="textarea textarea-bordered"
        ></textarea>
        <button
          className="btn btn-primary"
          onClick={() => {
            uploadManager.current.extractFromText(
              textareaRef.current?.value ?? ''
            );
            textareaRef.current!.value = '';
          }}
        >
          Load links
        </button>
      </ResponsiveLayout>
    );
  }),
});
