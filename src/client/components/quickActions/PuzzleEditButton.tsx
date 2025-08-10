import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { FaEdit } from 'react-icons/fa';
import { Compressor } from '@logic-pad/core/data/serializer/compressor/allCompressors';
import { Serializer } from '@logic-pad/core/data/serializer/allSerializers';
import { useGrid } from '../../contexts/GridContext';
import { useOnline } from '../../contexts/OnlineContext';
import { useOnlinePuzzle } from '../../contexts/OnlinePuzzleContext';
import { useQuery } from '@tanstack/react-query';
import { puzzleSolveQueryOptions } from '../../routes/_layout.solve.$puzzleId';

export default memo(function PuzzleEditButton() {
  const navigate = useNavigate();
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();
  const puzzleQuery = useQuery(puzzleSolveQueryOptions(id));
  const { metadata, grid, solution } = useGrid();
  return (
    <button
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip={
        puzzleQuery.data?.creator.id === me?.id
          ? 'Edit this puzzle'
          : 'Remix this puzzle'
      }
      onClick={async () => {
        if (
          isOnline &&
          me &&
          puzzleQuery.data &&
          puzzleQuery.data.id === me.id
        ) {
          await navigate({
            to: `/create/${puzzleQuery.data.id}`,
          });
        } else {
          const data = await Compressor.compress(
            Serializer.stringifyPuzzle({ ...metadata, grid, solution })
          );
          await navigate({
            to: '/create',
            search: {
              d: data,
            },
          });
        }
      }}
    >
      <FaEdit size={24} />
    </button>
  );
});
