import { useEffect } from 'react';
import { useGrid } from '../GridContext';
import { useEdit } from '../EditContext';
import Serializer from '../../data/serializer';
import { SerializedPuzzle } from '../../data/puzzle';
import { decompress } from '../../data/helper';

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

export default function LinkLoader({ params }: LinkLoaderProps) {
  const { setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  useEffect(() => {
    if (params.d) {
      decompress(params.d)
        .then(data => {
          const { grid: gridString, ...metadata } = JSON.parse(
            data
          ) as SerializedPuzzle;
          console.log('Loading puzzle by data', metadata, gridString);
          const grid = Serializer.parseGrid(gridString);
          const reset = grid.resetTiles();
          setGrid(reset, grid);
          setMetadata(metadata);
          clearHistory(reset);
        })
        .catch(console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return null;
}
