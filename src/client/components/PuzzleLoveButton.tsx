import { memo } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useOnline } from '../contexts/OnlineContext';
import { useOnlinePuzzle } from '../contexts/OnlinePuzzleContext';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { api, queryClient } from '../online/api';
import Loading from './Loading';
import toast from 'react-hot-toast';

const puzzleLoveQueryOptions = (puzzleId: string, enabled: boolean) =>
  queryOptions({
    queryKey: ['puzzle', 'love', puzzleId],
    queryFn: () => api.getPuzzleLove(puzzleId),
    enabled: enabled && puzzleId.length > 0,
  });

export default memo(function PuzzleLoveButton() {
  const { isOnline, me } = useOnline();
  const { id } = useOnlinePuzzle();
  const puzzleLove = useQuery(puzzleLoveQueryOptions(id, isOnline && !!me));
  const setPuzzleLove = useMutation({
    mutationFn: (data: Parameters<typeof api.setPuzzleLove>) => {
      return api.setPuzzleLove(...data);
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  if (!isOnline || !me) return null;
  if (puzzleLove.isPending) return <Loading className="w-14" />;
  return (
    <button
      className="tooltip tooltip-info tooltip-right btn btn-md btn-ghost flex items-center w-fit focus:z-50"
      data-tip={
        puzzleLove.data!.loved ? 'Unlove this puzzle' : 'Love this puzzle'
      }
      onClick={async () => {
        const newLove = await setPuzzleLove.mutateAsync([
          id,
          !puzzleLove.data!.loved,
        ]);
        await queryClient.setQueryData(['puzzle', 'love', id], {
          loved: newLove.loved,
        });
      }}
    >
      {puzzleLove.data!.loved ? (
        <FaHeart size={24} className="text-primary" />
      ) : (
        <FaRegHeart size={24} />
      )}
    </button>
  );
});
