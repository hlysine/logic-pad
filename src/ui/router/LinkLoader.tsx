import { useEffect } from 'react';
import { useGrid } from '../GridContext';
import { useEdit } from '../EditContext';
import Compressor from '../../data/serializer/compressor/allCompressors';
import Serializer from '../../data/serializer/allSerializers';
import { DEV_PUZZLES } from '../DevPuzzles';

export interface PuzzleParams {
  d?: string;
  id?: string;
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
    if(params.id) {
      const { grid, solution, ...metadata } = DEV_PUZZLES.find((p) => p.id === params.id) ?? DEV_PUZZLES[0];
      setGrid(grid, solution);
      setMetadata(metadata);
      clearHistory(grid);
    } else if (params.d) {
      Compressor.decompress(params.d)
        .then(data => {
          const { grid, solution, ...metadata } = Serializer.parsePuzzle(data);
          setGrid(grid, solution);
          setMetadata(metadata);
          clearHistory(grid);
        })
        .catch(console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
  return null;
}
