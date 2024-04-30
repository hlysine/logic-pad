import { useEffect } from 'react';
import { useGrid } from '../GridContext';
import { useEdit } from '../EditContext';
import { Compressor } from '../../data/serializer/compressor/allCompressors';
import { Serializer } from '../../data/serializer/allSerializers';
import { useNavigate } from '@tanstack/react-router';
import { array } from '../../data/helper';

export interface PuzzleParams {
  d?: string;
}

export const validateSearch = (
  search: Record<string, unknown>
): PuzzleParams => {
  return {
    d: search.d ? String(search.d) : undefined,
  };
};

export interface LinkLoaderProps {
  params: PuzzleParams;
}

export enum SolutionBehavior {
  LoadVisible = 'visible',
  LoadHidden = 'hidden',
  Remove = 'remove',
}

export default function useLinkLoader(
  params: PuzzleParams,
  cleanUrl = false,
  solutionBehavior = SolutionBehavior.LoadHidden
) {
  const { setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  const navigate = useNavigate();
  useEffect(() => {
    if (params.d) {
      Compressor.decompress(params.d)
        .then(async data => {
          const { grid, solution, ...metadata } = Serializer.parsePuzzle(data);
          if (solutionBehavior === SolutionBehavior.LoadVisible && solution) {
            const tiles = array(grid.width, grid.height, (x, y) => {
              const tile = grid.getTile(x, y);
              if (tile.fixed) return tile;
              return tile.withColor(solution.getTile(x, y).color);
            });
            setGrid(grid.withTiles(tiles), null);
          } else if (solutionBehavior === SolutionBehavior.LoadHidden) {
            setGrid(grid, solution);
          } else {
            setGrid(grid, null);
          }
          setMetadata(metadata);
          clearHistory(grid);
          if (cleanUrl) await navigate({ search: {} });
        })
        .catch(console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
}
