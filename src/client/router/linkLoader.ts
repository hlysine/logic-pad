import { useEffect, useState } from 'react';
import { useGrid } from '../contexts/GridContext';
import { useEdit } from '../contexts/EditContext';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { useNavigate } from '@tanstack/react-router';
import { array } from '@logic-pad/core/data/dataHelper';
import { useGridState } from '../contexts/GridStateContext';
import { Puzzle } from '@logic-pad/core/data/puzzle';

export enum SolutionHandling {
  LoadVisible = 'visible',
  LoadHidden = 'hidden',
  Remove = 'remove',
}

function validateLoader(value: string): SolutionHandling | undefined {
  if (Object.values(SolutionHandling).includes(value as SolutionHandling)) {
    return value as SolutionHandling;
  }
  return undefined;
}

export interface PuzzleParams {
  d?: string;
  loader?: SolutionHandling;
}

export const validateSearch = (
  search: Record<string, unknown>
): PuzzleParams => {
  return {
    d: search.d ? String(search.d) : undefined,
    loader: search.loader ? validateLoader(String(search.loader)) : undefined,
  };
};

export interface LinkLoaderProps {
  params: PuzzleParams;
}

interface LinkLoaderResult {
  originalParams: PuzzleParams;
  solutionStripped: boolean;
}

interface LinkLoaderParams {
  /**
   * Whether search params are removed after loading the puzzle.
   */
  cleanUrl?: boolean;
  /**
   * Specifies how the solution should be loaded.
   */
  solutionHandling?: SolutionHandling;
  /**
   * Whether to allow loading empty puzzles.
   */
  allowEmpty?: boolean;
  /**
   * Function to modify the loaded puzzle.
   */
  modifyPuzzle?: (puzzle: Puzzle) => Puzzle;
}

export default function useLinkLoader(
  params: PuzzleParams,
  {
    cleanUrl = false,
    solutionHandling: solutionBehavior = SolutionHandling.LoadHidden,
    allowEmpty = true,
    modifyPuzzle = puzzle => puzzle,
  }: LinkLoaderParams = {}
): LinkLoaderResult | undefined {
  const { setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  const { setRevealSpoiler } = useGridState();
  const navigate = useNavigate({ from: '/solve' });
  const [result, setResult] = useState<LinkLoaderResult | undefined>(undefined);
  useEffect(() => {
    void (async () => {
      const result = {
        originalParams: params,
        solutionStripped: false,
      };
      if (params.d) {
        const behavior = params.loader ?? solutionBehavior;
        const decompressed = await Compressor.decompress(params.d);
        const { grid, solution, ...metadata } = modifyPuzzle(
          Serializer.parsePuzzle(decompressed)
        );
        if (behavior === SolutionHandling.LoadVisible && solution) {
          const tiles = array(grid.width, grid.height, (x, y) => {
            const tile = grid.getTile(x, y);
            if (tile.fixed) return tile;
            return tile.withColor(solution.getTile(x, y).color);
          });
          setGrid(grid.withTiles(tiles), null);
        } else if (behavior === SolutionHandling.LoadHidden) {
          setGrid(grid, solution);
        } else {
          result.solutionStripped = solution !== null && grid.requireSolution();
          setGrid(grid, null);
        }
        setMetadata(metadata);
        setRevealSpoiler(false);
        clearHistory(grid);
        if (cleanUrl) await navigate({ search: {} });
      } else if (!allowEmpty) {
        await navigate({ to: '/' });
      }
      setResult(result);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return result;
}
