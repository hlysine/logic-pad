import { useEffect } from 'react';
import { useGrid } from '../GridContext';
import { useEdit } from '../EditContext';
import { Compressor } from '../../data/serializer/compressor/allCompressors';
import { Serializer } from '../../data/serializer/allSerializers';
import { useNavigate } from '@tanstack/react-router';

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

export default function useLinkLoader(params: PuzzleParams, cleanUrl = false) {
  const { setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  const navigate = useNavigate();
  useEffect(() => {
    if (params.d) {
      Compressor.decompress(params.d)
        .then(async data => {
          const { grid, solution, ...metadata } = Serializer.parsePuzzle(data);
          setGrid(grid, solution);
          setMetadata(metadata);
          clearHistory(grid);
          if (cleanUrl) await navigate({ search: {} });
        })
        .catch(console.log);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
}
