import { useEffect, useState } from 'react';
import { useGrid } from '../contexts/GridContext';
import { useEdit } from '../contexts/EditContext';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { array } from '@logic-pad/core/data/dataHelper';
import { useGridState } from '../contexts/GridStateContext';
import { PuzzleData, PuzzleMetadata } from '@logic-pad/core/data/puzzle';
import { PuzzleFull } from '../online/data';
import { SolutionHandling } from './linkLoader';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';

interface OnlineLinkLoaderResult {
  originalData: string;
  solutionStripped: boolean;
}

interface OnlineLinkLoaderParams {
  /**
   * Specifies how the solution should be loaded.
   */
  solutionHandling?: SolutionHandling;
  /**
   * Function to modify the loaded puzzle.
   */
  modifyPuzzle?: (puzzle: PuzzleData) => PuzzleData;
}

export default function useOnlineLinkLoader(
  puzzle: PuzzleFull,
  {
    solutionHandling: behavior = SolutionHandling.LoadHidden,
    modifyPuzzle = puzzle => puzzle,
  }: OnlineLinkLoaderParams = {}
): OnlineLinkLoaderResult | undefined {
  const { setId, setLastSaved } = useOnlinePuzzle();
  const { setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  const { setRevealSpoiler } = useGridState();
  const [result, setResult] = useState<OnlineLinkLoaderResult | undefined>(
    undefined
  );
  useEffect(() => {
    void (async () => {
      const result = {
        originalData: puzzle.data,
        solutionStripped: false,
      };
      const decompressed = await Compressor.decompress(puzzle.data);
      const { grid, solution } = modifyPuzzle(
        Serializer.parseGridWithSolution(decompressed)
      );
      const metadata: PuzzleMetadata = {
        title: puzzle.title,
        description: puzzle.description,
        author: puzzle.creator.name,
        difficulty: puzzle.designDifficulty,
      };
      if (behavior === SolutionHandling.LoadVisible && solution) {
        const tiles = array(grid.width, grid.height, (x, y) => {
          const tile = grid.getTile(x, y);
          if (tile.fixed) return tile;
          return tile.withColor(solution.getTile(x, y).color);
        });
        const newGrid = grid.withTiles(tiles);
        setGrid(newGrid, null);
        setLastSaved(newGrid);
      } else if (behavior === SolutionHandling.LoadHidden) {
        setGrid(grid, solution);
        setLastSaved(grid);
      } else {
        result.solutionStripped = solution !== null && grid.requireSolution();
        setGrid(grid, null);
        setLastSaved(grid);
      }
      setId(puzzle.id);
      setMetadata(metadata);
      setRevealSpoiler(false);
      clearHistory(grid);
      setResult(result);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);
  return result;
}
